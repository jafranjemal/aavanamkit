import jsPDF from "jspdf";
import { Packer } from "docx";
import { saveAs } from "file-saver";
import { buildDocx } from "./docxBuilder"; // We will create this next
import { exportToPdf as exPdf } from "./pdfExporter"; // We will create this next
import Konva from "konva";
import JsBarcode from "jsbarcode";
// --- Central HTML Generation ---
// Creates a self-contained HTML string from the template and data
const generatePrintHtml = (template, data) => {
  const { pageSettings, pages } = template;
  const pageTemplate = pages[0]; // Assuming single page template for now
  const {
    width,
    height,
    marginTop,
    marginLeft,
    marginRight,
    marginBottom,
    mode,
  } = pageSettings;

  // --- Style Generation ---
  // This function converts element properties into an inline CSS string.
  const getElementStyle = (el) => {
    let style = `position: absolute; box-sizing: border-box;`;
    style += `left: ${el.x + marginLeft}pt; top: ${el.y + marginTop}pt;`;
    style += `width: ${el.width}pt; height: ${el.height}pt;`;
    if (el.rotation) style += `transform: rotate(${el.rotation}deg);`;
    if (el.fill) style += `color: ${el.fill};`; // For text
    if (el.fontSize) style += `font-size: ${el.fontSize}pt;`;
    if (el.fontStyle)
      style += `font-style: ${
        el.fontStyle.includes("italic") ? "italic" : "normal"
      };`;
    if (el.fontStyle)
      style += `font-weight: ${
        el.fontStyle.includes("bold") ? "bold" : "normal"
      };`;
    if (el.align) style += `text-align: ${el.align};`;
    return style;
  };

  // --- Element Rendering ---
  // This function converts a single element object into an HTML string.
  const renderElement = (el) => {
    if (!checkCondition(el, data)) return ""; // Check conditional rendering

    let elementData = { ...el };
    if (el.dataBinding) {
      const boundValue = get(data, el.dataBinding.field);
      if (boundValue !== undefined) {
        elementData[el.dataBinding.property] = boundValue;
      }
    }

    const style = getElementStyle(elementData);

    switch (elementData.type) {
      case "Text":
        return `<div style="${style}">${elementData.text}</div>`;
      case "Image":
        return `<img src="${getProxiedUrl(
          elementData.src
        )}" style="${style} object-fit: cover;" />`;
      case "Shape": {
        const shapeStyle = `background-color: ${
          elementData.fill || "transparent"
        }; border: ${elementData.strokeWidth || 0}pt solid ${
          elementData.stroke || "transparent"
        };`;
        return `<div style="${style} ${shapeStyle}"></div>`;
      }
      case "Barcode": {
        // Barcodes are rendered to a canvas and converted to a data URL.
        const canvas = document.createElement("canvas");
        JsBarcode(canvas, elementData.text, { displayValue: false, margin: 0 });
        return `<img src="${canvas.toDataURL()}" style="${style}" />`;
      }
      default:
        return "";
    }
  };

  const renderTable = (el) => {
    const tableData = el.dataBinding
      ? get(data, el.dataBinding.field) || []
      : [];
    if (!tableData.length) return "";

    const style = getElementStyle(el);
    const { header = {}, rows = {}, columns = [] } = el;
    let tableHtml = `<table style="width: 100%; border-collapse: collapse;">`;
    // Header
    const headerStyle = `height: ${header.height || 30}pt; background-color: ${
      header.backgroundColor || "#f0f0f0"
    }; color: ${header.textColor || "#000"}; font-size: ${
      header.fontSize || 12
    }pt; font-weight: bold;`;
    tableHtml += `<thead><tr>`;
    columns.forEach(
      (col) =>
        (tableHtml += `<th style="text-align: left; padding: 5pt; border-bottom: 1pt solid black; ${headerStyle}">${col.header}</th>`)
    );
    tableHtml += `</tr></thead>`;
    // Body
    tableHtml += `<tbody>`;
    tableData.forEach((item, index) => {
      const rowBg =
        index % 2 === 0
          ? rows.evenBackgroundColor || "#fff"
          : rows.oddBackgroundColor || "#f9f9f9";
      const rowStyle = `min-height: ${
        rows.minHeight || 25
      }pt; background-color: ${rowBg}; color: ${
        rows.textColor || "#333"
      }; font-size: ${rows.fontSize || 10}pt;`;
      tableHtml += `<tr style="${rowStyle}">`;
      columns.forEach(
        (col) =>
          (tableHtml += `<td style="padding: 5pt; border-bottom: 1pt solid #ccc; vertical-align: top;">${
            item[col.dataKey] || ""
          }</td>`)
      );
      tableHtml += `</tr>`;
    });
    tableHtml += `</tbody></table>`;

    return `<div style="${style}">${tableHtml}</div>`;
  };

  // --- Main Body Construction ---
  let body = "";
  let tableHtml = "";
  pageTemplate.elements.forEach((el) => {
    if (el.type === "Table") {
      tableHtml = renderTable(el); // Handle table separately
    } else {
      body += renderElement(el);
    }
  });
  // Add table last to allow it to affect flow in roll mode
  body += tableHtml;

  // --- Final HTML Document Assembly ---
  const pageHeight = mode === "roll" ? "auto" : `${height}pt`;
  let bodyStyle = `width: ${width}pt; height: ${pageHeight}; margin: 0; background-color: ${
    pageTemplate.backgroundColor || "#fff"
  }; position: relative;`;
  if (pageTemplate.backgroundImage) {
    bodyStyle += `background-image: url(${getProxiedUrl(
      pageTemplate.backgroundImage
    )}); background-size: cover;`;
  }

  return `
        <html>
            <head><title>Print Preview</title>
            <style>
                @page { size: ${width}pt ${pageHeight}; margin: 0; }
                body { font-family: sans-serif; }
            </style>
            </head>
            <body style="${bodyStyle}">${body}</body>
        </html>
    `;
};

