import React from "react";
import { useDesigner, ActionTypes } from "../context/DesignerContext";
import { FaTrash } from "react-icons/fa";

// Import property editor components
import TextProperties from "./properties/TextProperties";
import ImageProperties from "./properties/ImageProperties";
import ShapeProperties from "./properties/ShapeProperties";
import BarcodeProperties from "./properties/BarcodeProperties";
import PropertyInput from "./properties/PropertyInput";
import DataBinding from "./properties/DataBinding";
import TableProperties from "./properties/TableProperties";
import ConditionalRendering from "./properties/ConditionalRendering";

// Map element types to their property editor components
const propertiesMap = {
  Text: TextProperties,
  Image: ImageProperties,
  Shape: ShapeProperties,
  Barcode: BarcodeProperties,
  Table: TableProperties,
};

const PropertiesPanel = () => {
  const { state, dispatch } = useDesigner();
  const { selectedElement, pages, zoom } = state;

  const handleZoomChange = (e) => {
    dispatch({
      type: ActionTypes.SET_ZOOM,
      payload: { zoom: parseFloat(e.target.value) },
    });
  };

  const getSelectedElementDetails = () => {
    if (!selectedElement) return null;
    for (const page of pages) {
      const element = page.elements.find((el) => el.id === selectedElement);
      if (element) return element;
    }
    return null;
  };
  const updatePageProperty = (key, value) => {
    // Assuming we're always editing the first page for now
    dispatch({
      type: ActionTypes.UPDATE_PAGE_PROPERTIES,
      payload: { pageId: "page-1", newProperties: { [key]: value } },
    });
  };
  const element = getSelectedElementDetails();

  const updateProperty = (key, value) => {
    if (!element) return;
    dispatch({
      type: ActionTypes.UPDATE_ELEMENT,
      payload: {
        elementId: element.id,
        newProperties: { [key]: value },
      },
    });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this element?")) {
      dispatch({
        type: ActionTypes.DELETE_ELEMENT,
        payload: { elementId: selectedElement },
      });
    }
  };

  const SpecificProperties = element ? propertiesMap[element.type] : null;

  return (
    <div className="w-80 bg-white p-4 shadow-lg overflow-y-auto flex flex-col">
      <div className="flex-grow">
        <h2 className="text-lg font-semibold border-b pb-2 mb-4">Properties</h2>
        {element ? (
          <div>
            {/* Common Properties */}
            <h3 className="text-md font-medium text-gray-800 mb-2 border-b">
              Position & Size
            </h3>
            <PropertyInput
              label="X"
              type="number"
              value={Math.round(element.x)}
              onChange={(e) =>
                updateProperty("x", parseInt(e.target.value, 10))
              }
            />
            <PropertyInput
              label="Y"
              type="number"
              value={Math.round(element.y)}
              onChange={(e) =>
                updateProperty("y", parseInt(e.target.value, 10))
              }
            />
            <PropertyInput
              label="Width"
              type="number"
              value={Math.round(element.width)}
              onChange={(e) =>
                updateProperty("width", parseInt(e.target.value, 10))
              }
            />
            <PropertyInput
              label="Height"
              type="number"
              value={Math.round(element.height)}
              onChange={(e) =>
                updateProperty("height", parseInt(e.target.value, 10))
              }
            />
            <PropertyInput
              label="Rotation"
              type="number"
              value={Math.round(element.rotation || 0)}
              onChange={(e) =>
                updateProperty("rotation", parseInt(e.target.value, 10))
              }
            />

            {/* Specific Properties */}
            {SpecificProperties && (
              <div className="mt-4 pt-4 border-t">
                <h3 className="text-md font-medium text-gray-800 mb-2 border-b">
                  Element Specific
                </h3>
                <SpecificProperties
                  element={element}
                  updateProperty={updateProperty}
                />
              </div>
            )}
          </div>
        ) : (
          <div>
            <h3 className="text-md font-medium text-gray-800 mb-2 border-b">
              Page Properties
            </h3>
            <PropertyInput
              label="Background Color"
              type="color"
              value={pages[0]?.backgroundColor || "#ffffff"}
              onChange={(e) =>
                updatePageProperty("backgroundColor", e.target.value)
              }
            />
            <PropertyInput
              label="Background Image URL"
              value={pages[0]?.backgroundImage}
              onChange={(e) =>
                updatePageProperty("backgroundImage", e.target.value)
              }
            />
            <div className="mt-4 pt-4 border-t">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Zoom ({Math.round(zoom * 100)}%)
              </label>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.05"
                value={zoom}
                onChange={handleZoomChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>
      {element && <DataBinding element={element} />}
      {element && <ConditionalRendering element={element} />}

      {element && (
        <div className="mt-4 pt-4 border-t">
          <button
            onClick={handleDelete}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <FaTrash className="mr-2" /> Delete Element
          </button>
        </div>
      )}
    </div>
  );
};

export default PropertiesPanel;
