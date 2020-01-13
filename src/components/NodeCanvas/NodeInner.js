import React from "react";

import {
  Card,
  Badge,
  ListGroup
} from "react-bootstrap";

function NodeInner({ node, config, selectItem }) {
  return (
    <Card className="node">
      <Card.Title className="font-weight-bold">{node.id}</Card.Title>
      <Card.Body>
        <ChildNodes node={node} config={config} selectItem={selectItem} />
      </Card.Body>
    </Card>
  );
}

export function ChildNodes({ node, config, selectItem }) {
  return (
    <ListGroup>
      {node.children &&
        node.children.map(child => {
          return (
            <ListGroup.Item
              key={node.id + "/" + child.id}
              onClick={e => selectItem(child.id, "child")}
            >
              <div>
                <span className="text">{child.id}</span>
                <Badge variant="info">{child.data.type}</Badge>
              </div>
            </ListGroup.Item>
          );
        })}
    </ListGroup>
  );
}

export default NodeInner;
