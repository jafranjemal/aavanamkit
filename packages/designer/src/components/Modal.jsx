import React from "react";
import { FaTimes } from "react-icons/fa";

// A generic, reusable modal component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="ak:fixed ak:inset-0 ak:bg-black ak:bg-opacity-50 ak:z-50 ak:flex ak:justify-center ak:items-center">
      <div className="ak:bg-white ak:rounded-lg ak:shadow-xl ak:w-full ak:max-w-2xl ak:max-h-[80vh] ak:flex ak:flex-col">
        <div className="ak:flex ak:justify-between ak:items-center ak:p-4 ak:border-b">
          <h3 className="ak:text-xl ak:font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="ak:p-2 ak:rounded-full ak:hover:bg-gray-200"
          >
            <FaTimes />
          </button>
        </div>
        <div className="ak:p-6 ak:overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