// --- Export Functions ---
// --- Helper Functions ---
const get = (obj, path) =>
  path
    .replace(/\[\]$/, "")
    .split(".")
    .reduce((acc, part) => acc && acc[part], obj);
const getProxiedUrl = (url) => {
  if (!url || !url.startsWith("http")) return url;
  return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
};
const checkCondition = (element, data) => {
  if (!element.conditional || !element.conditional.field) return true;
  const { field, operator, value } = element.conditional;
  const dataValue = get(data, field);
  switch (operator) {
    case "exists":
      return dataValue !== undefined && dataValue !== null && dataValue !== "";
    case "notExists":
      return dataValue === undefined || dataValue === null || dataValue === "";
    case "==":
      return String(dataValue) == String(value);
    case "!=":
      return String(dataValue) != String(value);
    case ">":
      return Number(dataValue) > Number(value);
    case "<":
      return Number(dataValue) < Number(value);
    default:
      return true;
  }
};

// A helper function to calculate the wrapped height of a text string.
const getWrappedTextHeight = (text, width, fontSize) => {
  if (!text) return 0;
  const tempText = new Konva.Text({
    text: String(text),
    width: width - 10, // Subtract padding
    fontSize: fontSize,
    fontFamily: "sans-serif",
  });
  return tempText.height();
};

// --- PDF EXPORT (WITH PAGINATION) ---
const preloadImages = (elements) => {
  const imagePromises = elements
    .filter(
      (el) =>
        (el.type === "Image" && el.src) ||
        (el.type === "Page" && el.backgroundImage)
    )
    .map((el) => {
      const src = el.src || el.backgroundImage;
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = getProxiedUrl(src);
        img.onload = () => resolve({ id: el.id, image: img });
        img.onerror = () => resolve({ id: el.id, image: null });
      });
    });
  return Promise.all(imagePromises);
};

