import React from "react";
import { Accordion, Card, Button } from "react-bootstrap";
import Form from "react-jsonschema-form";
import ArrayFieldTemplate from "./ArrayFieldTemplate";
import ObjectFieldTemplate from "./ObjectFieldTemplate";
import AdditionalPropertiesTemplate from "./AdditionalPropertiesTemplate";
import NestedAdditionalPropertiesTemplate from "./NestedAdditionalPropertiesTemplate";
import { TextTemplate, SelectTemplate } from "./InputTemplate";
import ChildTypeBadge from "../Common/ChildTypeBadge";
const uiSchema = {
  type: {
    "ui:widget": "hidden"
  },
  message: {
    param: {
      additionalProperties: {
        "ui:FieldTemplate": AdditionalPropertiesTemplate
      }
    },
    items: {
      param: {
        additionalProperties: {
          "ui:FieldTemplate": AdditionalPropertiesTemplate
        }
      }
    }
  },
  feedback_list: {
    additionalProperties: {
      "ui:FieldTemplate": NestedAdditionalPropertiesTemplate,
      message: {
        items: {
          param: {
            additionalProperties: {
              "ui:FieldTemplate": AdditionalPropertiesTemplate
            }
          }
        }
      }
    }
  },
  info: {
    params: {
      additionalProperties: {
        "ui:FieldTemplate": AdditionalPropertiesTemplate
      }
    },
    parameters: {
      additionalProperties: {
        "ui:FieldTemplate": AdditionalPropertiesTemplate
      }
    },
    url: {
      parameter: {
        additionalProperties: {
          "ui:FieldTemplate": AdditionalPropertiesTemplate
        }
      }
    }
  }
};

function ChildCard({
  parentId,
  id,
  data,
  schema,
  onSubmit,
  index,
  onSelect,
  isSelected,
  onDelete,
  isNew
}) {
  return (
    <Card key={parentId + "/" + id} className={isNew ? "add-child-card" : ""}>
      <Accordion.Toggle
        as={Card.Header}
        eventKey={index}
        onClick={e => onSelect(e, index)}
      >
        <h5 className="text">{id}</h5>
        <ChildTypeBadge type={data.type} />
      </Accordion.Toggle>
      <Accordion.Collapse eventKey={index}>
        <div className="schema-form">
          {isSelected && (
            <Form
              schema={schema}
              onSubmit={e => onSubmit(e, id)}
              formData={data}
              uiSchema={uiSchema}
              widgets={{
                TextWidget: TextTemplate,
                SelectWidget: SelectTemplate
              }}
              ArrayFieldTemplate={ArrayFieldTemplate}
              ObjectFieldTemplate={ObjectFieldTemplate}
            >
              <div className="schema-form-buttons">
                <Button variant="primary" type="submit">
                  Submit
                </Button>
                {onDelete && (
                  <Button variant="danger" onClick={e => onDelete(e, id)}>
                    {isNew ? "Cancel" : "Delete"}
                  </Button>
                )}
              </div>
            </Form>
          )}
        </div>
      </Accordion.Collapse>
    </Card>
  );
}

export default ChildCard;
