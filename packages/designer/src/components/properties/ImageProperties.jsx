import React from "react";
import PropertyInput from "./PropertyInput";

const ImageProperties = ({ element, updateProperty }) => {
  return (
    <PropertyInput
      label="Image URL"
      value={element.src}
      onChange={(e) => updateProperty("src", e.target.value)}
    />
  );
};

export default ImageProperties;
