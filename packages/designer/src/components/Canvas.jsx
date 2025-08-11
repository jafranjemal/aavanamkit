import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Rect } from "react-konva";
import { useDesigner, ActionTypes } from "../context/DesignerContext";

// Import all element components
import ElementWrapper from "./elements/ElementWrapper";
import TextElement from "./elements/TextElement";
import ImageElement from "./elements/ImageElement";
import ShapeElement from "./elements/ShapeElement";
import BarcodeElement from "./elements/BarcodeElement";
import TableElement from "./elements/TableElement";
import useImage from "use-image";
import { Image as KonvaImage } from "react-konva";
import useKeyboardShortcuts from "../hooks/useKeyboardShortcuts";
import MarginGuides from "./elements/MarginGuides";
// A mapping from element type to its component
const elementComponentMap = {
  Text: TextElement,
  Image: ImageElement,
  Shape: ShapeElement,
  Barcode: BarcodeElement,
  Table: TableElement,
};

const PageBackground = ({ page, onDeselect }) => {
  const corsProxy = "https://corsproxy.io/?";
  const [img] = useImage(corsProxy + page.backgroundImage, "Anonymous");

 
  return (
    <>
      {/* Background Color */}

      {/* Background Image */}
      {page.backgroundImage && img ? (
        <KonvaImage
          image={img}
          x={0}
          y={0}
          width={page.width}
          height={page.height}
          onClick={onDeselect}
          listening={false}
        />
      ) : (
        <Rect
          onClick={onDeselect}
          x={0}
          y={0}
          width={page.width}
          height={page.height}
          fill={page.backgroundColor || "#ffffff"}
        />
      )}
    </>
  );
};

const Canvas = () => {
  const { state, dispatch } = useDesigner();
  const { pages, zoom, pageSettings } = state;
  // Get zoom from state
  const canvasContainerRef = useRef(null);
  const [isSpacePressed, setIsCtrlPressed] = useState(false);

  useKeyboardShortcuts();
  const handleDeselect = (e) => {
    // Deselect if the click is on the stage itself, not a shape
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      dispatch({
        type: ActionTypes.SELECT_ELEMENT,
        payload: { elementId: null },
      });
    }
  };

  // Handle zooming with Ctrl + Mouse Wheel
  const handleWheelZoom = (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const scaleBy = 1.1;
      const newZoom = e.deltaY > 0 ? zoom / scaleBy : zoom * scaleBy;
      dispatch({ type: ActionTypes.SET_ZOOM, payload: { zoom: newZoom } });
    }
  };
  // Handle panning with Spacebar + Drag
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const handleKeyDown = (e) => {
      if (e.code === "ControlLeft" || e.code === "ControlRight") {
        e.preventDefault();
        setIsCtrlPressed(true);
        container.style.cursor = "grab";
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === "ControlLeft" || e.code === "ControlRight") {
        setIsCtrlPressed(false);
        container.style.cursor = "default";
      }
    };

    let isDown = false;
    let startX, startY, scrollLeft, scrollTop;

    const handleMouseDown = (e) => {
      if (isSpacePressed) {
        isDown = true;
        container.style.cursor = "grabbing";
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
        startY = e.pageY - container.offsetTop;
        scrollTop = container.scrollTop;
      }
    };
    const handleMouseLeaveOrUp = () => {
      isDown = false;
      if (isSpacePressed) container.style.cursor = "grab";
    };
    const handleMouseMove = (e) => {
      if (!isDown || !isSpacePressed) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walkX = (x - startX) * 2;
      container.scrollLeft = scrollLeft - walkX;

      const y = e.pageY - container.offsetTop;
      const walkY = (y - startY) * 2;
      container.scrollTop = scrollTop - walkY;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    container.addEventListener("wheel", handleWheelZoom, { passive: false });
    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mouseleave", handleMouseLeaveOrUp);
    container.addEventListener("mouseup", handleMouseLeaveOrUp);
    container.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      container.removeEventListener("wheel", handleWheelZoom);
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mouseleave", handleMouseLeaveOrUp);
      container.removeEventListener("mouseup", handleMouseLeaveOrUp);
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, [zoom, isSpacePressed, dispatch]);

  return (
    <div
      ref={canvasContainerRef}
      className="ak:flex-grow ak:bg-gray-200 ak:p-8 ak:overflow-auto"
    >
      <div
        className="ak:mx-auto"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "top center",
          width: pages[0].width, // Maintain width for centering
        }}
      >
        {pages.map((page) => (
          <div
            key={page.id}
            className="ak:bg-white ak:shadow-lg ak:mx-auto ak:mb-8"
            style={{ width: page.width, height: page.height }}
          >
            <Stage
              width={page.width}
              height={page.height}
              onMouseDown={handleDeselect}
              onTouchStart={handleDeselect}
            >
              <Layer>
                <PageBackground
                  page={page}
                  onDeselect={() =>
                    dispatch({
                      type: ActionTypes.SELECT_ELEMENT,
                      payload: { elementId: null },
                    })
                  }
                />
                <MarginGuides pageSettings={pageSettings} />

                {page.elements.map((element) => {
                  const ElementComponent = elementComponentMap[element.type];
                  if (!ElementComponent) return null;

                  return (
                    <ElementWrapper key={element.id} element={element}>
                      <ElementComponent {...element} />
                    </ElementWrapper>
                  );
                })}
              </Layer>
            </Stage>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Canvas;
