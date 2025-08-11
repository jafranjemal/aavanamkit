import React, { createContext, useContext, useReducer } from "react";
import { v4 as uuidv4 } from "uuid";
import JSON5 from "json5";
// --- Initial State ---
const initialState = {
   theme: 'light',
  pageSettings: {
    mode: "paged", // 'paged' or 'roll'
    size: "a4",
    orientation: "portrait",
    width: 595, // A4 portrait width in points
    height: 842, // A4 portrait height in points
    marginTop: 30,
    marginBottom: 30,
    marginLeft: 30,
    marginRight: 30,
  },
  pages: [
    { id: "page-1", width: 595, height: 842, elements: [] }, // A4 size in points
  ],
  selectedElement: null,
  dataSchema: {},
  zoom: 1,
};

// --- Action Types ---
export const ActionTypes = {
  ADD_ELEMENT: "ADD_ELEMENT",
  UPDATE_ELEMENT: "UPDATE_ELEMENT",
  DELETE_ELEMENT: "DELETE_ELEMENT",
  SELECT_ELEMENT: "SELECT_ELEMENT",
  SET_PAGES: "SET_PAGES",
  SET_DATA_SCHEMA: "SET_DATA_SCHEMA", // <-- Add this
  UPDATE_ELEMENT_BINDING: "UPDATE_ELEMENT_BINDING", // <-- And this
  NUDGE_ELEMENT: "NUDGE_ELEMENT",
  UPDATE_PAGE_PROPERTIES: "UPDATE_PAGE_PROPERTIES",
  UPDATE_ELEMENT_CONDITIONAL: "UPDATE_ELEMENT_CONDITIONAL",
  UPDATE_PAGE_SETTINGS: "UPDATE_PAGE_SETTINGS",
  LOAD_TEMPLATE: "LOAD_TEMPLATE",
  SET_ZOOM: "SET_ZOOM",
   SET_THEME: 'SET_THEME', 
};

export const PageSizes = {
  a4: { portrait: [595, 842], landscape: [842, 595] },
  letter: { portrait: [612, 792], landscape: [792, 612] },
  a5: {
    portrait: [420, 595],
    landscape: [595, 420],
  },
};

const normalizeJson = (schemaText) => {
  try {
    const match = schemaText.match(/\{[\s\S]*?\}/);
    if (!match) throw new Error("No JSON object found.");
    const jsonPortion = match[0];
    const parsed = JSON5.parse(jsonPortion);
    return JSON.stringify(parsed, null, 2);
  } catch (err) {
    console.error(err);
    alert("Invalid schema. Make sure you enter a valid object literal.");
    return null;
  }
};

