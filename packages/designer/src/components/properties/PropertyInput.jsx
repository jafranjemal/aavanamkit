import React from "react";

// A generic component for a labeled input field in the properties panel.
const PropertyInput = ({ label, type = "text", value, onChange, ...props }) => {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value || ""}
        onChange={onChange}
        className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        {...props}
      />
    </div>
  );
};

export default PropertyInput;
