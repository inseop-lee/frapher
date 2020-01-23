import React from "react";

import { MdAdd,MdClose } from "react-icons/md";
import { Button, ListGroup } from "react-bootstrap";

function ArrayFieldTemplate({ title, items, canAdd, onAddClick }) {
  return (
    <div className="array-container">
      <div className="array-header">
        <h5>{title}</h5>
        {canAdd && (
          <Button
            variant="outline-success"
            className="array-add-item"
            size="sm"
            onClick={onAddClick}
          >
            <MdAdd/>
          </Button>
        )}
      </div>

      <ListGroup>
        {items.map((element, index) => (
          <ListGroup.Item key={element.key} className={element.className}>
            <div className="array-title">
                <h6>{title} #{index+1}</h6>
                <Button
                  onClick={element.onDropIndexClick(element.index)}
                  variant="outline-danger"
                  size="sm"
                >
                  <MdClose/>
                </Button>
            </div>

            <div>{element.children}</div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export default ArrayFieldTemplate;
