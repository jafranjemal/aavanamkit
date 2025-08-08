import React from "react";
import PropertyInput from "./PropertyInput";

const ShapeProperties = ({ element, updateProperty }) => {
  return (
    <>
      <PropertyInput
        label="Fill Color"
        type="color"
        value={element.fill}
        onChange={(e) => updateProperty("fill", e.target.value)}
      />
      <PropertyInput
        label="Stroke Color"
        type="color"
        value={element.stroke}
        onChange={(e) => updateProperty("stroke", e.target.value)}
      />
      <PropertyInput
        label="Stroke Width"
        type="number"
        min="0"
        value={element.strokeWidth}
        onChange={(e) =>
          updateProperty("strokeWidth", parseInt(e.target.value, 10))
        }
      />
    </>
  );
};

export default ShapeProperties;
