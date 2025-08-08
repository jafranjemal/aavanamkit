import React from "react";
import PropertyInput from "./PropertyInput";

const BarcodeProperties = ({ element, updateProperty }) => {
  return (
    <PropertyInput
      label="Barcode Data"
      value={element.text}
      onChange={(e) => updateProperty("text", e.target.value)}
    />
  );
};

export default BarcodeProperties;
