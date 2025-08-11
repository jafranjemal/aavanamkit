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
    <div className="ak:mt-4 ak:pt-4 ak:border-t">
      <h3 className="ak:text-md ak:font-medium ak:text-gray-800 ak:mb-2 ak:border-b">
        Conditional Rendering
      </h3>
      <p className="ak:text-xs ak:text-gray-500 ak:mb-2">Show this element if...</p>
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
