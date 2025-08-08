import { useEffect } from "react";
import { useDesigner, ActionTypes } from "../context/DesignerContext";

const useKeyboardShortcuts = () => {
  const { state, dispatch } = useDesigner();
  const { selectedElement, pages } = state;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedElement) return; // No element selected, do nothing.

      // 1. Handle Delete and Backspace keys
      if (e.key === "Delete") {
        e.preventDefault(); // Prevent browser back navigation
        dispatch({
          type: ActionTypes.DELETE_ELEMENT,
          payload: { elementId: selectedElement },
        });
      }

      // 2. Handle Arrow Keys for nudging
      const nudgeAmount = e.shiftKey ? 10 : 1; // Nudge further if Shift is held
      let needsUpdate = false;
      const newProperties = {};

      switch (e.key) {
        case "ArrowUp":
          needsUpdate = true;
          newProperties.y = -nudgeAmount;
          break;
        case "ArrowDown":
          needsUpdate = true;
          newProperties.y = nudgeAmount;
          break;
        case "ArrowLeft":
          needsUpdate = true;
          newProperties.x = -nudgeAmount;
          break;
        case "ArrowRight":
          needsUpdate = true;
          newProperties.x = nudgeAmount;
          break;
        default:
          break;
      }

      if (needsUpdate) {
        e.preventDefault();
        dispatch({
          type: ActionTypes.NUDGE_ELEMENT, // We'll add this new action
          payload: { elementId: selectedElement, newProperties },
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedElement, dispatch]); // Rerun effect if selectedElement changes
};

export default useKeyboardShortcuts;
