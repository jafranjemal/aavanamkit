# @aavanamkit/engine — `generate` Function

This document describes the primary function for generating documents from templates and data in the `@aavanamkit/engine` package.

---

## `generate(options)`

Generates a document (commonly PDF) based on a provided template and data.

### Parameters

| Name       | Type     | Required | Description                                               |
|------------|----------|----------|-----------------------------------------------------------|
| `options`  | `object` | Yes      | Configuration object containing generation parameters.    |

### `options` Properties

| Property     | Type     | Required | Description                                                  |
|--------------|----------|----------|--------------------------------------------------------------|
| `template`   | `object` | Yes      | The template JSON object created by the designer tool.       |
| `data`       | `object` | Yes      | The data object to fill into the template during generation. |
| `outputType` | `string` | No       | Output format string. Defaults to `'pdf'`.                   |
| `options`    | `object` | No       | Additional options for customizing generation (e.g., page size, orientation). |

---

### Returns

A `Promise<Buffer>` resolving with the generated document content as a Buffer (e.g., PDF bytes).

---

### Example Usage

```js
import { generate } from '@aavanamkit/engine';
import fs from 'fs';

async function createInvoice(template, invoiceData) {
  try {
    const pdfBuffer = await generate({
      template,
      data: invoiceData,
      outputType: 'pdf'
    });

    fs.writeFileSync('invoice.pdf', pdfBuffer);
    console.log('Invoice PDF generated successfully.');
  } catch (err) {
    console.error('Error generating invoice:', err);
  }
}
