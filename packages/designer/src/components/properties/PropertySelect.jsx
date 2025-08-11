import React from "react";

const PropertySelect = ({ label, value, onChange, options }) => {
  return (
    <div className="ak:mb-3">
      <label className="ak:block ak:text-sm ak:font-medium ak:text-gray-600 ak:mb-1">
        {label}
      </label>
      <select
        value={value || ""}
        onChange={onChange}
        className="ak:w-full ak:px-2 ak:py-1 ak:border ak:border-gray-300 ak:rounded-md ak:shadow-sm ak:focus:ring-indigo-500 ak:focus:border-indigo-500 ak:sm:text-sm"
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
