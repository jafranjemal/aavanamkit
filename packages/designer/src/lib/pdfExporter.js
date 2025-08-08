import jsPDF from "jspdf";
import Konva from "konva";
import useImage from "use-image"; // We need this for async image loading

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

// Helper to get a nested property from an object using a string path
const get = (obj, path) =>
  path
    .replace(/\[\]$/, "")
    .split(".")
    .reduce((acc, part) => acc && acc[part], obj);

// Helper to preload all images for a page
const preloadImages = (elements) => {
  const imagePromises = elements
    .filter((el) => el.type === "Image" && el.src)
    .map((el) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = el.src;
        img.onload = () => resolve({ ...el, image: img });
        img.onerror = () => resolve({ ...el, image: null }); // Handle broken images
      });
    });
  return Promise.all(imagePromises);
};

const checkCondition = (element, data) => {
  if (!element.conditional || !element.conditional.field) {
    return true; // No condition, always show
  }
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

export const exportToPdf = async (templatePages, data, pageSettings) => {
  const pdf = new jsPDF({
    orientation: pageSettings.orientation || "portrait",
    unit: "pt",
    format: pageSettings.size,
  });
  const pageTemplate = templatePages[0]; // Assume single template page for now
  const { width: pageWidth, height: pageHeight } = pageTemplate;

  // Find the table element and its data
  const tableElement = pageTemplate.elements.find((el) => el.type === "Table");
  const tableData =
    tableElement && tableElement.dataBinding
      ? get(data, tableElement.dataBinding.field)
      : [];

  // --- Main Pagination Logic ---
  let currentPage = 1;
  let cursorY = 0; // Tracks the current vertical position on the page
  let currentDataIndex = 0;

  // Function to add a new page to the PDF
  const addNewPage = () => {
    if (currentPage > 1) pdf.addPage();
    cursorY = 0; // Reset cursor for the new page
  };

  // Function to render non-table elements onto the current page
  const renderStaticElements = async (layer) => {
    const staticElements = pageTemplate.elements.filter(
      (el) => el.type !== "Table"
    );
    const preloadedImageElements = await preloadImages(
      staticElements.filter((el) => el.type === "Image")
    );

    staticElements.forEach((element) => {
      let props = { ...element };
      if (element.dataBinding && data) {
        if (!checkCondition(element, data)) return;
        const boundValue = get(data, element.dataBinding.field);
        if (boundValue !== undefined)
          props[element.dataBinding.property] = boundValue;
      }

      let node;
      if (element.type === "Image") {
        const preloaded = preloadedImageElements.find(
          (p) => p.id === element.id
        );
        if (preloaded?.image)
          node = new Konva.Image({ ...props, image: preloaded.image });
      } else if (element.type === "Text") {
        node = new Konva.Text(props);
      } else if (element.type === "Shape") {
        node = new Konva.Rect(props);
      }
      if (node) layer.add(node);
    });
  };

  // Function to render the table header
  const renderTableHeader = (layer) => {
    if (!tableElement) return;
    const { x, width, columns } = tableElement;
    const headerHeight = 25;
    const colWidth = width / columns.length;

    layer.add(
      new Konva.Rect({
        x,
        y: cursorY,
        width,
        height: headerHeight,
        fill: "#f0f0f0",
      })
    );
    columns.forEach((col, i) => {
      layer.add(
        new Konva.Text({
          x: x + i * colWidth + 5,
          y: cursorY + 5,
          text: col.header,
          fontStyle: "bold",
        })
      );
    });
    cursorY += headerHeight;
  };

  // --- The Rendering Loop ---
  addNewPage(); // Start with the first page

  // Create a temporary stage and layer
  let stage = new Konva.Stage({
    container: document.createElement("div"),
    width: pageWidth,
    height: pageHeight,
  });
  let layer = new Konva.Layer();
  stage.add(layer);

  // Render static elements on the first page
  await renderStaticElements(layer);

  if (tableElement) {
    cursorY = tableElement.y; // Start table where it's placed
    renderTableHeader(layer);

    const rowHeight = 20;
    const tableBottomMargin = 50; // Margin from bottom of page

    for (let i = 0; i < tableData.length; i++) {
      const item = tableData[i];

      // Check if we need a new page BEFORE rendering the row
      if (cursorY + rowHeight > pageHeight - tableBottomMargin) {
        layer.draw();
        pdf.addImage(
          stage.toDataURL({ pixelRatio: 2 }),
          "PNG",
          0,
          0,
          pageWidth,
          pageHeight
        );

        addNewPage();
        stage.destroy(); // Clean up old stage

        // Create new stage for the new page
        const newStage = new Konva.Stage({
          container: document.createElement("div"),
          width: pageWidth,
          height: pageHeight,
        });
        layer = new Konva.Layer();
        newStage.add(layer);
        stage = newStage;

        // Render header on the new page
        renderTableHeader(layer);
      }

      // Render the row
      const { x, width, columns } = tableElement;
      const colWidth = width / columns.length;
      columns.forEach((col, j) => {
        layer.add(
          new Konva.Text({
            x: x + j * colWidth + 5,
            y: cursorY + 5,
            text: item[col.dataKey] || "",
          })
        );
      });
      cursorY += rowHeight;
      layer.add(
        new Konva.Rect({ x, y: cursorY, width, height: 1, fill: "#ccc" })
      );
    }
  }

  // Add the final page to the PDF
  layer.draw();
  pdf.addImage(
    stage.toDataURL({ pixelRatio: 2 }),
    "PNG",
    0,
    0,
    pageWidth,
    pageHeight
  );
  stage.destroy();

  pdf.save("AavanamKit-Invoice.pdf");
};
