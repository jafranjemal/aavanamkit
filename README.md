
Are you looking for a powerful, open-source solution to generate PDF and DOCX documents in your web application? AavanamKit is a modern document generation toolkit designed to fix the broken workflow of hardcoded layouts. It provides a full-stack ecosystem, featuring a visual, drag-and-drop React component for template design and a headless Node.js engine for high-quality, server-side document creation. Stop fighting with print CSS and clunky libraries—AavanamKit is the definitive invoice generator and report builder that saves you time and empowers your users.

<div align="center">
  <br />
  <p>
    <img src="https://res.cloudinary.com/dpkxck2uh/image/upload/v1755062483/AavanamKitLogo_ex7mfl.png" alt="AavanamKit Logo" width="150" />
  </p>
  <h1 align="center">AavanamKit</h1>
  <p align="center">
    The open-source document design system that dramatically speeds up your development workflow.
    <br />
    <a href="https://aavanamkit-demo.vercel.app/"><strong>Explore the Live Demo »</strong></a>
    ·
    <a href="https://aavanamkit-docs.vercel.app/"><strong>Read the Docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/jafranjemal/aavanamkit/issues">Report Bug</a>
    ·
    <a href="https://github.com/jafranjemal/aavanamkit/issues">Request Feature</a>
  </p>
</div>


