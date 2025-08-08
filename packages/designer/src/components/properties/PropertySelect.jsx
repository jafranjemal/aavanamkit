import React from "react";

const PropertySelect = ({ label, value, onChange, options }) => {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>
      <select
        value={value || ""}
        onChange={onChange}
        className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PropertySelect;
