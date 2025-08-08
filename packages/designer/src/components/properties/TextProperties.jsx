import React from "react";
import PropertyInput from "./PropertyInput";
import PropertySelect from "./PropertySelect"; // <-- Import

const TextProperties = ({ element, updateProperty }) => {
  return (
    <>
      <PropertyInput
        label="Text"
        value={element.text}
        onChange={(e) => updateProperty("text", e.target.value)}
      />
      <PropertyInput
        label="Font Size"
        type="number"
        value={element.fontSize}
        onChange={(e) =>
          updateProperty("fontSize", parseInt(e.target.value, 10))
        }
      />
      <PropertySelect
        label="Font Style"
        value={element.fontStyle || "normal"}
        onChange={(e) => updateProperty("fontStyle", e.target.value)}
        options={[
          { value: "normal", label: "Normal" },
          { value: "bold", label: "Bold" },
          { value: "italic", label: "Italic" },
          { value: "bold italic", label: "Bold Italic" },
        ]}
      />
      <PropertySelect
        label="Alignment"
        value={element.align || "left"}
        onChange={(e) => updateProperty("align", e.target.value)}
        options={[
          { value: "left", label: "Left" },
          { value: "center", label: "Center" },
          { value: "right", label: "Right" },
        ]}
      />

      <PropertyInput
        label="Fill Color"
        type="color"
        value={element.fill}
        onChange={(e) => updateProperty("fill", e.target.value)}
      />
    </>
  );
};

export default TextProperties;