[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT) 
[![AavanamKit Engine CI](https://github.com/jafranjemal/aavanamkit/actions/workflows/engine-ci.yml/badge.svg)](https://github.com/jafranjemal/aavanamkit/actions/workflows/engine-ci.yml)
[![GitHub stars](https://img.shields.io/github/stars/jafranjemal/aavanamkit?style=social)](https://github.com/jafranjemal/aavanamkit)
[![npm version](https://img.shields.io/npm/v/@aavanamkit/designer)](https://www.npmjs.com/package/@aavanamkit/designer)
[![npm downloads](https://img.shields.io/npm/dm/@aavanamkit/designer)](https://www.npmjs.com/package/@aavanamkit/designer)

---

 <p>
    <img src="https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fres.cloudinary.com%2Fdpkxck2uh%2Fimage%2Fupload%2Fv1754988806%2Fmsedge_gnOKzkDB1T_cfqagj.gif" alt="AavanamKit Logo" width="100%" />
  </p>

## Stop Coding Layouts Blindly.

You know the process. You need to generate a PDF invoice. You open your editor and start writing code like `` `doc.text('Total:', 400, 750)` ``. You save, re-run your script, and check the output. The text is a few pixels off. You go back, guess a new coordinate, and repeat the cycle. It's slow, frustrating, and completely disconnected from the visual nature of the task.

The alternative is often worse: fighting with print CSS to convert HTML to a PDF, only to end up with a low-quality, blurry document that looks terrible on a professional invoice or a thermal printer receipt.

**AavanamKit is designed to fix this broken workflow.**

### A Visual Development Tool for Documents

AavanamKit is a complete ecosystem that treats document layouts not as a coding chore, but as a visual design process.

Our core philosophy is simple: **Design your document visually first, then use the exported JSON as your production-ready template.**

Instead of guessing at coordinates, you use our powerful visual designer to draw your layout. You see exactly how it will look in real-time. When you're done, you export a clean JSON object that represents your entire design. This JSON **is your layout code**, ready to be used by our headless backend engine.

---
### 🚀 Live Demo & Documentation

Seeing is believing. We've built a full live demo and a comprehensive documentation site.

- **[ &raquo; Try the Live Demo Now! ](https://aavanamkit-demo.vercel.app/)**
- **[ &raquo; Read the Official Docs ](https://aavanamkit-docs.vercel.app/)**

---

### ✨ The AavanamKit Ecosystem

AavanamKit is a monorepo containing two distinct but perfectly synchronized packages:

### 🎨 `@aavanamkit/designer` (Your Visual Dev Tool)
A powerful, embeddable **React component** that provides a full WYSIWYG "design studio." Use it in your local development environment to visually build and export your document templates.

- **Complete Visual Canvas:** A full WYSIWYG experience. Drag, drop, resize, rotate, and style every element with an intuitive properties panel.
- **Powerful Data Binding:** Visually map any element's property (like text content or color) to your application's data schema. The designer intelligently flattens complex, nested JSON for easy use.
- **Advanced Components Built-In:** Go beyond simple text and images with a powerful, **auto-paginating Table** that handles page breaks automatically, plus support for Barcodes and various Shapes.
- **Total Page Control:** Full control over your document's layout. Choose standard sizes like A4/Letter, define custom dimensions, switch between portrait/landscape, or use the **Continuous Roll** mode for dynamic-height thermal printer receipts.
- **Professional Workflow Tools:** Speed up your design process with keyboard shortcuts, canvas zoom & pan, and a built-in gallery of production-ready templates to start from.
- **Conditional Rendering:** Easily set rules to show or hide elements based on your live data (e.g., only show a "Discount Applied" label if `discount > 0`).
- **Pre-Printed Stationery Support:** Upload an image of your pre-printed paper as a background to perfectly align your digital design with your physical media.
- **Instant JSON Export:** Get a clean, production-ready template JSON with one click.

**[ &raquo; Learn more about the Designer ](./packages/designer/README.md)**

### ⚙️ `@aavanamkit/engine` (Your Backend Powerhouse)
A pure, **headless Node.js library** with zero browser dependencies. It takes the templates you create with the designer, merges them with your live data, and generates high-quality, native vector PDFs and DOCX files.

- High-Fidelity Output: Solves the quality problem of HTML-to-PDF converters.
- Automated: Perfect for API responses, scheduled jobs, or sending email attachments.
- Robust: Intelligently handles missing template properties to prevent crashes.

**[ &raquo; Learn more about the Engine ](./packages/engine/README.md)**

---
### 📦 Quick Start: The Developer Workflow

### Step 1: Design Your Template Visually

Run the `` `@aavanamkit/designer` `` locally (or use our live demo). Design your invoice, bind it to your data schema, and click "Save Template" to get your `template.json`.

```json
// Your exported template.json
{
  "pageSettings": { "size": "a4", ... },
  "pages": [{
    "elements": [
      { "type": "Text", "text": "INVOICE", "x": 450, "y": 50, ... },
      { "type": "Table", "dataBinding": { "field": "items[]" }, ... }
    ]
  }]
}
```

### Step 2: Generate Documents on Your Server

In your backend application, use the `` `@aavanamkit/engine` ``. Load the `template.json` you just created and feed it your live data.

```javascript
// Your backend API route (e.g., in an Express.js app)
import { generate } from '@aavanamkit/engine';
import template from './my-saved-template.json';

app.get('/api/invoices/:id/download', async (req, res) => {
  const liveData = await db.invoices.findOne({ id: req.params.id });

  const pdfBuffer = await generate({
    template: template,
    data: liveData,
    outputType: 'pdf'
  });

  res.setHeader('Content-Type', 'application/pdf');
  res.send(pdfBuffer);
});

```
# The Bonus: Safe Client Empowerment

And if you want to go the extra mile, you can then embed the same `` `@aavanamkit/designer` `` component into your application's admin panel. This allows your clients to safely handle their own **visual** changes without ever needing to touch the underlying data structure.

**What clients *can* do:**
- Change element positions (move the logo, rearrange footer text).
- Adjust styling (font sizes, colors, bold/italics).
- Upload their own images, including using a scan of their **pre-printed stationery as a background** to perfectly align their design.

**What clients *cannot* do:**
- They **cannot** change the data schema or the data bindings. The core data structure is controlled by you, the developer, ensuring data integrity is always maintained.

### ❤️ Contributing & Support

The AavanamKit Project is a community-driven, open-source initiative. Your help makes it better.

- [ &raquo; Read our Contribution Guide ](./CONTRIBUTING.md)
- [ &raquo; Sponsor the Project on GitHub ](https://github.com/sponsors/jafranjemal)

### License

This project is licensed under the **MIT License**. See the **[LICENSE](./LICENSE)** file for details.

---
*The AavanamKit Project - Founded by JJSOFT GLOBAL*