// --- Reducer Function ---
const designerReducer = (state, action) => {
  switch (action.type) {

    case ActionTypes.SET_THEME: {
    return { ...state, theme: action.payload.theme };
}


    case ActionTypes.ADD_ELEMENT: {
      const { pageId, elementType, properties } = action.payload;
      const newElement = {
        id: uuidv4(),
        type: elementType,
        ...properties,
      };
      const newPages = state.pages.map((page) => {
        if (page.id === pageId) {
          return { ...page, elements: [...page.elements, newElement] };
        }
        return page;
      });
      return { ...state, pages: newPages, selectedElement: newElement.id };
    }

    case ActionTypes.UPDATE_ELEMENT: {
      const { elementId, newProperties } = action.payload;
      const newPages = state.pages.map((page) => ({
        ...page,
        elements: page.elements.map((el) =>
          el.id === elementId ? { ...el, ...newProperties } : el
        ),
      }));
      return { ...state, pages: newPages };
    }

    case ActionTypes.DELETE_ELEMENT: {
      const { elementId } = action.payload;
      const newPages = state.pages.map((page) => ({
        ...page,
        elements: page.elements.filter((el) => el.id !== elementId),
      }));
      const newSelectedElement =
        state.selectedElement === elementId ? null : state.selectedElement;
      return { ...state, pages: newPages, selectedElement: newSelectedElement };
    }

    case ActionTypes.SELECT_ELEMENT:
      return { ...state, selectedElement: action.payload.elementId };

    case ActionTypes.SET_DATA_SCHEMA:
      return { ...state, dataSchema: action.payload };

    case ActionTypes.UPDATE_ELEMENT_BINDING: {
      const { elementId, binding } = action.payload;
      const newPages = state.pages.map((page) => ({
        ...page,
        elements: page.elements.map((el) => {
          if (el.id === elementId) {
            // Create a new object for the element with the updated binding
            return { ...el, dataBinding: binding };
          }
          return el;
        }),
      }));
      return { ...state, pages: newPages };
    }

    case ActionTypes.NUDGE_ELEMENT: {
      const { elementId, newProperties } = action.payload;
      const newPages = state.pages.map((page) => ({
        ...page,
        elements: page.elements.map((el) => {
          if (el.id === elementId) {
            return {
              ...el,
              x: el.x + (newProperties.x || 0),
              y: el.y + (newProperties.y || 0),
            };
          }
          return el;
        }),
      }));
      return { ...state, pages: newPages };
    }

    case ActionTypes.UPDATE_PAGE_PROPERTIES: {
      const { pageId, newProperties } = action.payload;
      const newPages = state.pages.map((page) => {
        if (page.id === pageId) {
          return { ...page, ...newProperties };
        }
        return page;
      });
      return { ...state, pages: newPages };
    }

    case ActionTypes.UPDATE_ELEMENT_CONDITIONAL: {
      const { elementId, conditional } = action.payload;
      const newPages = state.pages.map((page) => ({
        ...page,
        elements: page.elements.map((el) =>
          el.id === elementId ? { ...el, conditional } : el
        ),
      }));
      return { ...state, pages: newPages };
    }
    case ActionTypes.UPDATE_PAGE_SETTINGS: {
      const { size, orientation } = action.payload;
      const newSettings = action.payload;
      // const newSettings = { size, orientation, width, height };
      const isPaged = newSettings.mode === "paged";
      const [width, height] =
        isPaged && newSettings.size !== "custom"
          ? PageSizes[newSettings.size][newSettings.orientation]
          : [newSettings.width, newSettings.height];

      const finalSettings = { ...newSettings, width, height };
      const newPages = state.pages.map((p) => ({
        ...p,
        width: finalSettings.width,
        height: finalSettings.height,
      }));

      return { ...state, pageSettings: finalSettings, pages: newPages };
    }
    case ActionTypes.LOAD_TEMPLATE: {
      // Completely replace the state with the loaded template,
      // but keep the dataSchema and selectedElement states.
      const { template } = action.payload;

      // 3. Re-stringify to strict JSON for display and storage
      const prettySchema =
        typeof template.dataSchema === "string"
          ? normalizeJson(template.dataSchema)
          : JSON.stringify(template.dataSchema, null, 2);
      console.log("prettySchema ", prettySchema);
      return {
        selectedElement: null, // Reset selection on new template.
        zoom: 1, // Reset zoom.
        pageSettings: template.pageSettings,
        pages: template.pages,
        dataSchema: prettySchema,
        //...template, // Load all settings and pages from the template
        // dataSchema: state.dataSchema, // Persist existing schema
      };
    }

    case ActionTypes.SET_ZOOM: {
      // Clamp the zoom level between 10% and 500% for usability
      const newZoom = Math.max(0.1, Math.min(action.payload.zoom, 5));
      return { ...state, zoom: newZoom };
    }

    default:
      return state;
  }
};

// --- Context Creation ---
const DesignerContext = createContext();

// --- Context Provider Component ---
export const DesignerProvider = ({
  children,
  initialTemplate,
  initialSchema,
}) => {
  // If an initial template is provided, merge it with the initial state
  const startingState = {
    ...initialState,
    ...(initialTemplate || {}),
    dataSchema:
      initialSchema || initialTemplate?.dataSchema || initialState.dataSchema,
  };
  const [state, dispatch] = useReducer(designerReducer, startingState);
  return (
    <DesignerContext.Provider value={{ state, dispatch }}>
      {children}
    </DesignerContext.Provider>
  );
};

// --- Custom Hook ---
export const useDesigner = () => {
  const context = useContext(DesignerContext);
  if (!context) {
    throw new Error("useDesigner must be used within a DesignerProvider");
  }
  return context;
};
