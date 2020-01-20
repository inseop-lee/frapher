
import React, { useState } from "react";
import { Accordion, Badge, Card } from "react-bootstrap";
import Form from "react-jsonschema-form";
import { useAccordionToggle } from "react-bootstrap/AccordionToggle";

import ArrayFieldTemplate from "./ArrayFieldTemplate";
import ObjectFieldTemplate from "./ObjectFieldTemplate";
import AdditionalPropertiesTemplate from "./AdditionalPropertiesTemplate";
import {TextTemplate,SelectTemplate} from "./InputTemplate";

import job from "../../container/schema";

function AccordionItem({ id, type, eventKey, changeEvent }) {
    const decoratedOnClick = useAccordionToggle(eventKey, () =>
      changeEvent(eventKey)
    );
  
    return (
      <Card.Header onClick={decoratedOnClick}>
        <h5 className="text">{id}</h5>
        <Badge variant="info">{type}</Badge>
      </Card.Header>
    );
  }

  const uiSchema = {
    oneOf: {
      "ui:options" :{
        title:false
      }
    },
    type: {
      "ui:widget": "hidden"
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


function ChildCard({ parentId, id, data, onSubmit, index }) {
    const [event, setEvent] = useState(0);
    const changeEvent = eventKey => {
        setEvent(eventKey);
      };
    
    return (
                <Card key={parentId + "/" + id}>
                <AccordionItem
                  id={id}
                  type={data.type}
                  eventKey={index}
                  changeEvent={changeEvent}
                />
                <Accordion.Collapse eventKey={index}>
                  <div className="schema_form">
                    {event === index && (
                      <Form
                        schema={job}
                        onSubmit={e => onSubmit(e, id)}
                        formData={data}
                        uiSchema={uiSchema}
                        widgets={{TextWidget:TextTemplate,SelectWidget:SelectTemplate}}
                        ArrayFieldTemplate={ArrayFieldTemplate}
                        ObjectFieldTemplate={ObjectFieldTemplate}
                      />
                    )}
                  </div>
                </Accordion.Collapse>
              </Card>
    );
}

export default ChildCard;