export const exportToPdf = async (template, data) => {
  const { pageSettings, pages } = template;
  const pageTemplate = pages[0];
  const pdf = new jsPDF({
    orientation: pageSettings.orientation,
    unit: "pt",
    format:
      pageSettings.size === "custom"
        ? [pageSettings.width, pageSettings.height]
        : pageSettings.size,
  });

  const tableElement = pageTemplate.elements.find((el) => el.type === "Table");
  const staticElements = pageTemplate.elements.filter(
    (el) => el.type !== "Table"
  );
  const tableData =
    tableElement && tableElement.dataBinding
      ? get(data, tableElement.dataBinding.field) || []
      : [];

  const allImageElements = [
    ...pageTemplate.elements,
    {
      id: "page-bg",
      type: "Page",
      backgroundImage: pageTemplate.backgroundImage,
    },
  ];
  const preloadedImages = await preloadImages(allImageElements);

  // --- Row Calculation and Page Chunking ---
  const pageChunks = [];
  if (tableElement) {
    // THE FIX: Provide default empty objects for header and rows to prevent crash
    const {
      header = {},
      rows = {},
      y: tableY,
      height: tableHeight,
    } = tableElement;
    let availableHeight = tableHeight - (header.height || 30);
    let currentChunk = [];

    tableData.forEach((item) => {
      let maxHeight = rows.minHeight || 25;
      tableElement.columns.forEach((col) => {
        const cellHeight =
          getWrappedTextHeight(
            item[col.dataKey],
            col.width,
            rows.fontSize || 10
          ) + 10;
        maxHeight = Math.max(maxHeight, cellHeight);
      });

      if (availableHeight < maxHeight && currentChunk.length > 0) {
        pageChunks.push(currentChunk);
        currentChunk = [];
        availableHeight = tableHeight - (header.height || 30);
      }

      if (availableHeight >= maxHeight) {
        currentChunk.push({ data: item, height: maxHeight });
        availableHeight -= maxHeight;
      } else if (currentChunk.length === 0) {
        currentChunk.push({ data: item, height: maxHeight });
        pageChunks.push(currentChunk);
        currentChunk = [];
        availableHeight = tableHeight - (header.height || 30);
      }
    });
    if (currentChunk.length > 0) pageChunks.push(currentChunk);
  }

  // --- Page Rendering Loop ---
  const totalPages = pageChunks.length || 1;
  for (let i = 0; i < totalPages; i++) {
    if (i > 0) pdf.addPage();
    const stage = new Konva.Stage({
      container: document.createElement("div"),
      width: pageSettings.width,
      height: pageSettings.height,
    });
    const layer = new Konva.Layer();
    stage.add(layer);

    // 1. Render Background
    if (pageTemplate.backgroundColor)
      layer.add(
        new Konva.Rect({
          x: 0,
          y: 0,
          width: pageSettings.width,
          height: pageSettings.height,
          fill: pageTemplate.backgroundColor,
        })
      );
    const bgImage = preloadedImages.find((p) => p.id === "page-bg");
    if (bgImage?.image)
      layer.add(
        new Konva.Image({
          x: 0,
          y: 0,
          width: pageSettings.width,
          height: pageSettings.height,
          image: bgImage.image,
        })
      );

    // 2. Render all Static Elements on EVERY page
    staticElements.forEach((element) => {
      if (!checkCondition(element, data)) return;
      let props = { ...element };
      if (element.dataBinding)
        props[element.dataBinding.property] = get(
          data,
          element.dataBinding.field
        );

      let node;
      switch (element.type) {
        case "Image": {
          const preloaded = preloadedImages.find((p) => p.id === element.id);
          if (preloaded?.image)
            node = new Konva.Image({ ...props, image: preloaded.image });
          break;
        }
        case "Text":
          node = new Konva.Text(props);
          break;
        case "Shape":
          if (element.shape === "line")
            node = new Konva.Line({ ...props, points: [0, 0, props.width, 0] });
          else if (element.shape === "circle")
            node = new Konva.Circle({ ...props, radius: props.width / 2 });
          else node = new Konva.Rect(props);
          break;
        case "Barcode": {
          const canvas = document.createElement("canvas");
          try {
            JsBarcode(canvas, props.text, { displayValue: false, margin: 0 });
          } catch (e) {}
          node = new Konva.Image({ ...props, image: canvas });
          break;
        }
      }
      if (node) layer.add(node);
    });

    // 3. Render the Table for the current page
    if (tableElement) {
      const chunk = pageChunks[i] || [];
      let cursorY = tableElement.y;
      const {
        x: tableX,
        width: tableWidth,
        columns,
        header = {},
        rows = {},
      } = tableElement;
      const headerHeight = header.height || 30;

      // Render Header
      layer.add(
        new Konva.Rect({
          x: tableX,
          y: cursorY,
          width: tableWidth,
          height: headerHeight,
          fill: header.backgroundColor || "#f0f0f0",
        })
      );
      columns.forEach((col, colIndex) => {
        const colX =
          tableX +
          columns.slice(0, colIndex).reduce((acc, c) => acc + c.width, 0);
        layer.add(
          new Konva.Text({
            x: colX + 5,
            y: cursorY + 5,
            width: col.width - 10,
            height: headerHeight - 10,
            text: col.header,
            fontSize: header.fontSize || 12,
            fill: header.textColor || "#000",
            fontStyle: "bold",
            verticalAlign: "middle",
          })
        );
      });
      cursorY += headerHeight;

      // Render Rows for this page's chunk
      chunk.forEach((row, rowIndex) => {
        const rowBgColor =
          rowIndex % 2 === 0
            ? rows.evenBackgroundColor || "#fff"
            : rows.oddBackgroundColor || "#f9f9f9";
        layer.add(
          new Konva.Rect({
            x: tableX,
            y: cursorY,
            width: tableWidth,
            height: row.height,
            fill: rowBgColor,
          })
        );
        columns.forEach((col, colIndex) => {
          const colX =
            tableX +
            columns.slice(0, colIndex).reduce((acc, c) => acc + c.width, 0);
          layer.add(
            new Konva.Text({
              x: colX + 5,
              y: cursorY + 5,
              width: col.width - 10,
              height: row.height - 10,
              text: String(row.data[col.dataKey] || ""),
              fontSize: rows.fontSize || 10,
              fill: rows.textColor || "#333",
              verticalAlign: "middle",
              wrap: "word",
            })
          );
        });
        cursorY += row.height;
      });
    }

    layer.draw();
    pdf.addImage(
      stage.toDataURL({ pixelRatio: 2 }),
      "PNG",
      0,
      0,
      pageSettings.width,
      pageSettings.height
    );
    stage.destroy();
  }

  pdf.save("AavanamKit-Invoice.pdf");
};

