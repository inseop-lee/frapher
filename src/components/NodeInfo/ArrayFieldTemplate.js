import React from "react";

import Octicon, { iconsByName } from "@primer/octicons-react";
import { Button, ButtonGroup, ListGroup } from "react-bootstrap";

function ArrayFieldTemplate({ title, items, canAdd, onAddClick }) {
  return (
    <div className="array-container">
      <div className="array-header">
        <h5>{title}</h5>
        {canAdd && (
          <Button
            variant="success"
            className="array-add-item"
            size="sm"
            onClick={onAddClick}
          >
            <Octicon icon={iconsByName["plus"]} />
          </Button>
        )}
      </div>

      <ListGroup>
        {items.map((element, index) => (
          <ListGroup.Item key={element.key} className={element.className}>
            <div className="array-title">
                <h6>{title} #{index+1}</h6>
                <ButtonGroup size="sm" className="">
                  <Button
                    variant="light"
                    disabled={!element.hasMoveUp}
                    onClick={element.onReorderClick(
                      element.index,
                      element.index - 1
                    )}
                  >
                    <Octicon icon={iconsByName["arrow-up"]} />
                  </Button>
                  <Button
                    variant="light"
                    disabled={!element.hasMoveDown}
                    onClick={element.onReorderClick(
                      element.index,
                      element.index + 1
                    )}
                  >
                    <Octicon icon={iconsByName["arrow-down"]} />
                  </Button>
                  <Button
                    onClick={element.onDropIndexClick(element.index)}
                    variant="danger"
                  >
                    <Octicon icon={iconsByName["x"]} />
                  </Button>
                </ButtonGroup>
            </div>

            <div>{element.children}</div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export default ArrayFieldTemplate;
