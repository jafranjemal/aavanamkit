const axios = require("axios");
const colornames = require("colornames");
const { createCanvas } = require("canvas");
const JsBarcode = require("jsbarcode");

// Gets a nested property from an object using a string path
const get = (obj, path) =>
  path
    .replace(/\[\]$/, "")
    .split(".")
    .reduce((acc, part) => acc && acc[part], obj);

const normalizeColor = (colorStr) => {
  if (!colorStr || typeof colorStr !== "string") return "#000000";

  // First, try named colors
  const namedHex = colornames(colorStr.toLowerCase());
  if (namedHex) {
    return namedHex.toLowerCase();
  }

  // Next, try hex codes (with or without hash)
  const hexMatch = colorStr.match(/^#?([0-9a-fA-F]{6})$/);
  if (hexMatch) {
    // Return the captured group (the 6 hex digits), ensuring it's lowercase and has a hash
    return `#${hexMatch[1].toLowerCase()}`;
  }

  // If all else fails, return the default black
  return "#000000";
};

// Fetches an image from a URL and returns it as a buffer
const getImageBuffer = async (url) => {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch image from ${url}:`, error.message);
    return null;
  }
};

// Generates a barcode image buffer using node-canvas
const generateBarcodeBuffer = (element) => {
  const canvas = createCanvas(element.width, element.height);
  try {
    JsBarcode(canvas, element.text, { displayValue: false, margin: 0 });
    return canvas.toBuffer("image/png");
  } catch (e) {
    console.error("Barcode generation failed:", e.message);
    return null;
  }
};

// Checks if an element should be rendered based on its conditional properties
const checkCondition = (element, data) => {
  if (!element.conditional || !element.conditional.field) return true;
  const { field, operator, value } = element.conditional;
  const dataValue = get(data, field);
  switch (operator) {
    case "exists":
      return !!dataValue;
    case "notExists":
      return !dataValue;
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

module.exports = {
  get,
  normalizeColor,
  getImageBuffer,
  generateBarcodeBuffer,
  checkCondition,
};
