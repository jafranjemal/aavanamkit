const { get, normalizeColor, checkCondition } = require("./utils");
const { createCanvas } = require("canvas");
const JsBarcode = require("jsbarcode");

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

async function generateHtml({ template, data, schema }) {
  const { pageSettings, pages } = template;
  const pageTemplate = pages[0];
  const { width, height, marginTop, marginLeft, mode } = pageSettings;

  const getElementStyle = (el) => {
    let style = `position: absolute; box-sizing: border-box;`;
    style += `left: ${el.x + marginLeft}pt; top: ${el.y + marginTop}pt;`;
    style += `width: ${el.width}pt; height: ${el.height}pt;`;
    if (el.rotation) style += `transform: rotate(${el.rotation}deg);`;
    if (el.fill) style += `color: ${normalizeColor(el.fill)};`;
    if (el.fontSize) style += `font-size: ${el.fontSize}pt;`;
    if (el.fontStyle)
      style += `font-style: ${
        el.fontStyle.includes("italic") ? "italic" : "normal"
      }; font-weight: ${el.fontStyle.includes("bold") ? "bold" : "normal"};`;
    if (el.align) style += `text-align: ${el.align};`;
    return style;
  };

  const renderElement = (el) => {
    if (!checkCondition(el, data)) return "";
    let elementData = { ...el };
    if (el.dataBinding) {
      const boundValue = get(data, el.dataBinding.field);
      if (boundValue !== undefined)
        elementData[el.dataBinding.property] = boundValue;
    }
    const style = getElementStyle(elementData);
    switch (elementData.type) {
      case "Text":
        return `<div style="${style}">${elementData.text}</div>`;
      case "Image":
        return `<img src="${elementData.src}" style="${style} object-fit: cover;" />`; // Note: CORS proxy is a browser concept, not needed here
      case "Shape":
        const shapeStyle = `background-color: ${normalizeColor(
          elementData.fill
        )}; border: ${elementData.strokeWidth || 0}pt solid ${normalizeColor(
          elementData.stroke
        )};`;
        return `<div style="${style} ${shapeStyle}"></div>`;
      case "Barcode":
        const canvas = createCanvas(elementData.width, elementData.height);
        try {
          JsBarcode(canvas, elementData.text, {
            displayValue: false,
            margin: 0,
          });
        } catch (e) {}
        return `<img src="${canvas.toDataURL()}" style="${style}" />`;
      default:
        return "";
    }
  };

  const renderTable = (el) => {
    const safeEl = {
      ...DEFAULT_TABLE_PROPS,
      ...el,
      header: { ...DEFAULT_TABLE_PROPS.header, ...el.header },
      rows: { ...DEFAULT_TABLE_PROPS.rows, ...el.rows },
    };
    const tableData = safeEl.dataBinding
      ? get(data, safeEl.dataBinding.field) || []
      : [];
    if (!tableData.length) return "";
    const { header, rows, columns } = safeEl;
    let tableHtml = `<table style="width: 100%; border-collapse: collapse;">`;
    const headerStyle = `height: ${
      header.height
    }pt; background-color: ${normalizeColor(
      header.backgroundColor
    )}; color: ${normalizeColor(header.textColor)}; font-size: ${
      header.fontSize
    }pt; font-weight: bold;`;
    tableHtml += `<thead><tr>`;
    columns.forEach(
      (col) =>
        (tableHtml += `<th style="text-align: left; padding: 5pt; border-bottom: 1pt solid black; ${headerStyle}">${col.header}</th>`)
    );
    tableHtml += `</tr></thead><tbody>`;
    tableData.forEach((item, index) => {
      const rowBg =
        index % 2 === 0 ? rows.evenBackgroundColor : rows.oddBackgroundColor;
      const rowStyle = `min-height: ${
        rows.minHeight
      }pt; background-color: ${normalizeColor(rowBg)}; color: ${normalizeColor(
        rows.textColor
      )}; font-size: ${rows.fontSize}pt;`;
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
    return `<div style="${getElementStyle(safeEl)}">${tableHtml}</div>`;
  };

  let bodyContent = "",
    tableHtmlContent = "";
  pageTemplate.elements.forEach((el) => {
    if (el.type === "Table") tableHtmlContent = renderTable(el);
    else bodyContent += renderElement(el);
  });
  bodyContent += tableHtmlContent;

  const pageHeightStyle = mode === "roll" ? "auto" : `${height}pt`;
  const bodyStyle = `width: ${width}pt; min-height: ${pageHeightStyle}; margin: 0; background-color: ${normalizeColor(
    pageTemplate.backgroundColor
  )}; position: relative;`;

  return `<html><head><title>AavanamKit Preview</title><style>@page { size: auto; margin: 0; } body { font-family: sans-serif; }</style></head><body style="${bodyStyle}">${bodyContent}</body></html>`;
}

module.exports = { generateHtml };
