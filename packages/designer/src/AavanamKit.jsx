import React, { useState } from "react";
import { DesignerProvider } from "./context/DesignerContext";
import Toolbar from "./components/Toolbar";
import Canvas from "./components/Canvas";
import PropertiesPanel from "./components/PropertiesPanel";
import DataSchemaModal from "./components/DataSchemaModal";
import PageSettingsModal from "./components/PageSettingsModal";
import TemplateGalleryModal from "./components/TemplateGalleryModal";

const AavanamKit = ({ template, data, schema, onSave }) => {
  const [isSchemaModalOpen, setSchemaModalOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [isGalleryOpen, setGalleryOpen] = useState(false);
  return (
    <DesignerProvider initialTemplate={template} initialSchema={schema}>
      <div className="w-full h-screen flex flex-col font-sans bg-gray-100">
        <Toolbar
          onOpenSchema={() => setSchemaModalOpen(true)}
          onOpenSettings={() => setSettingsModalOpen(true)}
          data={data}
          onSave={onSave}
          onOpenGallery={() => setGalleryOpen(true)}
        />
        <div className="flex-grow flex flex-row overflow-hidden">
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

export default AavanamKit;
