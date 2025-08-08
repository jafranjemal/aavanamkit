import React from "react";
import { Text } from "react-konva";

// Use React.forwardRef to pass the ref down to the Konva Text component
const TextElement = React.forwardRef((props, ref) => {
  return <Text {...props} ref={ref} />;
});

export default TextElement;
