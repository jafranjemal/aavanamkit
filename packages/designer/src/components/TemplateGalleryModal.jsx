import React, { useEffect, useState } from "react";
import Modal from "./Modal";

import { useDesigner, ActionTypes } from "../context/DesignerContext";
import { fetchTemplatesAPI } from "../lib/templates";
import TemplatePreview from "./TemplatePreview";
const TemplateGalleryModal = ({ isOpen, onClose }) => {
  const { dispatch } = useDesigner();

  const [templateList, setTemplateList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch templates only when the modal is opened
    if (isOpen) {
      setIsLoading(true);
      fetchTemplatesAPI().then((data) => {
        setTemplateList(data);
        setIsLoading(false);
      });
    }
  }, [isOpen]);

  const handleSelectTemplate = (template) => {
    if (
      window.confirm(
        "Loading a new template will replace your current design. Are you sure?"
      )
    ) {
      dispatch({
        type: ActionTypes.LOAD_TEMPLATE, // New action
        payload: { template: template.template },
      });
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Choose a Template">
      {isLoading ? (
        <div className="text-center p-8">Loading Templates...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templateList.map((template) => (
            <div
              key={template.id}
              className="border rounded-lg p-4 hover:shadow-xl flex flex-col items-center justify-center hover:border-blue-500 cursor-pointer transition-shadow"
              onClick={() => handleSelectTemplate(template)}
            >
              <div className="border p-2 h-[170px]  mb-4   flex items-center justify-center overflow-hidden">
                <TemplatePreview
                  template={template.template}
                  previewWidth={150}
                />
              </div>
              <h4 className="font-semibold text-lg">{template.name}</h4>
              <p className="text-sm text-gray-600">{template.description}</p>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};

export default TemplateGalleryModal;
