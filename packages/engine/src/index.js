const { generatePdf } = require("./pdf-generator");
const { generateDocx } = require("./docx-generator");
const { generateHtml } = require("./html-generator");
/**
 * The main function for the AavanamKit engine.
 * It orchestrates the document generation based on the specified output type.
 *
 * @param {object} options - The generation options.
 * @param {object} options.template - The template JSON from the designer.
 * @param {object} options.data - The live data to populate the template.
 * @param {object} options.schema - The schema defining the structure of the data.
 * @param {string} options.outputType - The desired output format ('pdf', 'docx', 'html').
 * @returns {Promise<Buffer|string>} A Buffer for binary files (PDF, DOCX) or a string for HTML.
 */
async function generate({ template, data, schema, outputType = "pdf" }) {
  console.log(`Starting document generation for outputType: ${outputType}`);

  if (!template || !data) {
    throw new Error("Template and data objects are required.");
  }

  switch (outputType) {
    case "pdf":
      return await generatePdf({ template, data, schema });

    case "docx":
      return await generateDocx({ template, data, schema });

    case "html":
      return await generateHtml({ template, data, schema });
    default:
      throw new Error(
        `Unsupported outputType: ${outputType}. Supported types are: pdf, docx, html.`
      );
  }
}

module.exports = { generate };
