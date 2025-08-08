import React from "react";
import Modal from "./Modal";
import {
  useDesigner,
  ActionTypes,
  PageSizes,
} from "../context/DesignerContext";
import PropertySelect from "./properties/PropertySelect";
import PropertyInput from "./properties/PropertyInput";

const PageSettingsModal = ({ isOpen, onClose }) => {
  const { state, dispatch } = useDesigner();
  const { pageSettings } = state;

  const handleSettingChange = (key, value) => {
    const newSettings = { ...pageSettings, [key]: value };

    // If a standard size is chosen, update width/height automatically
    if (key === "size" && value !== "custom") {
      const [width, height] = PageSizes[value][newSettings.orientation];
      newSettings.width = width;
      newSettings.height = height;
    }
    if (key === "orientation" && newSettings.size !== "custom") {
      const [width, height] = PageSizes[newSettings.size][value];
      newSettings.width = width;
      newSettings.height = height;
    }

    dispatch({
      type: ActionTypes.UPDATE_PAGE_SETTINGS,
      payload: newSettings,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Page Settings">
      <PropertySelect
        label="Page Mode"
        value={pageSettings.mode}
        onChange={(e) => handleSettingChange("mode", e.target.value)}
        options={[
          { value: "paged", label: "Paged (A4, Letter, etc.)" },
          { value: "roll", label: "Continuous Roll (Receipts)" },
        ]}
      />
      {pageSettings.mode === "paged" && (
        <div className="p-2 border rounded my-2">
          <PropertySelect
            label="Page Size"
            value={pageSettings.size}
            onChange={(e) => handleSettingChange("size", e.target.value)}
            options={[
              { value: "a4", label: "A4" },
              { value: "a5", label: "A5" },
              { value: "letter", label: "Letter" },
              { value: "custom", label: "Custom" },
            ]}
          />
          {pageSettings.size === "custom" && (
            <div className="grid grid-cols-2 gap-4 my-2 p-2 border rounded">
              <PropertyInput
                label="Width (pt)"
                type="number"
                value={pageSettings.width}
                onChange={(e) =>
                  handleSettingChange("width", parseInt(e.target.value))
                }
              />
              <PropertyInput
                label="Height (pt)"
                type="number"
                value={pageSettings.height}
                onChange={(e) =>
                  handleSettingChange("height", parseInt(e.target.value))
                }
              />
            </div>
          )}
          <PropertySelect
            label="Orientation"
            value={pageSettings.orientation}
            onChange={(e) => handleSettingChange("orientation", e.target.value)}
            options={[
              { value: "portrait", label: "Portrait" },
              { value: "landscape", label: "Landscape" },
            ]}
          />
        </div>
      )}

      {pageSettings.mode === "roll" && (
        <div className="p-2 border rounded my-2">
          <PropertyInput
            label="Width (pt)"
            type="number"
            value={pageSettings.width}
            onChange={(e) =>
              handleSettingChange("width", parseInt(e.target.value))
            }
          />
          <p className="text-xs text-gray-500 mt-1">
            Height is determined by content.
          </p>
        </div>
      )}
      <div className="mt-4 pt-4 border-t">
        <h4 className="font-semibold mb-2">Margins (pt)</h4>
        <div className="grid grid-cols-2 gap-4">
          <PropertyInput
            label="Top"
            type="number"
            value={pageSettings.marginTop || 0}
            onChange={(e) =>
              handleSettingChange("marginTop", parseInt(e.target.value))
            }
          />
          <PropertyInput
            label="Bottom"
            type="number"
            value={pageSettings.marginBottom || 0}
            onChange={(e) =>
              handleSettingChange("marginBottom", parseInt(e.target.value))
            }
          />
          <PropertyInput
            label="Left"
            type="number"
            value={pageSettings.marginLeft || 0}
            onChange={(e) =>
              handleSettingChange("marginLeft", parseInt(e.target.value))
            }
          />
          <PropertyInput
            label="Right"
            type="number"
            value={pageSettings.marginRight || 0}
            onChange={(e) =>
              handleSettingChange("marginRight", parseInt(e.target.value))
            }
          />
        </div>
      </div>
    </Modal>
  );
};

export default PageSettingsModal;
