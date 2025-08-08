import React, { useEffect, useRef } from "react";
import { Transformer } from "react-konva";
import { useDesigner, ActionTypes } from "../../context/DesignerContext";

const ElementWrapper = ({ element, children }) => {
  const { state, dispatch } = useDesigner();
  const shapeRef = useRef();
  const trRef = useRef();

  const isSelected = element.id === state.selectedElement;

  useEffect(() => {
    if (isSelected && trRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleSelect = (e) => {
    // Prevent deselection when clicking an already selected element
    e.cancelBubble = true;
    dispatch({
      type: ActionTypes.SELECT_ELEMENT,
      payload: { elementId: element.id },
    });
  };

  const handleDragEnd = (e) => {
    dispatch({
      type: ActionTypes.UPDATE_ELEMENT,
      payload: {
        elementId: element.id,
        newProperties: { x: e.target.x(), y: e.target.y() },
      },
    });
  };

  const handleTransformEnd = (e) => {
    const node = shapeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    node.scaleX(1);
    node.scaleY(1);

    dispatch({
      type: ActionTypes.UPDATE_ELEMENT,
      payload: {
        elementId: element.id,
        newProperties: {
          x: node.x(),
          y: node.y(),
          width: Math.max(5, node.width() * scaleX),
          height: Math.max(5, node.height() * scaleY),
          rotation: node.rotation(),
        },
      },
    });
  };

  return (
    <>
      {React.cloneElement(children, {
        ref: shapeRef,
        onClick: handleSelect,
        onTap: handleSelect,
        onDragEnd: handleDragEnd,
        onTransformEnd: handleTransformEnd,
        draggable: true,
        ...element,
      })}
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

export default ElementWrapper;
