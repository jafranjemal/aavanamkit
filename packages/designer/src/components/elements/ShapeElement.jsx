import React from "react";
import { Rect, Circle, Line } from "react-konva"; // <-- Import Line

const ShapeElement = React.forwardRef((props, ref) => {
  const { shape, ...rest } = props;

  switch (shape) {
    case "rect":
      return <Rect {...rest} ref={ref} />;
    case "circle":
      return <Circle {...rest} radius={props.width / 2} ref={ref} />;
    case "line":
      // A line is defined by points, not width/height. We'll use width for its length.
      // Note: The transformer will not work perfectly on a line. This is a limitation.
      return (
        <Line
          {...rest}
          points={[0, 0, props.width, 0]}
          tension={0}
          closed={false}
          ref={ref}
        />
      );
    default:
      return <Rect {...rest} ref={ref} />;
  }
});

export default ShapeElement;
