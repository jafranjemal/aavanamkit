import React, { useState } from "react";
import AavanamKit from "@aavanamkit/designer";

// Since the designer is not yet published, we need to tell our bundler
// where to find its CSS. This path works because of the monorepo structure.
import '@aavanamkit/designer/dist/AavanamKit.css';

// A sample schema for our demo
const sampleSchema = {
  shop: { name: "string", address: "string" },
  customer: { name: "string", address: "string" },
  invoiceNumber: "string",
  invoiceDate: "string",
  totalAmount: "number",
  items: [{ description: "string", qty: "number", price: "number" }],
};

// Sample data that matches the schema
const sampleData = {
  shop: { name: "AavanamKit Repair Shop", address: "123 Demo Lane" },
  customer: { name: "Valued Customer", address: "456 Main Street" },
  invoiceNumber: "DEMO-001",
  invoiceDate: new Date().toLocaleDateString(),
  totalAmount: 350.0,
  items: [
    { description: "Smartphone Screen Repair", qty: 1, price: 250.0 },
    { description: "Protective Case", qty: 1, price: 100.0 },
  ],
};

function App() {
  const [template, setTemplate] = useState(null);

  const handleSave = (newTemplate) => {
    console.log("Template Saved!", newTemplate);
    alert("Template saved! Check the browser console to see the JSON output.");
    setTemplate(newTemplate);
  };

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <AavanamKit
        schema={sampleSchema}
        data={sampleData}
        template={template}
        onSave={handleSave}
      />
    </div>
  );
}

export default App;
