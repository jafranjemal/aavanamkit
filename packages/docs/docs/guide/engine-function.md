# @aavanamkit/engine

This document provides a detailed API reference for the main `generate` function exported by the backend engine.

## `generate()`

This is an asynchronous function that returns a `Promise`. It is the core of the backend engine.

```javascript
import { generate } from '@aavanamkit/engine';

async function createDocument() {
  const fileBuffer = await generate({ template, data, outputType: 'pdf' });
  // ...
}

Parameters
The generate function accepts a single object with the following properties:

Parameter

Type

Required

Description

template

object

Yes

The complete template object saved from the @aavanamkit/designer. It must include pageSettings and pages properties.

data

object

Yes

The live data object to populate the template. Its structure should match the dataSchema that was used to create the template.

outputType

string

Yes

The desired output format. Must be one of the following strings: 'pdf', 'docx', or 'html'.

Returns
The Promise resolves to:

A Buffer for pdf and docx output types. This raw binary data can be saved to a file, sent in an API response, or attached to an email.

A string for the html output type. This is a complete, self-contained HTML document string.


---
**Final Checkpoint:**
After creating these files, run your docs site again with `npm run docs:dev --workspace=docs`. Your website will now be complete, with proper branding, a full navigation structure, and detailed, easy-to-follow guides for any developer who wants to use AavanamKit.
