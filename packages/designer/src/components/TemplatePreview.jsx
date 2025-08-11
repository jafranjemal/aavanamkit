import React from "react";
import { Stage, Layer, Rect } from "react-konva";
import TextElement from "./elements/TextElement";
import ImageElement from "./elements/ImageElement";
import ShapeElement from "./elements/ShapeElement";
import TableElement from "./elements/TableElement";
import BarcodeElement from "./elements/BarcodeElement";

// A mapping from element type to its component, same as in the main Canvas
const elementComponentMap = {
  Text: TextElement,
  Image: ImageElement,
  Shape: ShapeElement,
  Table: TableElement,
  Barcode: BarcodeElement,
};

const TemplatePreview = ({ template, previewWidth }) => {
  if (!template) return null;

  const { pageSettings, pages } = template;
  const page = pages[0]; // We'll preview the first page

  // Calculate the scale factor to fit the preview in the designated width
  const scale = previewWidth / pageSettings.width;

  return (
    <div
      className="ak:bg-white ak:shadow-md ak:border"
      style={{ width: previewWidth, height: pageSettings.height * scale }}
    >
      <Stage
        width={previewWidth}
        height={pageSettings.height * scale}
        scaleX={scale}
        scaleY={scale}
      >
        <Layer>
          {/* Render Page Background */}
          <Rect
            x={0}
            y={0}
            width={page.width}
            height={page.height}
            fill={page.backgroundColor || "#ffffff"}
          />

          {/* Render all elements from the template */}
          {page.elements.map((element) => {
            const ElementComponent = elementComponentMap[element.type];
            if (!ElementComponent) return null;
            // Note: We don't use ElementWrapper because this is a read-only preview
            return <ElementComponent key={element.id} {...element} />;
          })}
        </Layer>
      </Stage>
    </div>
  );
};

export default TemplatePreview;
