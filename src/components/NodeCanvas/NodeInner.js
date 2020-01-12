
import React from "react";

import {
  Card,
  CardTitle,
  CardBody,
  Badge,
  Button,
  ListGroup,
  ListGroupItem
} from "reactstrap";

function NodeInner({ node, config, selectItem }) {
  return (
    <Card className="node">
      <CardTitle className="font-weight-bold">{node.id}</CardTitle>
      <CardBody>
        <ChildNodes 
          node={node}
          config={config}
          selectItem={selectItem}
        />
      </CardBody>
    </Card>
  );
};

export function ChildNodes({ node, config, selectItem }) {
  return (
    <ListGroup>
      {node.children &&
        node.children.map(child => {
          return (
            <ListGroupItem
              key={node.id + '/' + child.id}
              onClick={e => selectItem(child.id, "child")}
            >
              <div>
                <span className="text">{child.id}</span>
                <Badge color="info">{child.type}</Badge>
              </div>
            </ListGroupItem>
          );
        })}
    </ListGroup>
  )
}


export default NodeInner;