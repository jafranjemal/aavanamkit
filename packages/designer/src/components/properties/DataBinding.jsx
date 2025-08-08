import React from "react";
import { useDesigner, ActionTypes } from "../../context/DesignerContext";

// A helper function to flatten the schema object into a list of paths
const getSchemaPaths = (obj, prefix = "") => {
  if (Array.isArray(obj)) {
    const firstElement = obj.find((item) => item !== undefined);
    if (firstElement !== undefined) {
      return getSchemaPaths(firstElement, prefix + "[]");
    }
    return [prefix + "[]"];
  }

  if (typeof obj === "object" && obj !== null) {
    return Object.keys(obj).reduce((acc, key) => {
      const newPrefix = prefix ? `${prefix}.${key}` : key;
      acc.push(...getSchemaPaths(obj[key], newPrefix));
      return acc;
    }, []);
  }

  // Handle primitives - only return path if prefix exists
  return prefix ? [prefix] : [];
};
const DataBinding = ({ element }) => {
  const { state, dispatch } = useDesigner();
  const schemaPaths = getSchemaPaths(state.dataSchema);
  const selectedBinding = (element && element.dataBinding?.field) || "";

  console.log(schemaPaths);
  const handleBindingChange = (e) => {
    const field = e.target.value;
    // For tables, we bind the whole element. For others, just a property.
    const propertyToBind = element.type === "Table" ? "items" : "text";
    dispatch({
      type: ActionTypes.UPDATE_ELEMENT_BINDING,
      payload: {
        elementId: element.id,
        binding: field ? { property: propertyToBind, field } : null,
      },
    });
  };

  return (
    <div className="mt-4 pt-4 border-t">
      <h3 className="text-md font-medium text-gray-800 mb-2 border-b">
        Data Binding
      </h3>
      <label className="block text-sm font-medium text-gray-600 mb-1">
        Bind to Schema Field
      </label>
      <select
        value={selectedBinding}
        onChange={handleBindingChange}
        className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        <option value="">-- None --</option>
        {schemaPaths.map((path) => (
          <option key={path} value={path}>
            {path}
          </option>
        ))}

        {/* {schemaPaths
          // Filter paths based on element type
          .filter((path) => {
            if (element && element.type === "Table") return path.endsWith("[]");
            return !path.endsWith("[]");
          })
          .map((path) => (
            <option key={path} value={path}>
              {path}
            </option>
          ))} */}
      </select>
      {selectedBinding && (
        <p className="text-xs text-green-600 mt-1">
          Bound to: {selectedBinding}
        </p>
      )}
    </div>
  );
};

export default DataBinding;