export const exportToPrintView = (template, data) => {
  const html = generatePrintHtml(template, data);
  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
};

export const exportToPrinter = (template, data) => {
  const html = generatePrintHtml(template, data);
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  document.body.appendChild(iframe);
  iframe.contentDocument.write(html);
  iframe.contentDocument.close();
  iframe.contentWindow.print();
  document.body.removeChild(iframe);
};

export const exportToHtmlFile = (template, data) => {
  const html = generatePrintHtml(template, data);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  saveAs(blob, "invoice.html");
};

export const exportToDocx = async (template, data) => {
  console.log("Building DOCX document... (this may take a moment)");

  // THE FIX: We must 'await' the result of buildDocx because it's an async function.
  // This ensures 'doc' is a fully-formed Document object, not a Promise.
  const doc = await buildDocx(template, data);

  console.log("Packing DOCX document...");

  // Packer.toBlob is also asynchronous and must be awaited.
  const blob = await Packer.toBlob(doc);

  console.log("Saving file...");
  saveAs(blob, "AavanamKit-Invoice.docx");
};

// export const exportToDocx = async (template, data) => {
//   const doc = buildDocx(template, data); // Uses the docx builder
//   console.log({ doc });
//   const blob = await Packer.toBlob(doc);
//   saveAs(blob, "invoice.docx");
// };
