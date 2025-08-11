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
    <div className="ak:w-80 ak:bg-white ak:p-4 ak:shadow-lg ak:overflow-y-auto ak:flex ak:flex-col">
      <div className="ak:flex-grow">
        <h2 className="ak:text-lg ak:font-semibold ak:border-b ak:pb-2 ak:mb-4">Properties</h2>
        {element ? (
          <div>
            {/* Common Properties */}
            <h3 className="ak:text-md ak:font-medium ak:text-gray-800 ak:mb-2 ak:border-b">
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
              <div className="ak:mt-4 ak:pt-4 ak:border-t">
                <h3 className="ak:text-md ak:font-medium ak:text-gray-800 ak:mb-2 ak:border-b">
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
            <h3 className="ak:text-md ak:font-medium ak:text-gray-800 ak:mb-2 ak:border-b">
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
            <div className="ak:mt-4 ak:pt-4 ak:border-t">
              <label className="ak:block ak:text-sm ak:font-medium ak:text-gray-600 ak:mb-1">
                Zoom ({Math.round(zoom * 100)}%)
              </label>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.05"
                value={zoom}
                onChange={handleZoomChange}
                className="ak:w-full ak:h-2 ak:bg-gray-200 ak:rounded-lg ak:appearance-none ak:cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>
      {element && <DataBinding element={element} />}
      {element && <ConditionalRendering element={element} />}

      {element && (
        <div className="ak:mt-4 ak:pt-4 ak:border-t">
          <button
            onClick={handleDelete}
            className="ak:w-full ak:flex ak:items-center ak:justify-center ak:px-4 ak:py-2 ak:border ak:border-transparent ak:rounded-md ak:shadow-sm ak:text-sm ak:font-medium ak:text-white ak:bg-red-600 ak:hover:bg-red-700 ak:focus:outline-none ak:focus:ring-2 ak:focus:ring-offset-2 ak:focus:ring-red-500"
          >
            <FaTrash className="ak:mr-2" /> Delete Element
          </button>
        </div>
      )}
    </div>
  );
};

export default PropertiesPanel;
