const {
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
} = require("docx");
const {
  get,
  normalizeColor,
  getImageBuffer,
  generateBarcodeBuffer,
  checkCondition,
} = require("./utils");
const { createCanvas } = require("canvas");

const DEFAULT_TABLE_PROPS = {
  header: { fontSize: 12, backgroundColor: "#f0f0f0", textColor: "#000000" },
  rows: {
    fontSize: 10,
    textColor: "#333333",
    evenBackgroundColor: "#ffffff",
    oddBackgroundColor: "#f9f9f9",
  },
};

const generateShapeBuffer = (el) => {
  const canvas = createCanvas(el.width, el.height);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = normalizeColor(el.fill);
  ctx.strokeStyle = normalizeColor(el.stroke);
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
  return canvas.toBuffer("image/png");
};

async function generateDocx({ template, data, schema }) {
  const { pageSettings, pages } = template;
  const pageTemplate = pages[0];
  const sortedElements = [...pageTemplate.elements].sort((a, b) => a.y - b.y);

  const children = await Promise.all(
    sortedElements.map(async (el) => {
      if (!checkCondition(el, data)) return null;
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
                color: normalizeColor(elementData.fill).replace("#", ""),
              }),
            ],
            alignment: elementData.align?.toUpperCase() || AlignmentType.LEFT,
          });
        case "Image":
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
        case "Shape":
          const shapeBuffer = generateShapeBuffer(elementData);
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
        case "Barcode":
          const barcodeBuffer = generateBarcodeBuffer(elementData);
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
        case "Table":
          const safeTableElement = {
            ...DEFAULT_TABLE_PROPS,
            ...elementData,
            header: { ...DEFAULT_TABLE_PROPS.header, ...elementData.header },
            rows: { ...DEFAULT_TABLE_PROPS.rows, ...elementData.rows },
          };
          const tableData = safeTableElement.dataBinding
            ? get(data, safeTableElement.dataBinding.field) || []
            : [];
          if (!tableData.length) return null;

          const { header, rows, columns } = safeTableElement;
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
                          color: normalizeColor(header.textColor).replace(
                            "#",
                            ""
                          ),
                        }),
                      ],
                    }),
                  ],
                  shading: {
                    fill: normalizeColor(header.backgroundColor).replace(
                      "#",
                      ""
                    ),
                  },
                })
            ),
            tableHeader: true,
          });
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
                              color: normalizeColor(rows.textColor).replace(
                                "#",
                                ""
                              ),
                            }),
                          ],
                        }),
                      ],
                      shading: {
                        fill: normalizeColor(
                          index % 2 === 0
                            ? rows.evenBackgroundColor
                            : rows.oddBackgroundColor
                        ).replace("#", ""),
                      },
                    })
                ),
              })
          );
          return new Table({
            rows: [headerRow, ...dataRows],
            width: { size: 100, type: WidthType.PERCENTAGE },
          });
        default:
          return null;
      }
    })
  );

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
        children: children.filter((c) => c),
      },
    ],
  });

  return Packer.toBuffer(doc);
}

module.exports = { generateDocx };
