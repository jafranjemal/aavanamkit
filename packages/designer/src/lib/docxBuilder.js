import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  ImageRun,
  AlignmentType,
  WidthType,
} from "docx";
import * as colornames from "colornames";
import * as JsBarcode from "jsbarcode";

// --- Helper Functions ---

const get = (obj, path) =>
  path.split(".").reduce((acc, part) => acc && acc[part], obj);

function normalizeColor(colorStr) {
  if (!colorStr || typeof colorStr !== "string") return "000000";
  if (colorStr.startsWith("#")) return colorStr.replace("#", "");
  const toHex = colornames.default || colornames;
  const hex = toHex(colorStr.toLowerCase());
  return hex ? hex.replace("#", "") : "000000";
}

const getProxiedUrl = (url) => {
  if (!url || !url.startsWith("http")) return url;
  return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
};

// Fetches an image and returns it as a buffer (Uint8Array) for docx
const getImageBuffer = async (src) => {
  try {
    const proxiedUrl = getProxiedUrl(src);
    const response = await fetch(proxiedUrl);
    if (!response.ok) throw new Error("Image fetch failed");
    return response.arrayBuffer();
  } catch (error) {
    console.error("Could not fetch image for docx:", error);
    return null;
  }
};

// Generates a shape on a canvas and returns it as a buffer
const generateShapeBuffer = (el) => {
  const canvas = document.createElement("canvas");
  canvas.width = el.width;
  canvas.height = el.height;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = el.fill || "transparent";
  ctx.strokeStyle = el.stroke || "transparent";
  ctx.lineWidth = el.strokeWidth || 0;

  if (el.shape === "rect") {
    ctx.fillRect(0, 0, el.width, el.height);
    if (el.strokeWidth > 0) ctx.strokeRect(0, 0, el.width, el.height);
  } else if (el.shape === "circle") {
    ctx.beginPath();
    ctx.arc(el.width / 2, el.height / 2, el.width / 2, 0, 2 * Math.PI);
    ctx.fill();
    if (el.strokeWidth > 0) ctx.stroke();
  }

  return new Promise((resolve) =>
    canvas.toBlob((blob) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsArrayBuffer(blob);
    })
  );
};

// Generates a barcode and returns it as a buffer
const generateBarcodeBuffer = (el) => {
  const canvas = document.createElement("canvas");
  try {
    const barcodeGenerator = JsBarcode.default || JsBarcode;
    barcodeGenerator(canvas, el.text, {
      displayValue: false,
      margin: 0,
      width: 2,
      height: 50,
    });
    return new Promise((resolve) =>
      canvas.toBlob((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsArrayBuffer(blob);
      })
    );
  } catch (e) {
    console.error("Barcode generation failed for docx:", e);
    return null;
  }
};

// --- Main Builder Function ---

export const buildDocx = async (template, data) => {
  const { pageSettings, pages } = template;
  const pageTemplate = pages[0];
  const sortedElements = [...pageTemplate.elements].sort((a, b) => a.y - b.y);

  // Process all elements asynchronously
  const children = await Promise.all(
    sortedElements.map(async (el) => {
      let elementData = { ...el };
      if (el.dataBinding) {
        const boundValue = get(data, el.dataBinding.field);
        if (boundValue !== undefined)
          elementData[el.dataBinding.property] = boundValue;
      }

      switch (elementData.type) {
        case "Text":
          return new Paragraph({
            children: [
              new TextRun({
                text: elementData.text,
                size: (elementData.fontSize || 12) * 2,
                bold: elementData.fontStyle?.includes("bold"),
                italic: elementData.fontStyle?.includes("italic"),
                color: normalizeColor(elementData.fill),
              }),
            ],
            alignment: elementData.align?.toUpperCase() || AlignmentType.LEFT,
          });

        case "Image": {
          const imageBuffer = await getImageBuffer(elementData.src);
          if (!imageBuffer) return new Paragraph("[Image could not be loaded]");
          return new Paragraph({
            children: [
              new ImageRun({
                data: imageBuffer,
                transformation: {
                  width: elementData.width,
                  height: elementData.height,
                },
              }),
            ],
          });
        }

        case "Shape": {
          const shapeBuffer = await generateShapeBuffer(elementData);
          if (!shapeBuffer) return new Paragraph("");
          return new Paragraph({
            children: [
              new ImageRun({
                data: shapeBuffer,
                transformation: {
                  width: elementData.width,
                  height: elementData.height,
                },
              }),
            ],
          });
        }
        case "Barcode": {
          const barcodeBuffer = await generateBarcodeBuffer(elementData);
          if (!barcodeBuffer)
            return new Paragraph("[Barcode could not be generated]");
          return new Paragraph({
            children: [
              new ImageRun({
                data: barcodeBuffer,
                transformation: {
                  width: elementData.width,
                  height: elementData.height,
                },
              }),
            ],
          });
        }

        case "Table": {
          const tableData = el.dataBinding
            ? get(data, el.dataBinding.field.replace("[]", "")) || []
            : [];
          if (!tableData.length) return new Paragraph("");

          const { header, rows, columns } = el;

          // Header Row
          const headerRow = new TableRow({
            children: columns.map(
              (col) =>
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: col.header,
                          bold: true,
                          size: header.fontSize * 2,
                          color: normalizeColor(header.textColor),
                        }),
                      ],
                    }),
                  ],
                  shading: { fill: normalizeColor(header.backgroundColor) },
                })
            ),
            tableHeader: true,
          });

          // Data Rows
          const dataRows = tableData.map(
            (item, index) =>
              new TableRow({
                children: columns.map(
                  (col) =>
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: String(item[col.dataKey] || ""),
                              size: rows.fontSize * 2,
                              color: normalizeColor(rows.textColor),
                            }),
                          ],
                        }),
                      ],
                      shading: {
                        fill: normalizeColor(
                          index % 2 === 0
                            ? rows.evenBackgroundColor
                            : rows.oddBackgroundColor
                        ),
                      },
                    })
                ),
              })
          );

          return new Table({
            rows: [headerRow, ...dataRows],
            width: { size: 100, type: WidthType.PERCENTAGE },
          });
        }
        default:
          return new Paragraph("");
      }
    })
  );

  // Assemble the final document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              width: pageSettings.width * 20,
              height: pageSettings.height * 20,
              orientation: pageSettings.orientation,
            },
            margin: {
              top: pageSettings.marginTop * 20,
              bottom: pageSettings.marginBottom * 20,
              left: pageSettings.marginLeft * 20,
              right: pageSettings.marginRight * 20,
            },
          },
        },
        children: children.filter((c) => c), // Filter out any null/empty paragraphs
      },
    ],
  });

  return doc;
};
