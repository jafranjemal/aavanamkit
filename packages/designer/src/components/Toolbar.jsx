import React, { useState } from "react";
import { useDesigner, ActionTypes } from "../context/DesignerContext";
import {
  FaMousePointer,
  FaTextHeight,
  FaImage,
  FaSquare,
  FaBarcode,
  FaDatabase,
  FaFilePdf,
  FaTable,
  FaCog,
  FaSave,
  FaPlusSquare,
} from "react-icons/fa";
import { exportToPdf } from "../lib/pdfExporter"; // Import the exporter
import { FaFileWord, FaFileCode, FaPrint } from "react-icons/fa";
import * as exportEngine from "../lib/exportEngine"; // Import all exports
const Toolbar = ({
  onOpenSchema,
  data,
  onOpenSettings,
  onOpenGallery,
  onSave,
}) => {
  const { state, dispatch } = useDesigner();
  const [isExportOpen, setExportOpen] = useState(false);

  const getTemplate = () => ({
    pageSettings: state.pageSettings,
    pages: state.pages,
  });

  const handleSave = () => {
    if (onSave) {
      // We pass the relevant parts of the state that constitute the template
      const template = {
        pageSettings: state.pageSettings,
        pages: state.pages,
      };
      onSave(template);
      alert("Template Saved! (Check console)"); // User feedback
    }
  };

  const addElement = (elementType, properties) => {
    if (elementType === "Table") {
      // Provide the full, detailed initial properties for the advanced table
      properties = {
        x: 50,
        y: 150,
        width: 500,
        height: 300,
        dataBinding: { property: "items", field: "items[]" },
        header: {
          height: 30,
          fontSize: 12,
          backgroundColor: "#f0f0f0",
          textColor: "#000000",
        },
        rows: {
          minHeight: 25,
          fontSize: 10,
          textColor: "#333333",
          evenBackgroundColor: "#ffffff",
          oddBackgroundColor: "#f9f9f9",
        },
        columns: [
          { header: "Description", dataKey: "description", width: 250 },
          { header: "Qty", dataKey: "qty", width: 75 },
          { header: "Price", dataKey: "price", width: 175 },
        ],
        ...properties, // Allow for overrides
      };
    }

    dispatch({
      type: ActionTypes.ADD_ELEMENT,
      payload: { pageId: "page-1", elementType, properties },
    });
  };

  const handleExport = () => {
    // We pass the template state and the live data prop to the exporter
    exportToPdf(state.pages, data, state.pageSettings);
  };

  //   const handleDocxExport = async () => {
  //     console.log("Starting DOCX export...");
  //     await exportEngine.exportToDocx(getTemplate(), data);
  //     console.log("DOCX export finished.");
  //   };
  const handleDocxExport = async () => {
    setExportOpen(false); // Close the menu
    alert("Generating Word document... Please wait.");
    try {
      await exportEngine.exportToDocx(getTemplate(), data);
    } catch (error) {
      console.error("Failed to generate DOCX file:", error);
      alert(
        "An error occurred while generating the Word document. See console for details."
      );
    }
  };

  return (
    <div className="bg-white shadow-md p-2 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h1 className="text-lg font-bold">AavanamKit</h1>
        <button
          onClick={onOpenGallery}
          className="flex items-center px-3 py-2 rounded bg-green-600 hover:bg-green-700 text-white text-sm font-medium"
        >
          <FaPlusSquare className="mr-2" /> New from Template
        </button>
        <div className="flex items-center space-x-2 border-l pl-4">
          <button
            onClick={() =>
              addElement("Text", {
                text: "Hello World",
                x: 50,
                y: 50,
                fontSize: 20,
                fill: "black",
              })
            }
            className="p-2 rounded hover:bg-gray-200"
          >
            <FaTextHeight title="Add Text" />
          </button>
          <button
            onClick={() => addElement("Table", {})}
            className="p-2 rounded hover:bg-gray-200"
          >
            <FaTable title="Add Advanced Table" />
          </button>
          <button
            onClick={() =>
              addElement("Image", {
                x: 50,
                y: 100,
                width: 100,
                height: 100,
                src: "https://placehold.co/100x100/EEE/31343C?text=Image",
              })
            }
            className="p-2 rounded hover:bg-gray-200"
          >
            <FaImage title="Add Image" />
          </button>
          <button
            onClick={() =>
              addElement("Shape", {
                shape: "rect",
                x: 50,
                y: 150,
                width: 100,
                height: 50,
                fill: "blue",
              })
            }
            className="p-2 rounded hover:bg-gray-200"
          >
            <FaSquare title="Add Shape" />
          </button>
          <button
            onClick={() =>
              addElement("Barcode", {
                x: 50,
                y: 250,
                text: "123456789",
                width: 150,
                height: 50,
              })
            }
            className="p-2 rounded hover:bg-gray-200"
          >
            <FaBarcode title="Add Barcode" />
          </button>
          <button
            onClick={() =>
              addElement("Shape", {
                shape: "line",
                x: 50,
                y: 220,
                width: 150,
                height: 5,
                stroke: "black",
                strokeWidth: 2,
              })
            }
            className="p-2 rounded hover:bg-gray-200"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 8H15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={() =>
              addElement("Table", {
                x: 50,
                y: 350,
                width: 400,
                height: 200,
                columns: [
                  { header: "Item", dataKey: "name" },
                  { header: "Price", dataKey: "price" },
                ],
              })
            }
            className="p-2 rounded hover:bg-gray-200"
          >
            <FaTable title="Add Standard Table" />
          </button>
          <button
            onClick={onOpenSettings}
            className="flex items-center px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm font-medium"
          >
            <FaCog className="mr-2" /> Page Settings
          </button>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={onOpenSchema}
          className="flex items-center px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm font-medium"
        >
          <FaDatabase className="mr-2" /> Data Schema
        </button>
        <button
          onClick={handleSave}
          className="flex items-center px-3 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
        >
          <FaSave className="mr-2" /> Save Template
        </button>

        <div className="relative">
          <button
            onClick={() => setExportOpen(!isExportOpen)}
            className="flex items-center px-3 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-sm font-medium"
          >
            Export
          </button>
          {isExportOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              <a
                onClick={() => exportEngine.exportToPdf(getTemplate(), data)}
                className="cursor-pointer flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FaFilePdf className="mr-2" /> PDF
              </a>
              <a
                onClick={handleDocxExport}
                // onClick={() => exportEngine.exportToDocx(getTemplate(), data)}
                className="cursor-pointer flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FaFileWord className="mr-2" /> Word (.docx)
              </a>
              <a
                onClick={() =>
                  exportEngine.exportToHtmlFile(getTemplate(), data)
                }
                className="cursor-pointer flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FaFileCode className="mr-2" /> HTML
              </a>
              <a
                onClick={() =>
                  exportEngine.exportToPrintView(getTemplate(), data)
                }
                className="cursor-pointer flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FaPrint className="mr-2" /> Print Preview
              </a>
              <a
                onClick={() =>
                  exportEngine.exportToPrinter(getTemplate(), data)
                }
                className="cursor-pointer flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FaPrint className="mr-2" /> Print Directly
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
