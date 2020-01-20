import React from "react";

import { Card,Badge,ListGroup } from "react-bootstrap";

function NodeInnerTemplate({ node, config, childDataSet, selectItem }) {
  
  return (
    <Card className="node">
      <Card.Title className="font-weight-bold">{node.id}</Card.Title>
      <Card.Body>
        <ChildNodes node={node} config={config} childDataSet={childDataSet} selectItem={selectItem} />
      </Card.Body>
    </Card>
  );
}

export function ChildNodes({ node, config, childDataSet, selectItem }) {
  return (
    <ListGroup>
      {Object.entries(childDataSet).map(([id, data]) => {
          return (
            <ListGroup.Item
              key={node.id + "/" + id}
              onClick={e => selectItem(id, "child")}
            >
              <div>
                <span className="text">{id}</span>
                <Badge variant="info">{data.type}</Badge>
              </div>
            </ListGroup.Item>
          );
        })}
    </ListGroup>
  );
}

export default NodeInnerTemplate;
