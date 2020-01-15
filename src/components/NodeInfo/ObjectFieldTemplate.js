import React from "react";

import Octicon, { iconsByName } from "@primer/octicons-react";
import { Button } from "react-bootstrap";

function ObjectFieldTemplate({
  TitleField,
  properties,
  title,
  description,
  schema,
  onAddClick,
  formContext
}) {
  return (
    <div className="object-container">
      <div className="object-header">
        <TitleField title={title} />
        {schema.additionalProperties && (
          <Button
            onClick={onAddClick(schema)}
            variant="success"
            className="object-add-item"
            size="sm"
          >
            <Octicon icon={iconsByName["plus"]} />
          </Button>
        )}
      </div>
      <div>
        {properties.map(prop => (
          <div key={prop.content.key}>{prop.content}</div>
        ))}
      </div>
    </div>
  );
}

export default ObjectFieldTemplate;
