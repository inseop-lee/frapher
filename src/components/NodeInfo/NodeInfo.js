import React, {useState} from "react";
import "./NodeInfo.css";
import { Accordion, Badge, Card } from "react-bootstrap";
import { useAccordionToggle } from "react-bootstrap/AccordionToggle";

import Form from "react-jsonschema-form";
import schema_dict from "../../schema";

function CustomToggle({ child, eventKey, changeEvent }) {
  const decoratedOnClick = useAccordionToggle(eventKey, () =>
    changeEvent(eventKey)
  );

  return (
    <Card.Header onClick={decoratedOnClick}>
      <span className="text">{child.id}</span>
      <Badge variant="info">{child.data.type}</Badge>
    </Card.Header>
  );
}

function NodeInfo({ nodes, selected, selectItem, editChildNode }) {
  const node = nodes[selected.id];

  const [event,setEvent] = useState(0)

  const onSubmit = ({ formData }, parentId, id) => {
    console.log("Data submitted: ", formData);
    editChildNode(parentId, id, formData);
  };

  const changeEvent = (eventKey) => {
    setEvent(eventKey)
  }

  return (
    <div className="nodeInfo">
      <div className="header">
        <h3>{node.id}</h3>
      </div>
      <div className="childList">
        <Accordion defaultActiveKey="0">
          {node.children &&
            node.children.map((child, i) => {
              return (
                <Card key={node.id + "/" + child.id}>
                  <CustomToggle child={child} eventKey={i} changeEvent={changeEvent}/>
                  <Accordion.Collapse eventKey={i}>
                    <div className="schema_form">
                    {event===i && 
                      <Form
                        schema={schema_dict[child.data.type]}
                        onSubmit={e => onSubmit(e, node.id, child.id)}
                        formData={child.data}
                      />
                    }
                    </div>
                  </Accordion.Collapse>
                </Card>
              );
            })}
        </Accordion>
      </div>
    </div>
  );
}

export default NodeInfo;
