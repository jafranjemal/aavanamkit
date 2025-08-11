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
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { exportToPdf } from "../lib/pdfExporter"; // Import the exporter
import { FaFileWord, FaFileCode, FaPrint } from "react-icons/fa";
import * as exportEngine from "../lib/exportEngine"; // Import all exports
import { ThemeSwitcher } from "./ThemeSwitcher";
const Toolbar = ({
  onOpenSchema,
  data,
  onOpenSettings,
  onOpenGallery,
  onSave,
}) => {
  const { state, dispatch } = useDesigner();
  const [isExportOpen, setExportOpen] = useState(false);

    const toggleTheme = () => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    dispatch({
      type: ActionTypes.SET_THEME,
      payload: { theme: newTheme },
    });
  };

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
      onSave({template, dataSchema: state.dataSchema});
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
    <div className="ak:text-black ak:bg-white ak:shadow-md ak:p-2 ak:flex ak:items-center ak:justify-between">
      <div className="ak:flex ak:items-center ak:space-x-4">
        <h1 className="ak:text-lg ak:font-bold">AavanamKit</h1>
        <button
          onClick={onOpenGallery}
          className="ak:flex ak:items-center ak:px-3 ak:py-2 ak:rounded ak:bg-green-600 ak:hover:bg-green-700 ak:text-white ak:text-sm ak:font-medium"
        >
          <FaPlusSquare className="ak:mr-2" /> New from Template
        </button>
        <div className="ak:flex ak:items-center ak:space-x-2 ak:border-l ak:pl-4">
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
            className="ak:p-2 ak:rounded ak:hover:bg-gray-200"
          >
            <FaTextHeight title="Add Text" />
          </button>
          <button
            onClick={() => addElement("Table", {})}
            className="ak:p-2 ak:rounded ak:hover:bg-gray-200"
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
            className="ak:p-2 ak:rounded ak:hover:bg-gray-200"
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
            className="ak:p-2 ak:rounded ak:hover:bg-gray-200"
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
            className="ak:p-2 ak:rounded ak:hover:bg-gray-200"
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
            className="ak:p-2 ak:rounded ak:hover:bg-gray-200"
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
            className="ak:p-2 ak:rounded ak:hover:bg-gray-200"
          >
            <FaTable title="Add Standard Table" />
          </button>
          <button
            onClick={onOpenSettings}
            className="ak:flex ak:items-center ak:px-3 ak:py-2 ak:rounded ak:bg-gray-200 ak:hover:bg-gray-300 ak:text-sm ak:font-medium"
          >
            <FaCog className="ak:mr-2" /> Page Settings
          </button>
        </div>
      </div>
      <div className="ak:flex ak:items-center ak:space-x-2">

            {/* <button
          onClick={toggleTheme}
          className="ak-p-2 ak-rounded-full hover:ak-bg-gray-200 dark:hover:ak-bg-gray-700 ak-text-gray-600 dark:ak-text-gray-300"
          title="Toggle Theme"
        >
          {state.theme === 'light' ? <FaMoon /> : <FaSun />}
        </button> */}
        <button
          onClick={onOpenSchema}
          className="ak:flex ak:items-center ak:px-3 ak:py-2 ak:rounded ak:bg-gray-200 ak:hover:bg-gray-300 ak:text-sm ak:font-medium"
        >
          <FaDatabase className="ak:mr-2" /> Data Schema
        </button>
        <button
          onClick={handleSave}
          className="ak:flex ak:items-center ak:px-3 ak:py-2 ak:rounded ak:bg-blue-600 ak:hover:bg-blue-700 ak:text-white ak:text-sm ak:font-medium"
        >
          <FaSave className="ak:mr-2" /> Save Template
        </button>

        <div className="ak:relative">

            {/* <ThemeSwitcher /> */}
          <button
            onClick={() => setExportOpen(!isExportOpen)}
            className="ak:flex ak:items-center ak:px-3 ak:py-2 ak:rounded ak:bg-red-600 ak:hover:bg-red-700 ak:text-white ak:text-sm ak:font-medium"
          >
            Export
          </button>
          {isExportOpen && (
            <div className="ak:absolute ak:right-0 ak:mt-2 ak:w-48 ak:bg-white ak:rounded-md ak:shadow-lg ak:z-10">
              <a
                onClick={() => exportEngine.exportToPdf(getTemplate(), data)}
                className="ak:cursor-pointer ak:flex ak:items-center ak:px-4 ak:py-2 ak:text-sm ak:text-gray-700 ak:hover:bg-gray-100"
              >
                <FaFilePdf className="ak:mr-2" /> PDF
              </a>
              <a
                onClick={handleDocxExport}
                // onClick={() => exportEngine.exportToDocx(getTemplate(), data)}
                className="ak:cursor-pointer ak:flex ak:items-center ak:px-4 ak:py-2 ak:text-sm ak:text-gray-700 ak:hover:bg-gray-100"
              >
                <FaFileWord className="ak:mr-2" /> Word (.docx)
              </a>
              <a
                onClick={() =>
                  exportEngine.exportToHtmlFile(getTemplate(), data)
                }
                className="ak:cursor-pointer ak:flex ak:items-center ak:px-4 ak:py-2 ak:text-sm ak:text-gray-700 ak:hover:bg-gray-100"
              >
                <FaFileCode className="ak:mr-2" /> HTML
              </a>
              <a
                onClick={() =>
                  exportEngine.exportToPrintView(getTemplate(), data)
                }
                className="ak:cursor-pointer ak:flex ak:items-center ak:px-4 ak:py-2 ak:text-sm ak:text-gray-700 ak:hover:bg-gray-100"
              >
                <FaPrint className="ak:mr-2" /> Print Preview
              </a>
              <a
                onClick={() =>
                  exportEngine.exportToPrinter(getTemplate(), data)
                }
                className="ak:cursor-pointer ak:flex ak:items-center ak:px-4 ak:py-2 ak:text-sm ak:text-gray-700 ak:hover:bg-gray-100"
              >
                <FaPrint className="ak:mr-2" /> Print Directly
              </a>

         
            </div>

            
          )}

               
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
