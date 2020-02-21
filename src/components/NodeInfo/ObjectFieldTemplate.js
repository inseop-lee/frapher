import React from "react";

import { Button } from "react-bootstrap";
import { JobType, ActionType } from "../../container/constants";
import { MdAdd } from "react-icons/md";

function ObjectFieldTemplate({
  TitleField,
  properties,
  title,
  description,
  schema,
  onAddClick,
  formContext,
  uiSchema
}) {
  const isNestedAdditionalProperties = () => {
    if (uiSchema["ui:FieldTemplate"]) {
      return (
        uiSchema["ui:FieldTemplate"].name ===
        "NestedAdditionalPropertiesTemplate"
      );
    }
    return false;
  };
  const hasTitle = () => {
    if (
      Object.values(JobType)
        .concat(Object.values(ActionType))
        .find(element => element === title)
    ) {
      return false;
    }
    return isNestedAdditionalProperties() ? false : true;
  };
  return (
    <div className="object-container">
      {hasTitle() && (
        <div className="object-header">
          <TitleField title={title} />
          {schema.additionalProperties && (
            <Button
              onClick={onAddClick(schema)}
              variant="outline-success"
              className="object-add-item"
              size="sm"
            >
              <MdAdd />
            </Button>
          )}
        </div>
      )}
      <div className={schema.title === "Info" ? "info-container" : ""}>
        {properties.map(prop => {
          return <div key={prop.content.key}>{prop.content}</div>;
        })}
      </div>
    </div>
  );
}

export default ObjectFieldTemplate;
