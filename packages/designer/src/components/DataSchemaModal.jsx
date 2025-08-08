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

  useEffect(() => {
    setSchemaText(state.dataSchema);
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
      <p className="text-sm text-gray-600 mb-4">
        Define the JSON structure for your invoice data. Use this schema to bind
        elements in the designer. For example:&nbsp;
        <code>{`{ customerName: "John Doe", items: [{ name: "Item 1", price: 10 }] }`}</code>
      </p>

      <textarea
        className="w-full h-80 p-2 border rounded font-mono text-sm"
        value={schemaText}
        onChange={(e) => setSchemaText(e.target.value)}
      />
      <div className="flex justify-end mt-4">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save Schema
        </button>
      </div>
    </Modal>
  );
};

export default DataSchemaModal;
