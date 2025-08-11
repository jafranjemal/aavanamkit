import React, { useState } from "react";
import { DesignerProvider, useDesigner } from "./context/DesignerContext";
import Toolbar from "./components/Toolbar";
import Canvas from "./components/Canvas";
import PropertiesPanel from "./components/PropertiesPanel";
import DataSchemaModal from "./components/DataSchemaModal";
import PageSettingsModal from "./components/PageSettingsModal";
import TemplateGalleryModal from "./components/TemplateGalleryModal";
import "./index.css";
const AavanamKit = ({ template, data, schema, onSave }) => {
    const { state } = useDesigner();
  const [isSchemaModalOpen, setSchemaModalOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [isGalleryOpen, setGalleryOpen] = useState(false);
  return (
    <DesignerProvider initialTemplate={template} initialSchema={schema}>
      <div className={`aavanamkit-designer-root ${state.theme} ak-w-full ak-h-screen ak-flex ak-flex-col ak-font-sans ak-bg-gray-100 dark:ak-bg-gray-900`}>
     
        <Toolbar
          onOpenSchema={() => setSchemaModalOpen(true)}
          onOpenSettings={() => setSettingsModalOpen(true)}
          data={data}
          onSave={onSave}
          onOpenGallery={() => setGalleryOpen(true)}
        />
        <div className="ak:flex-grow ak:flex ak:flex-row ak:overflow-hidden">
          <Canvas />
          <PropertiesPanel />
        </div>
        <DataSchemaModal
          isOpen={isSchemaModalOpen}
          onClose={() => setSchemaModalOpen(false)}
        />
        <PageSettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setSettingsModalOpen(false)}
        />
        <TemplateGalleryModal
          isOpen={isGalleryOpen}
          onClose={() => setGalleryOpen(false)}
        />{" "}
        {/* <-- New modal */}
      </div>
    </DesignerProvider>
  );
};


const AavanamKitWrapper = (props) => (
  <DesignerProvider>
    <AavanamKit {...props} />
  </DesignerProvider>
);

export default AavanamKitWrapper;

 
