@aavanamkit/engine
A professional, headless Node.js engine for generating data-driven documents from AavanamKit templates.

About The Project
@aavanamkit/engine is the server-side counterpart to the @aavanamkit/designer. It is a pure Node.js library with zero browser dependencies, designed for automated, high-performance document generation.

This engine takes the template.json created by the visual designer, merges it with your live application data, and produces pixel-perfect documents in multiple formats. It's the "construction crew" that reads the architect's blueprint and builds the final product.

Core Features
Headless Generation: Built for the backend. Perfect for automated workflows, API responses, or scheduled jobs.

Multi-Format Export: Generate PDF, DOCX, and HTML files from the same template.

Advanced Table Pagination: Replicates the designer's layout-aware, fixed-position table pagination for professional, multi-page documents.

Full Style Parity: Accurately renders all advanced styling for fonts, colors, and tables defined in the designer.

Robust & Forgiving: Intelligently uses default values for any missing template properties, preventing crashes from incomplete templates.

Installation
Install the engine in your Node.js project using npm:

npm install @aavanamkit/engine

Usage
The engine exposes a single generate function. You provide the template, data, and desired output type, and it returns the final document as a buffer.

import { generate } from '@aavanamkit/engine';
import fs from 'fs';

// 1. Load your saved template object from your database or a file
import template from './templates/invoice.json';

// 2. Fetch the live data for the document you want to create
const liveData = {
  customer: { name: "John Doe", address: "123 Main St, Anytown" },
  invoiceNumber: "INV-2025-001",
  totalAmount: 450.00,
  items: [
    { description: "Screen Repair", qty: 1, total: 250.00 },
    { description: "Battery Replacement", qty: 1, total: 200.00 },
  ]
};

// 3. Call the generate function
async function createInvoice() {
  try {
    const pdfBuffer = await generate({
      template: template,
      data: liveData,
      outputType: 'pdf' 
    });

    // 4. Do something with the output buffer
    fs.writeFileSync('invoice-001.pdf', pdfBuffer);
    console.log('Successfully generated invoice-001.pdf!');

  } catch (error) {
    console.error('Error generating document:', error);
  }
}

createInvoice();

API Reference
generate({ template, data, outputType })
This is an asynchronous function that returns a Promise.

Parameters:

template (object) - Required. The complete template object saved from the @aavanamkit/designer. It must include pageSettings and pages properties.

data (object) - Required. The live data object to populate the template. Its structure should match the dataSchema defined within the template.

outputType (string) - Required. The desired output format. Must be one of the following strings:

'pdf'

'docx'

'html'

Returns:

A Promise that resolves to:

A Buffer for pdf and docx output types.

A string for the html output type.

Contributing
The AavanamKit Project is a community-driven, open-source initiative and we welcome contributions of all kinds. Whether it's reporting a bug, proposing a new feature, or submitting a pull request, your help is greatly appreciated.

Please read our CONTRIBUTING.md guide for details on our code of conduct and the process for submitting changes.

License
This project is licensed under the MIT License. See the LICENSE file for details.

The AavanamKit Project - Founded by JJSOFT GLOBAL