import React from "react";
import { Rect } from "react-konva";

const MarginGuides = ({ pageSettings }) => {
  const { width, height, marginTop, marginBottom, marginLeft, marginRight } =
    pageSettings;

  return (
    <>
      <Rect
        x={marginLeft}
        y={marginTop}
        width={width - marginLeft - marginRight}
        height={height - marginTop - marginBottom}
        stroke="#00a8ff"
        strokeWidth={1}
        dash={[4, 4]}
        listening={false} // Make it non-interactive
      />
    </>
  );
};

export default MarginGuides;
