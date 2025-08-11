import React from "react";

// A generic component for a labeled input field in the properties panel.
const PropertyInput = ({ label, type = "text", value, onChange, ...props }) => {
  return (
    <div className="ak:mb-3">
      <label className="ak:block ak:text-sm ak:font-medium ak:text-gray-600 ak:mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value || ""}
        onChange={onChange}
        className="ak:w-full ak:px-2 ak:py-1 ak:border ak:border-gray-300 ak:rounded-md ak:shadow-sm ak:focus:ring-indigo-500 ak:focus:border-indigo-500 ak:sm:text-sm"
        {...props}
      />
    </div>
  );
};

export default PropertyInput;
