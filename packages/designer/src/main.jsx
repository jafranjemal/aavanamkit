import React from "react";
import ReactDOM from "react-dom/client";
import AavanamKit from "./AavanamKit.jsx";
import "./index.css";

// Sample data that matches a potential schema
const sampleInvoiceDataa = {
  customer: {
    name: "Globex Corporation",
    address: "123 Main St, Springfield",
  },
  invoiceNumber: "INV-007",
  totalAmount: 950.0,
  discount: 0.0,
  items: [
    // This array will be used by the table
    { description: "Flux Capacitor", unitPrice: 200.0, qty: 1, total: 200 },
    { description: "Adamantium Shield", unitPrice: 500.0, qty: 1, total: 200 },
    { description: "Kryptonite (1g)", unitPrice: 250.0, qty: 1, total: 200 },
    // Add many more items here to test pagination
    ...Array.from({ length: 50 }, (_, i) => ({
      description: `Service Fee #${i + 1}`,
      unitPrice: 15.5,
      qty: 1,
      total: 1 * 15.5,
    })),
  ],
};

const sampleInvoiceData = {
  company: {
    name: "Phone Repairing Solutions (PRS)",
    addressLine1: "NO. 150/1/3, First Cross Street",
    addressLine2: "Colombo 11, Sri Lanka",
    telephone1: "011 7747 511",
    telephone2: "0770 117 511",
  },
  invoice: {
    number: "SI29551",
    date: "08/02/25",
    mode: "CASH",
    salesman: "GENERAL",
  },
  customer: {
    label: "Customer",
    value: "CASH",
  },
  items: [
    {
      no: 1,
      code: "7492",
      description: "BackGlass iPhone 14 Pro Max Deep Purple",
      qty: 1,
      rate: 2800.0,
      discount: 0.0,
      value: 2800.0,
    },
    {
      no: 2,
      code: "7436",
      description: "BackGlass iPhone 12 Blue",
      qty: 1,
      rate: 1250.0,
      discount: 0.0,
      value: 1250.0,
    },
    ...Array.from({ length: 50 }, (_, i) => ({
      no: i + 1,
      code: "7436",
      description: "BackGlass iPhone 12 Blue",
      qty: 1,
      rate: 1250.0,
      discount: 0.0,
      value: 1250.0,
    })),
  ],
  summary: {
    totalItems: 2,
    totalQty: 2.0,
    netTotal: 4050.0,
  },
  footerNotes: [
    "It is your responsibility to thoroughly inspect and evaluate the quality, technical and physical functionality of the items by the time you have purchased at our store.",
    "We are not liable for any after sales claims due to malfunctions against the item we sold.",
    "Refund, Return and Exchange will not be entertained.",
  ],
  signatures: {
    preparedBy: "____________________",
    customer: "____________________",
    issuedBy: "____________________",
  },
  printed: {
    on: "08/02/25",
    at: "15:07:08",
  },
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AavanamKit data={sampleInvoiceData} />
  </React.StrictMode>
);
