
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

function NodeInner({node, config, onSelectChild, onClickAddChild}) {
    return (
      <Card className="node">
        <CardTitle>{node.id}</CardTitle>
        <CardBody>
          <ListGroup>
            {node.children &&
              node.children.map(child => {
                return (
                  <ListGroupItem
                    key={node.id+'/'+child.id}
                    onClick={e => onSelectChild(node.id, child.id)}
                  >
                    <div>
                      <span className="text">{child.id}</span>
                      <Badge color="info">{child.type}</Badge>
                    </div>
                  </ListGroupItem>
                );
              })}
          </ListGroup>
          <Button
            color="success"
            onClick={e => onClickAddChild(node.id)}
            block
          >
            Add Job
          </Button>
        </CardBody>
      </Card>
    );
  };

  export default NodeInner