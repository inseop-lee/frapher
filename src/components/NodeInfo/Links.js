import React, { useState } from "react";
import { cloneDeep } from "lodash";
import { Button, ListGroup, Form, ButtonGroup } from "react-bootstrap";
import { Checkbox } from "semantic-ui-react";

function Links({
  nodeId,
  nodeData,
  branchCondition,
  editNextNode,
  nextId,
  onSubmit
}) {
  const conditionToText = condition => {
    const expMap = { eq: "=", ne: "≠", lt: "<", le: "≤", gt: ">", ge: "≥" };
    switch (condition.exp) {
      case "null":
        return (
          <>
            <em>{condition.key}</em> is null
          </>
        );
      case "notNull":
        return (
          <>
            <em>{condition.key}</em> is not null
          </>
        );
      case "in":
        return (
          <>
            <em>{condition.key}</em> in [{condition.value}]
          </>
        );
      default:
        return (
          <>
            <em>{condition.key}</em> {expMap[condition.exp]}
            <em>{condition.value}</em>
          </>
        );
    }
  };

  const nextItems = cloneDeep(nodeData.next);
  const tempEditMode = {};
  Object.values(nextItems).forEach(nodeId => (tempEditMode[nodeId] = false));
  const [editMode, setEditMode] = useState(tempEditMode);

  const isChecked = (bitStr, i) => bitStr[i] === "1";

  const original = nodeId =>
    Object.keys(nextItems).filter(function(key) {
      return nextItems[key] === nodeId;
    })[0];

  const handleSubmit = (e, nextId) => {
    e.preventDefault();
    const conditionStr = conditionInputRef[nextId].reduce(
      (acc, cur) => acc + (cur.current.checked ? "1" : "0"),
      ""
    );
    if (Object.keys(nextItems).find(str => str === conditionStr)) {
      if (original(nextId) !== conditionStr) {
        alert('The condition "' + conditionStr + '" already exists.');
        restoreEdit(nextId);
        return;
      }
    }
    editNextNode(nodeId, nextId, conditionStr);
    toggleEdit(nextId);
  };

  const restoreEdit = nextId => {
    conditionInputRef[nextId].forEach(
      (ref, index) => (ref.current.checked = isChecked(original(nextId), index))
    );
    toggleEdit(nextId);
  };

  const toggleEdit = nodeId => {
    const tempEditMode = cloneDeep(editMode);
    tempEditMode[nodeId] = !editMode[nodeId];
    setEditMode(tempEditMode);
  };

  const conditionInputRef = {};
  Object.values(nextItems).forEach(
    key =>
      (conditionInputRef[key] = Array.from(
        { length: branchCondition.length },
        x => React.createRef()
      ))
  );

  return (
    <ListGroup className="nextnode">
      {Object.entries(nextItems).map(([key, value], nextIndex) => (
        <ListGroup.Item key={`nextnode-item-${nextIndex}`}>
          <Form onSubmit={e => handleSubmit(e, value)}>
            <div className="nextnode-item">
              <h5>{value}</h5>
              <div className="nextnode-item-key">
                <div>
                  {branchCondition.length !== 0 && editMode[value] && (
                    <ButtonGroup>
                      <Button
                        variant="primary"
                        className="array-add-item"
                        size="sm"
                        type="submit"
                      >
                        Save
                      </Button>
                      <Button
                        variant="danger"
                        className="array-add-item"
                        size="sm"
                        onClick={e => restoreEdit(value)}
                      >
                        Cancel
                      </Button>
                    </ButtonGroup>
                  )}
                  {branchCondition.length !== 0 && !editMode[value] && (
                    <Button
                      variant="primary"
                      className="array-add-item"
                      size="sm"
                      onClick={e => toggleEdit(value)}
                    >
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            </div>
            {branchCondition.length !== 0 && (
              <div className="nextnode-branch">
                {branchCondition.map((item, branchIndex) => (
                  <Form.Check
                    custom
                    key={`checkbox-${key}-${branchIndex}`}
                    id={`checkbox-${key}-${branchIndex}`}
                    disabled={!editMode[value]}
                    defaultChecked={isChecked(key, branchIndex)}
                    ref={conditionInputRef[value][branchIndex]}
                    type="checkbox"
                    label={conditionToText(item)}
                  />
                ))}
              </div>
            )}
          </Form>
        </ListGroup.Item>
      ))}
      {Object.entries(nextItems).length === 0 && (
        <ListGroup.Item className="grey">
          Next Node does not exist.
        </ListGroup.Item>
      )}
    </ListGroup>
  );
}

export default Links;
