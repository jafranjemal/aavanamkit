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
        <div className="ak:text-center ak:p-8">Loading Templates...</div>
      ) : (
        <div className="ak:grid ak:grid-cols-1 ak:md:grid-cols-2 ak:gap-6">
          {templateList.map((template) => (
            <div
              key={template.id}
              className="ak:border ak:rounded-lg ak:p-4 ak:hover:shadow-xl ak:flex ak:flex-col ak:items-center ak:justify-center ak:hover:border-blue-500 ak:cursor-pointer ak:transition-shadow"
              onClick={() => handleSelectTemplate(template)}
            >
              <div className="ak:border ak:p-2 ak:h-[170px] ak: ak:mb-4 ak: ak: ak:flex ak:items-center ak:justify-center ak:overflow-hidden">
                <TemplatePreview
                  template={template.template}
                  previewWidth={150}
                />
              </div>
              <h4 className="ak:font-semibold ak:text-lg">{template.name}</h4>
              <p className="ak:text-sm ak:text-gray-600">{template.description}</p>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};

export default TemplateGalleryModal;
