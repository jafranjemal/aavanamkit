import React from "react";
import { useDesigner, ActionTypes } from "../../context/DesignerContext";
import PropertyInput from "./PropertyInput";
import PropertySelect from "./PropertySelect";

const ConditionalRendering = ({ element }) => {
  const { dispatch } = useDesigner();
  const { conditional } = element;

  const updateConditional = (key, value) => {
    const newConditional = { ...(conditional || {}), [key]: value };
    // If a field is cleared, remove the conditional logic
    if (!newConditional.field) {
      dispatch({
        type: ActionTypes.UPDATE_ELEMENT_CONDITIONAL,
        payload: { elementId: element.id, conditional: null },
      });
    } else {
      dispatch({
        type: ActionTypes.UPDATE_ELEMENT_CONDITIONAL,
        payload: { elementId: element.id, conditional: newConditional },
      });
    }
  };

  return (
    <div className="mt-4 pt-4 border-t">
      <h3 className="text-md font-medium text-gray-800 mb-2 border-b">
        Conditional Rendering
      </h3>
      <p className="text-xs text-gray-500 mb-2">Show this element if...</p>
      <PropertyInput
        label="Data Field"
        placeholder="e.g., discount"
        value={conditional?.field}
        onChange={(e) => updateConditional("field", e.target.value)}
      />
      <PropertySelect
        label="Operator"
        value={conditional?.operator}
        onChange={(e) => updateConditional("operator", e.target.value)}
        options={[
          { value: "exists", label: "Exists" },
          { value: "notExists", label: "Does Not Exist" },
          { value: "==", label: "Equals (==)" },
          { value: "!=", label: "Not Equals (!=)" },
          { value: ">", label: "Greater Than (>)" },
          { value: "<", label: "Less Than (<)" },
        ]}
      />
      <PropertyInput
        label="Value"
        placeholder="e.g., 0"
        value={conditional?.value}
        onChange={(e) => updateConditional("value", e.target.value)}
      />
    </div>
  );
};

export default ConditionalRendering;
