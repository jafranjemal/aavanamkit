
# @aavanamkit/designer API Reference

This document provides a comprehensive reference for the main `<AavanamKit />` React component props.

---

## `<AavanamKit />` Props

| Prop       | Type        | Required | Default    | Description                                                                                              |
|------------|-------------|----------|------------|----------------------------------------------------------------------------------------------------------|
| `schema`   | `object`    | Yes      | —          | Defines the shape of your application data. This is the source for all data binding options in the editor's properties panel. Example: a nested object describing fields and types your app uses. |
| `onSave`   | `function`  | Yes      | —          | Callback invoked when the user clicks the "Save Template" button. Receives the complete template JSON object as its only argument, which you should store for later use. |
| `template` | `object`    | No       | `null`     | An existing template JSON object. Passing this prop will load the template into the editor for viewing or modification. |
| `data`     | `object`    | No       | `null`     | Sample data object conforming to your `schema`. Enables live preview/export within the editor with realistic data. |
| `onError`  | `function`  | No       | `null`     | Callback fired when an error occurs inside the editor (e.g., invalid schema or template). Receives an error object. |
| `readOnly` | `boolean`   | No       | `false`    | When set to `true`, disables editing features, allowing users only to preview templates without making changes. |
| `style`    | `object`    | No       | `{}`       | Custom CSS styles applied to the root container of the designer component. Useful for layout and sizing adjustments. |
| `locale`   | `string`    | No       | `'en'`     | Sets the language/locale for the UI labels and messages inside the designer. Supports ISO language codes (e.g., `'en'`, `'fr'`). |

---

## Prop Details and Examples

### `schema` (required)

Defines your data model structure used by the designer.

```javascript
const exampleSchema = {
  customer: {
    name: "string",
    address: "string",
    email: "string"
  },
  invoiceNumber: "string",
  date: "string",
  items: [
    {
      description: "string",
      quantity: "number",
      price: "number",
      total: "number"
    }
  ],
  notes: "string"
};
```

This schema populates the properties panel, allowing template elements to bind dynamically to fields like `customer.name` or `items[0].price`.

---

### `onSave(templateJson)` (required)

Callback triggered when the user clicks "Save".

- **Argument:** `templateJson` — the full JSON object describing the designed template.
- **Usage:** Send this JSON to your backend to save or update the template.

```jsx
function handleSave(templateJson) {
  // Example: POST template JSON to your API
  fetch('/api/templates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(templateJson)
  });
}
```

---

### `template` (optional)

Load an existing template JSON for editing or preview.

```jsx
<AavanamKit
  schema={exampleSchema}
  template={existingTemplateJson}
  onSave={handleSave}
/>
```

---

### `data` (optional)

Sample data to preview and export the template with realistic values.

```javascript
const sampleData = {
  customer: { name: "Jane Doe", address: "123 Main St", email: "jane@example.com" },
  invoiceNumber: "INV-1001",
  date: "2025-08-10",
  items: [
    { description: "Widget A", quantity: 3, price: 10, total: 30 },
    { description: "Widget B", quantity: 1, price: 20, total: 20 }
  ],
  notes: "Thank you for your business!"
};
```

Passing this lets the designer show how the final document would look populated with real data.

---

### `onError(error)` (optional)

Receive error notifications from the designer (e.g., invalid schema or unexpected internal errors).

```jsx
function handleError(error) {
  console.error("Designer error:", error);
  alert("An error occurred: " + error.message);
}
```

---

### `readOnly` (optional)

Disables all editing UI; the user can only view the template.

```jsx
<AavanamKit
  schema={exampleSchema}
  template={existingTemplateJson}
  readOnly={true}
/>
```

---

### `style` (optional)

Customize the container's CSS styles.

```jsx
<AavanamKit
  schema={exampleSchema}
  onSave={handleSave}
  style={{ height: '600px', border: '1px solid #ccc' }}
/>
```

---

### `locale` (optional)

Sets the UI language.

```jsx
<AavanamKit
  schema={exampleSchema}
  onSave={handleSave}
  locale="fr" // French UI labels
/>
```

---

## Summary Example

```jsx
import React from 'react';
import AavanamKit from '@aavanamkit/designer';
import '@aavanamkit/designer/dist/style.css';

const schema = {
  customer: { name: "string", email: "string" },
  invoiceNumber: "string",
  items: [{ description: "string", price: "number" }]
};

const sampleData = {
  customer: { name: "Alice", email: "alice@example.com" },
  invoiceNumber: "12345",
  items: [
    { description: "Service A", price: 100 },
    { description: "Service B", price: 200 }
  ]
};

function MyTemplateEditor() {
  const handleSave = (templateJson) => {
    console.log("Saved template:", templateJson);
    // Save templateJson to backend
  };

  const handleError = (error) => {
    console.error("Designer error:", error);
  };

  return (
    <div style={{ height: '80vh' }}>
      <AavanamKit
        schema={schema}
        data={sampleData}
        onSave={handleSave}
        onError={handleError}
        style={{ border: '1px solid #ddd' }}
        locale="en"
      />
    </div>
  );
}

export default MyTemplateEditor;
```

---

If you want additional API docs or examples for other parts of AavanamKit, feel free to ask!
