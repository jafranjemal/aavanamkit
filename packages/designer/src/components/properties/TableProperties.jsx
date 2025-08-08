import React from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import PropertyInput from "./PropertyInput";

const TableProperties = ({ element, updateProperty }) => {
  const { columns = [], header, rows } = element;

  const handleColumnChange = (index, key, value) => {
    const newColumns = [...columns];
    newColumns[index] = { ...newColumns[index], [key]: value };
    updateProperty("columns", newColumns);
  };

  const addColumn = () => {
    const newColumns = [...columns, { header: "New Column", dataKey: "" }];
    updateProperty("columns", newColumns);
  };

  const removeColumn = (index) => {
    const newColumns = columns.filter((_, i) => i !== index);
    updateProperty("columns", newColumns);
  };

  const handleStyleChange = (section, key, value) => {
    const newSectionStyle = { ...element[section], [key]: value };
    updateProperty(section, newSectionStyle);
  };

  return (
    <div>
      {/* Header Styling */}
      <div className="p-2 border rounded mb-3">
        <h4 className="font-semibold text-sm mb-2">Header Styling</h4>
        <PropertyInput
          label="Height"
          type="number"
          value={header?.height || 30}
          onChange={(e) =>
            handleStyleChange("header", "height", parseInt(e.target.value))
          }
        />
        <PropertyInput
          label="Font Size"
          type="number"
          value={header?.fontSize || 12}
          onChange={(e) =>
            handleStyleChange("header", "fontSize", parseInt(e.target.value))
          }
        />
        <PropertyInput
          label="Background Color"
          type="color"
          value={header?.backgroundColor || "#f0f0f0"}
          onChange={(e) =>
            handleStyleChange("header", "backgroundColor", e.target.value)
          }
        />
        <PropertyInput
          label="Text Color"
          type="color"
          value={header?.textColor || "#000000"}
          onChange={(e) =>
            handleStyleChange("header", "textColor", e.target.value)
          }
        />
      </div>

      {/* Row Styling */}
      <div className="p-2 border rounded mb-3">
        <h4 className="font-semibold text-sm mb-2">Row Styling</h4>
        <PropertyInput
          label="Min Height"
          type="number"
          value={rows?.minHeight || 25}
          onChange={(e) =>
            handleStyleChange("rows", "minHeight", parseInt(e.target.value))
          }
        />
        <PropertyInput
          label="Font Size"
          type="number"
          value={rows?.fontSize || 10}
          onChange={(e) =>
            handleStyleChange("rows", "fontSize", parseInt(e.target.value))
          }
        />
        <PropertyInput
          label="Text Color"
          type="color"
          value={rows?.textColor || "#333333"}
          onChange={(e) =>
            handleStyleChange("rows", "textColor", e.target.value)
          }
        />
        <PropertyInput
          label="Even Row BG Color"
          type="color"
          value={rows?.evenBackgroundColor || "#ffffff"}
          onChange={(e) =>
            handleStyleChange("rows", "evenBackgroundColor", e.target.value)
          }
        />
        <PropertyInput
          label="Odd Row BG Color"
          type="color"
          value={rows?.oddBackgroundColor || "#f9f9f9"}
          onChange={(e) =>
            handleStyleChange("rows", "oddBackgroundColor", e.target.value)
          }
        />
      </div>

      {/* Column Definitions */}
      <div className="p-2 border rounded mb-3">
        <h4 className="font-semibold text-sm mb-2">Table Columns</h4>
        {columns.map((col, index) => (
          <div key={index} className="p-2 border rounded mb-2 bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-sm">Column {index + 1}</span>
              <button
                onClick={() => removeColumn(index)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>
            </div>
            <PropertyInput
              label="Header Text"
              value={col.header}
              onChange={(e) =>
                handleColumnChange(index, "header", e.target.value)
              }
            />
            <PropertyInput
              label="Data Key"
              value={col.dataKey}
              onChange={(e) =>
                handleColumnChange(index, "dataKey", e.target.value)
              }
            />
            <PropertyInput
              label="Width (pixels)"
              type="number"
              value={col.width}
              onChange={(e) =>
                handleColumnChange(index, "width", parseInt(e.target.value))
              }
            />
          </div>
        ))}
        <button
          onClick={addColumn}
          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          <FaPlus className="mr-2" /> Add Column
        </button>
      </div>
    </div>
  );
};

export default TableProperties;
