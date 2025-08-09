<div align="center">
<br />
<p>

 
    <img src="./logo.svg" alt="AavanamKit Logo" width="150" />
 
</p>
<h1 align="center">AavanamKit</h1>
<p align="center">
The open-source document generation ecosystem that gives the design power back to your users.
<br />
<a href="https://www.google.com/search?q=%5BYOUR_LIVE_DEMO_URL_HERE%5D"><strong>Explore the Live Demo »</strong></a>
<br />
<br />
<a href="https://www.google.com/search?q=https://github.com/jafranjemal/aavanamkit/issues">Report Bug</a>

<a href="https://www.google.com/search?q=https://github.com/jafranjemal/aavanamkit/issues">Request Feature</a>
</p>
</div>

## The Endless Cycle We All Hate

Let's be honest. You've been there. You build a beautiful, dynamic application, and then comes the inevitable request: "We need to generate invoices as PDFs."

So you do it. You pull in a clunky library, spend days fighting with its rigid API, and write endless lines of imperative code like `doc.moveTo(x, y)`. Or maybe you go the HTML-to-PDF route, spending hours tweaking a separate print stylesheet, wrestling with `!important` overrides and unpredictable page breaks. Finally, after all that, it's done. A week later, the email arrives:

> "Hey, this is great! Quick change: can we move the logo to the right, make the 'Total' bold, add our new company slogan to the footer, and maybe add a column for 'Discount' to the table? Should be simple, right?"

Suddenly, you're not a software engineer anymore. You're a report designer, trapped in a frustrating and unprofitable loop. Every minor layout change is a new development ticket, a new branch, a new deployment. The marketing team wants a promotional banner, accounting needs a new disclaimer, and you're the bottleneck for all of it.

This is a massive industry gap. We build applications with dynamic, component-based frontends that users can control, but the moment we need to generate a document, we revert to rigid, hardcoded templates. This creates a frustrating disconnect between the flexibility of the app and the static nature of its output.

## AavanamKit is the Solution

**AavanamKit** is a complete ecosystem built to solve this problem once and for all. We believe developers should build systems, not documents. Our philosophy is to treat document layouts just like any other piece of user-managed content in your application.

Our solution is simple but powerful: **We give the design power to your users.**

Instead of you building a static invoice, you embed our powerful visual designer into your application's admin panel. Your users—the shop manager, the accountant, the admin—can create, edit, and manage their own document templates with a familiar, intuitive drag-and-drop interface. They change the logo for a seasonal sale. They add the new slogan themselves. They update the terms and conditions without ever creating a support ticket.

You build the tool once, and you are free. You empower your users, eliminate a whole category of tedious change requests, and get back to building the features that matter.

## 🚀 Live Demo & Sample Templates

Seeing is believing. We've built a full live demo where you can experience the power of the AavanamKit designer right in your browser, no installation required.

**» Try the Live Demo Now!**
https://aavanamkit-demo.vercel.app/
<br />
The demo comes pre-loaded with a gallery of professional templates for a mobile repair shop, showcasing the versatility of the designer:

- **A full A4 Service Invoice**: A standard, comprehensive invoice perfect for detailed billing.
- **A compact A5 Invoice**: A modern, stylish design for smaller jobs or quotes.
- **A continuous-roll Thermal Receipt**: Demonstrates the "Roll Mode" for printers with dynamic paper length.
- **A small Job Repair Ticket**: A custom-sized ticket for internal tracking and customer claims.

You can access these templates by clicking the **"New from Template"** button in the demo. The complete source code for these templates can be found in `packages/designer/src/lib/templates.js`.

## ✨ The AavanamKit Ecosystem

**AavanamKit** is a monorepo containing two distinct but perfectly synchronized packages. Think of them as the **Architect** and the **Construction Crew**.

### 🎨 `@aavanamkit/designer` (The Architect)

This is the powerful, embeddable React component that provides a full WYSIWYG "design studio" for your users. It's the visual heart of the system where the blueprints (`template.json`) are created.

- **Visual Canvas**: Drag, drop, resize, and style every element with intuitive controls.
- **Data Binding**: Your users can visually link design elements directly to your application's data schema.
- **Advanced Components**: Includes a powerful, auto-paginating table that intelligently handles page breaks and header repetition.

**» Learn more about the Designer**

### ⚙️ `@aavanamkit/engine` (The Construction Crew)

This is a pure, headless Node.js library with zero browser dependencies. It takes the blueprints created by the designer, merges them with your live data, and builds the final, pixel-perfect documents on your server.

- **Multi-Format**: Generate PDF, DOCX, and HTML from the same template.
- **Automated**: Perfect for API responses, scheduled jobs, or sending email attachments.
- **Robust**: Intelligently handles missing template properties to prevent crashes from incomplete or older template versions.

**» Learn more about the Engine**

# @aavanamkit/designer

The visual, embeddable React component for designing data-driven document templates.

---

## ✨ About The Component

`@aavanamkit/designer` is a complete **design studio in a box**. It provides a powerful WYSIWYG canvas that you can embed directly into your React application, allowing your users to create and manage their own document layouts without writing any code.

---

## 🚀 Core Features

- **Full WYSIWYG Canvas**  
  A complete drag-and-drop interface for designing invoices, receipts, tickets, and more.

- **Component-Based Elements**  
  Includes Text, Image, Shape, Barcode, and an advanced, auto-paginating Table.

- **Powerful Data Binding**  
  Easily bind any element to your application's data structure via a `schema` prop.

- **Live Template Gallery**  
  Provide your users with professional, pre-built templates to get them started.

- **Flexible Page Control**  
  Supports standard page sizes (A4, Letter), custom dimensions, and a "Continuous Roll" mode for thermal printers.

---

## 📦 Installation

Install the designer in your React project using npm:

```bash
npm install @aavanamkit/designer
```

---

## 🔧 Usage

Import the `AavanamKit` component and its required, pre-built CSS file. You control the designer by passing it your application's data schema and wiring up the `onSave` callback to your backend.

```tsx
import React, { useState, useEffect } from 'react';
import AavanamKit from '@aavanamkit/designer';
import '@aavanamkit/designer/dist/AavanamKit.css';

function MyTemplateEditor() {
  const myAppSchema = {
    customer: { name: "string", address: "string" },
    invoiceNumber: "string",
    items: [{ description: "string", total: "number" }]
  };

  const [template, setTemplate] = useState(null);

  useEffect(() => {
    // fetchTemplateFromApi().then(savedTemplate => setTemplate(savedTemplate));
  }, []);

  const handleSave = async (newTemplate) => {
    console.log("Saving template to database:", newTemplate);
    // await saveTemplateToApi(newTemplate);
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <AavanamKit
        schema={myAppSchema}
        template={template}
        onSave={handleSave}
      />
    </div>
  );
}
```

---

## 📘 Component API

### `<AavanamKit />`

| Prop      | Type     | Required | Description                                                                 |
|-----------|----------|----------|-----------------------------------------------------------------------------|
| `schema`  | `object` | ✅ Yes   | An object representing the data structure of your application.              |
| `onSave`  | `function`| ✅ Yes  | A callback function that receives the complete template JSON on save.       |
| `template`| `object` | ❌ No    | A previously saved template object to load into the designer.               |
| `data`    | `object` | ❌ No    | Sample data used for live previews and in-browser exporting.                |

---

## 🪪 License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
