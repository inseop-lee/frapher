import React from "react";

import { Button } from "react-bootstrap";
import {JobType} from "../../container/utils"
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
  return (
    <div className="object-container">
    {!Object.values(JobType).find(element => element === title) &&
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
        }
      <div>
        {properties.map(prop => { 
          return (
          <div key={prop.content.key}>{prop.content}</div>
        )}
        )}
      </div>
    </div>
  );
}

export default ObjectFieldTemplate;
