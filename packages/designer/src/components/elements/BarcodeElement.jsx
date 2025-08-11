import React, { useMemo } from "react";
import { Image } from "react-konva";
import * as JsBarcode from "jsbarcode";

const BarcodeElement = React.forwardRef((props, ref) => {
  // Generate the barcode image using an in-memory canvas
  const barcodeImage = useMemo(() => {
    const canvas = document.createElement("canvas");
    try {
      const barcodeGenerator = JsBarcode.default || JsBarcode;
      barcodeGenerator(canvas, props.text, {
        format: "CODE128",
        displayValue: false, // Don't show the text value below the barcode
        margin: 0,
        width: 2,
        height: 50,
      });
      return canvas;
    } catch (e) {
      console.error("Barcode generation failed", e);
      return null;
    }
  }, [props.text]);

  return <Image {...props} ref={ref} image={barcodeImage} />;
});

export default BarcodeElement;
