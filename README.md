1. Global Monorepo READMEInstructions: This content should be placed in the README.md file at the absolute root of your aavanamkit-monorepo/ directory.The AavanamKit ProjectAavanamKit is a complete, open-source ecosystem for creating, designing, and generating data-driven documents in modern web applications.It provides a powerful visual designer for your users and a robust, headless engine for your backend, allowing you to stop being a report designer and get back to being a software engineer.About The ProjectThe AavanamKit monorepo contains two core packages that work together seamlessly:@aavanamkit/designer (Frontend)A powerful, embeddable React component that provides a full WYSIWYG "design studio" for your users. They can visually create and edit document templates with a drag-and-drop interface.» Go to Designer README@aavanamkit/engine (Backend)A pure, headless Node.js library with zero browser dependencies. It takes the templates created by the designer, merges them with your live data, and generates pixel-perfect documents in multiple formats (PDF, DOCX, HTML) on the server.» Go to Engine READMEThe Core PhilosophyDevelopers should build systems, not documents. AavanamKit empowers your end-users to manage their own document designs, freeing you from the endless cycle of tweaking layouts and styles in your codebase.Getting StartedThis repository is a monorepo. To get started with development:Clone the repository:git clone https://github.com/your-username/aavanamkit-monorepo.git
cd aavanamkit-monorepo
Install dependencies for all packages:We recommend using npm workspaces.npm install
Run the Designer for development:npm run dev --workspace=@aavanamkit/designer
Run tests for the Engine:npm test --workspace=@aavanamkit/engine
ContributingThe AavanamKit Project is a community-driven, open-source initiative and we welcome contributions of all kinds. Please read our CONTRIBUTING.md guide for details on our code of conduct and the process for submitting changes.LicenseThis project is licensed under the MIT License. See the LICENSE file for details.The AavanamKit Project - Founded by JJSOFT GLOBAL<br/><hr/><br/>2. @aavanamkit/designer READMEInstructions: This content should be placed in the README.md file inside your packages/designer/ directory.@aavanamkit/designerThe visual, embeddable React component for designing data-driven document templates.About The Component@aavanamkit/designer is a complete "design studio in a box." It provides a powerful WYSIWYG canvas that you can embed directly into your React application, allowing your users to create and manage their own document layouts.It is the frontend counterpart to the @aavanamkit/engine.Core FeaturesFull WYSIWYG Canvas: A complete drag-and-drop interface for designing invoices, receipts, tickets, and more.Component-Based Elements: Includes Text, Image, Shape, Barcode, and an advanced, auto-paginating Table.Powerful Data Binding: Easily bind any element to your application's data structure via a schema prop.Live Template Gallery: Provide your users with professional, pre-built templates to get them started.Flexible Page Control: Supports standard page sizes (A4, Letter), custom dimensions, and a "Continuous Roll" mode for thermal printers.InstallationInstall the designer in your React project using npm:npm install @aavanamkit/designer
UsageImport the AavanamKit component and its required CSS file. You control the designer by passing it your application's data schema and wiring up the onSave callback to your backend.import React, { useState, useEffect } from 'react';
import AavanamKit from '@aavanamkit/designer';
// Assuming you have a CSS file to import, or styles are handled by your build process.
// import '@aavanamkit/designer/dist/style.css';

function MyTemplateEditor() {
  // 1. The data schema from YOUR application
  const myAppSchema = {
    customer: { name: "string", address: "string" },
    invoiceNumber: "string",
    items: [{ description: "string", total: "number" }]
  };

  // 2. Load a previously saved template from your database
  const [template, setTemplate] = useState(null);
  useEffect(() => {
    // fetchTemplateFromApi().then(savedTemplate => setTemplate(savedTemplate));
  }, []);

  // 3. The onSave callback sends the template JSON to your API
  const handleSave = async (newTemplate) => {
    console.log("Saving template to database:", newTemplate);
    // await saveTemplateToApi(newTemplate);
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <AavanamKit
        schema={myAppSchema}
        template={template}
        onSave={handleSave}
      />
    </div>
  );
}
Component API (<AavanamKit />)PropTypeRequiredDescriptionschemaobjectYesAn object representing the data structure of your application. This populates the data binding options.onSavefunctionYesA callback function that receives the complete template JSON object whenever the user saves.templateobjectNoA previously saved template object to load into the designer.dataobjectNoSample data used for live previews and in-browser exporting.LicenseThis project is licensed under the MIT License.