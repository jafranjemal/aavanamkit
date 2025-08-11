import React from "react";
import { useDesigner, ActionTypes } from "../../context/DesignerContext";
 

const getSchemaPaths = (schema) => {
  // THE FIX: Add a robust validation check at the very beginning.
  // If the input isn't a valid object or a non-empty array, return an empty array.

  // if (typeof schema !== 'object' || schema === null || (Array.isArray(schema) && schema.length === 0)) {
  //   return [];
  // }

  const schemaPath = typeof schema ==="string" ?  JSON.parse(schema) : schema
 


  // This recursive helper function finds all possible paths.
  function findPaths(currentValue, path = '') {
    let arrayPaths = [];
    let primitivePaths = [];

    // Base Case: If the value is not an object or array, it's a primitive path.
    if (typeof currentValue !== 'object' || currentValue === null) {
      if (path) primitivePaths.push(path); // Only add if it has a path
      return { arrays: arrayPaths, primitives: primitivePaths };
    }

    // Case 1: The value is an array.
    if (Array.isArray(currentValue)) {
      const arrayPath = path ? `${path}[]` : 'root[]';
      arrayPaths.push(arrayPath);

      // Analyze the first item in the array to find its nested structure.
      if (currentValue.length > 0) {
        const subPaths = findPaths(currentValue[0], path || 'root');
        arrayPaths = [...arrayPaths, ...subPaths.arrays];
        primitivePaths = [...primitivePaths, ...subPaths.primitives];
      }
    } else {
      // Case 2: The value is an object.
      for (const key in currentValue) {
        if (Object.prototype.hasOwnProperty.call(currentValue, key)) {
          const newPath = path ? `${path}.${key}` : key;
          const subPaths = findPaths(currentValue[key], newPath);
          arrayPaths = [...arrayPaths, ...subPaths.arrays];
          primitivePaths = [...primitivePaths, ...subPaths.primitives];
        }
      }
    }
    
    return { arrays: arrayPaths, primitives: primitivePaths };
  }

  // --- Main Execution ---
  const { arrays, primitives } = findPaths(schemaPath);
  
  const uniqueArrays = [...new Set(arrays)].sort();
  const uniquePrimitives = [...new Set(primitives)].sort();

  return [...uniqueArrays, ...uniquePrimitives];
};

const DataBinding = ({ element }) => {
  const { state, dispatch } = useDesigner();
  const schemaPaths = getSchemaPaths(state.dataSchema);
  const selectedBinding = (element && element.dataBinding?.field) || "";

 
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
    <div className="ak:mt-4 ak:pt-4 ak:border-t">
      <h3 className="ak:text-md ak:font-medium ak:text-gray-800 ak:mb-2 ak:border-b">
        Data Binding
      </h3>
      <label className="ak:block ak:text-sm ak:font-medium ak:text-gray-600 ak:mb-1">
        Bind to Schema Field
      </label>
      <select
        value={selectedBinding}
        onChange={handleBindingChange}
        className="ak:w-full ak:px-2 ak:py-1 ak:border ak:border-gray-300 ak:rounded-md ak:shadow-sm ak:focus:ring-indigo-500 ak:focus:border-indigo-500 ak:sm:text-sm"
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
        <p className="ak:text-xs ak:text-green-600 ak:mt-1">
          Bound to: {selectedBinding}
        </p>
      )}
    </div>
  );
};

export default DataBinding;
