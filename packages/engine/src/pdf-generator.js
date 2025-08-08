const PDFDocument = require("pdfkit");
const {
  get,
  normalizeColor,
  getImageBuffer,
  generateBarcodeBuffer,
  checkCondition,
  getWrappedTextHeight,
} = require("./utils");

const DEFAULT_TABLE_PROPS = {
  header: {
    height: 30,
    fontSize: 12,
    backgroundColor: "#f0f0f0",
    textColor: "#000000",
  },
  rows: {
    minHeight: 25,
    fontSize: 10,
    textColor: "#333333",
    evenBackgroundColor: "#ffffff",
    oddBackgroundColor: "#f9f9f9",
  },
};

async function generatePdf({ template, data, schema }) {
  const { pageSettings, pages } = template;
  const pageTemplate = pages[0];

  const doc = new PDFDocument({
    size:
      pageSettings.size === "custom"
        ? [pageSettings.width, pageSettings.height]
        : pageSettings.size,
    orientation: pageSettings.orientation,
    margins: { top: 0, bottom: 0, left: 0, right: 0 },
  });

  const buffers = [];
  doc.on("data", buffers.push.bind(buffers));
  const pdfPromise = new Promise((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(buffers)));
  });

  const tableElementRaw = pageTemplate.elements.find(
    (el) => el.type === "Table"
  );
  const staticElements = pageTemplate.elements.filter(
    (el) => el.type !== "Table"
  );

  // --- Create a safe, complete table element by merging with defaults ---
  let tableElement = null;
  if (tableElementRaw) {
    tableElement = {
      ...DEFAULT_TABLE_PROPS,
      ...tableElementRaw,
      header: { ...DEFAULT_TABLE_PROPS.header, ...tableElementRaw.header },
      rows: { ...DEFAULT_TABLE_PROPS.rows, ...tableElementRaw.rows },
    };
  }

  const tableData =
    tableElement && tableElement.dataBinding
      ? get(data, tableElement.dataBinding.field) || []
      : [];

  const pageChunks = [];
  if (tableElement) {
    const { header, rows, y: tableY, height: tableHeight } = tableElement;
    let availableHeight = tableHeight - header.height;
    let currentChunk = [];

    tableData.forEach((item) => {
      let maxHeight = rows.minHeight;
      tableElement.columns.forEach((col) => {
        const cellHeight =
          getWrappedTextHeight(item[col.dataKey], col.width, rows.fontSize) +
          10;
        maxHeight = Math.max(maxHeight, cellHeight);
      });

      if (availableHeight < maxHeight && currentChunk.length > 0) {
        pageChunks.push(currentChunk);
        currentChunk = [];
        availableHeight = tableHeight - header.height;
      }

      currentChunk.push({ data: item, height: maxHeight });
      availableHeight -= maxHeight;
    });
    if (currentChunk.length > 0) pageChunks.push(currentChunk);
  }

  const totalPages = pageChunks.length || 1;
  for (let i = 0; i < totalPages; i++) {
    if (i > 0) doc.addPage();

    for (const element of staticElements) {
      if (!checkCondition(element, data)) continue;
      let props = { ...element };
      if (props.dataBinding) {
        const boundValue = get(data, props.dataBinding.field);
        if (boundValue !== undefined)
          props[props.dataBinding.property] = boundValue;
      }
      const x = props.x + (pageSettings.marginLeft || 0);
      const y = props.y + (pageSettings.marginTop || 0);

      switch (props.type) {
        case "Text":
          doc
            .fontSize(props.fontSize || 12)
            .fillColor(normalizeColor(props.fill))
            .text(props.text, x, y, {
              width: props.width,
              height: props.height,
              align: props.align || "left",
            });
          break;
        case "Image":
          const imageBuffer = await getImageBuffer(props.src);
          if (imageBuffer)
            doc.image(imageBuffer, x, y, {
              width: props.width,
              height: props.height,
            });
          break;
        case "Shape":
          if (props.shape === "line")
            doc
              .moveTo(x, y)
              .lineTo(x + props.width, y)
              .lineWidth(props.strokeWidth || 1)
              .stroke(normalizeColor(props.stroke));
          else
            doc
              .rect(x, y, props.width, props.height)
              .fillAndStroke(
                normalizeColor(props.fill),
                normalizeColor(props.stroke)
              );
          break;
        case "Barcode":
          const barcodeBuffer = generateBarcodeBuffer(props);
          if (barcodeBuffer)
            doc.image(barcodeBuffer, x, y, {
              width: props.width,
              height: props.height,
            });
          break;
      }
    }

    if (tableElement) {
      const chunk = pageChunks[i] || [];
      let cursorY = tableElement.y + (pageSettings.marginTop || 0);
      const tableX = tableElement.x + (pageSettings.marginLeft || 0);
      const { width: tableWidth, columns, header, rows } = tableElement;

      doc
        .rect(tableX, cursorY, tableWidth, header.height)
        .fill(normalizeColor(header.backgroundColor));
      columns.forEach((col, colIndex) => {
        const colX =
          tableX +
          columns.slice(0, colIndex).reduce((acc, c) => acc + c.width, 0);
        doc
          .fontSize(header.fontSize)
          .fillColor(normalizeColor(header.textColor))
          .text(col.header, colX + 5, cursorY + 5, {
            width: col.width - 10,
            height: header.height - 10,
          });
      });
      cursorY += header.height;

      chunk.forEach((row, rowIndex) => {
        const rowBgColor =
          rowIndex % 2 === 0
            ? rows.evenBackgroundColor
            : rows.oddBackgroundColor;
        doc
          .rect(tableX, cursorY, tableWidth, row.height)
          .fill(normalizeColor(rowBgColor));
        columns.forEach((col, colIndex) => {
          const colX =
            tableX +
            columns.slice(0, colIndex).reduce((acc, c) => acc + c.width, 0);
          doc
            .fontSize(rows.fontSize)
            .fillColor(normalizeColor(rows.textColor))
            .text(String(row.data[col.dataKey] || ""), colX + 5, cursorY + 5, {
              width: col.width - 10,
              height: row.height - 10,
            });
        });
        cursorY += row.height;
      });
    }
  }

  doc.end();
  return pdfPromise;
}

module.exports = { generatePdf };
