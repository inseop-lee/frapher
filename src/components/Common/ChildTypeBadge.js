import React from "react";

import { Badge } from "react-bootstrap";
import { ActionType } from "../../container/constants";

function ChildTypeBadge({ type }) {
  const variant = Object.values(ActionType).find(item => item === type)
    ? "success"
    : "info";
  return <Badge variant={variant}> {type} </Badge>;
}

export default ChildTypeBadge;
