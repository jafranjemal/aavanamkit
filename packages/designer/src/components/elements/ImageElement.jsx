import React from "react";
import { Image } from "react-konva";
import useImage from "use-image";

const ImageElement = React.forwardRef((props, ref) => {
  // const [img] = useImage( "Anonymous");
  const corsProxy = "https://corsproxy.io/?";
  const [img] = useImage(corsProxy + props.src, "Anonymous");

  return <Image {...props} ref={ref} image={img} />;
});

export default ImageElement;
