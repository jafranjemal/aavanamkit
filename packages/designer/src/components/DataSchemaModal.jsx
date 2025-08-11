import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { useDesigner, ActionTypes } from "../context/DesignerContext";
import JSON5 from "json5";
const DataSchemaModal = ({ isOpen, onClose }) => {
  const { state, dispatch } = useDesigner();
  // Use a local state to edit the schema before saving

  const [schemaText, setSchemaText] = useState(
    typeof state.dataSchema === "string"
      ? state.dataSchema
      : JSON.stringify(state.dataSchema, null, 2)
  );

   const handleFormat = () => {
    try {
      // Parse the (potentially messy) text using JSON5
      const parsedSchema = JSON5.parse(schemaText);
      // Re-serialize it with standard JSON formatting (2-space indent)
      const formattedSchema = JSON.stringify(parsedSchema, null, 2);
      setSchemaText(formattedSchema);
    } catch (error) {
      alert('Invalid JSON format. Cannot prettify.');
    }
  };


  useEffect(() => {
    const schema =  typeof state.dataSchema === "string"
      ? state.dataSchema
      : JSON.stringify(state.dataSchema, null, 2)

    setSchemaText( schema);
  }, [state.dataSchema]);

  const handleSave = () => {
    try {
      // 1. Extract only the first {...} block (strip any trailing junk)
      const match = schemaText.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("No JSON object found.");
      const jsonPortion = match[0];

      // 2. Parse using JSON5 (allows unquoted keys, single-quotes, trailing commas, etc.)
      const parsed = JSON5.parse(jsonPortion);

      // 3. Re-stringify to strict JSON for display and storage
      const pretty = JSON.stringify(parsed, null, 2);
      setSchemaText(pretty);

      // 4. Dispatch the clean object
      dispatch({
        type: ActionTypes.SET_DATA_SCHEMA,
        payload: parsed,
      });

      onClose();
    } catch (err) {
      console.error(err);
      alert("Invalid schema. Make sure you enter a valid object literal.");
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Define Data Schema">
      <p className="ak:text-sm ak:text-gray-600 ak:mb-4">
        Define the JSON structure for your invoice data. Use this schema to bind
        elements in the designer. For example:&nbsp;
        <code>{`{ customerName: "John Doe", items: [{ name: "Item 1", price: 10 }] }`}</code>
      </p>
 
      <textarea
        className="ak:w-full ak:h-80 ak:p-2 ak:border ak:rounded ak:font-mono ak:text-sm"
        value={schemaText}
        onChange={(e) => setSchemaText(e.target.value)}
      />
      <div className="ak:flex ak:gap-2 ak:justify-end ak:mt-4">

           <button 
          onClick={handleFormat} 
          className="ak:px-6 ak:py-2 ak:bg-green-600 ak:text-white ak:rounded ak:hover:bg-green-700"

        >
          Prettify JSON
        </button>

        <button
          onClick={handleSave}
          className="ak:px-6 ak:py-2 ak:bg-blue-600 ak:text-white ak:rounded ak:hover:bg-blue-700"
        >
          Save Schema
        </button>
      </div>
    </Modal>
  );
};

export default DataSchemaModal;
