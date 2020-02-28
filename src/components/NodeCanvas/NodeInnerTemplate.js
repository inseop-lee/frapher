import React from "react";

import { Card, ListGroup, Button, ButtonGroup } from "react-bootstrap";
import ChildTypeBadge from "../Common/ChildTypeBadge";

function NodeInnerTemplate({
  node,
  childDataSet,
  selected,
  onClickEditId,
  onClickDelete
}) {
  const isFinal = !node.ports.out;
  return (
    <>
      {selected && (
        <div className="node-inner-popup">
          <ButtonGroup className="d-flex">
            <Button size="sm" onClick={onClickEditId}>
              Edit ID
            </Button>
            <Button size="sm" variant="danger" onClick={onClickDelete}>
              Delete
            </Button>
          </ButtonGroup>
        </div>
      )}
      {isFinal ? (
        <FinalNode
          node={node}
          childDataSet={childDataSet}
          selected={selected}
        />
      ) : (
        <ProcessorNode
          node={node}
          childDataSet={childDataSet}
          selected={selected}
        />
      )}
    </>
  );
}

function FinalNode({ node, childDataSet }) {
  return (
    <Card bg="light" className="node">
      <Card.Body>
        <div>
          {/* <div className="node-inner-justify"> */}
          <h5>{node.id}</h5>
          {childDataSet &&
            Object.entries(childDataSet).map(([id, data], index) => (
              <ChildTypeBadge type={data.type} key={`final-badge-${index}`} />
            ))}
        </div>
      </Card.Body>
    </Card>
  );
}

function ProcessorNode({ node, childDataSet }) {
  return (
    <Card className="node">
      <Card.Title className="font-weight-bold">{node.id}</Card.Title>
      <Card.Body>
        <ListGroup>
          {Object.entries(childDataSet).map(([id, data]) => (
            <ListGroup.Item variant="light" key={node.id + "/" + id}>
              <div className="node-inner-justify">
                <span className="text">{id}</span>
                <ChildTypeBadge type={data.type} />
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
}

export default NodeInnerTemplate;
