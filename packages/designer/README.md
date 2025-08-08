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
