import React, { useState } from "react";
import { cloneDeep, flatten } from "lodash";
import {
  Button,
  Form,
  ButtonGroup,
  Accordion,
  Card,
  Badge
} from "react-bootstrap";

function Links({
  nodeId,
  nodeData,
  branchCondition,
  editNextNode,
  addNextNode,
  deleteNextBranch
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
            <em>{condition.key}</em> {expMap[condition.exp]} {condition.value}
          </>
        );
    }
  };

  const [editableBranchId, setEditableBranchId] = useState(null);
  const [selectedNext, setSelectedNext] = useState(-1);
  const [addBranch, setAddBranch] = useState(false);

  const getBranchId = (nodeId, condition) => `${nodeId}-${condition}`;
  const conditionInputRef = {};
  const convertNext = Object.entries(cloneDeep(nodeData.next)).reduce(
    (acc, [condition, nodeId]) => {
      acc[nodeId] = acc[nodeId] ? acc[nodeId] : [];
      acc[nodeId].push(condition);
      acc[nodeId].sort((a, b) => (a < b ? 1 : -1));
      return acc;
    },
    {}
  );
  Object.entries(convertNext).forEach(([nodeId, conditionList]) => {
    conditionList.forEach(
      condition =>
        (conditionInputRef[getBranchId(nodeId, condition)] = Array.from(
          { length: branchCondition.length },
          x => React.createRef()
        ))
    );
  });

  const addBranchRef = {};

  Object.keys(convertNext).forEach(nodeId => {
    addBranchRef[nodeId] = Array.from({ length: branchCondition.length }, x =>
      React.createRef()
    );
  });

  const isChecked = (bitStr, i) => bitStr[i] === "1";

  const original = branchId => branchId.split("-")[1];

  const handleSubmit = (e, branchId) => {
    const nextId = branchId.split("-")[0];
    const conditionStr = conditionInputRef[branchId].reduce(
      (acc, cur) => acc + (cur.current.checked ? "1" : "0"),
      ""
    );

    console.log(branchId, conditionStr);

    if (hasDuplicateCondition(conditionStr)) {
      if (original(branchId) !== conditionStr) {
        alert('The condition "' + conditionStr + '" already exists.');
        restoreEdit(branchId);
        return;
      }
    }
    setEditableBranchId(null);
    editNextNode(nodeId, nextId, original(branchId), conditionStr);
  };

  const handleDelete = (e, branchId) => {
    deleteNextBranch(nodeId, original(branchId));
  };
  const hasDuplicateCondition = conditionStr =>
    flatten(Object.values(convertNext)).find(str => str === conditionStr);

  const restoreEdit = branchId => {
    conditionInputRef[branchId].forEach(
      (ref, index) =>
        (ref.current.checked = isChecked(original(branchId), index))
    );
    toggleEdit(branchId);
  };

  const toggleEdit = branchId => {
    setEditableBranchId(editableBranchId === branchId ? null : branchId);
  };

  const handleAddBranch = e => {
    setAddBranch(true);
  };

  const handleCancelAddBranch = e => {
    setAddBranch(false);
  };

  const handleSubmitAddBranch = (e, nextId) => {
    e.preventDefault();
    setAddBranch(false);

    const conditionStr = addBranchRef[nextId].reduce((acc, cur) => {
      console.log(cur, cur.current);
      return acc + (cur.current.checked ? "1" : "0");
    }, "");
    console.log(nextId, conditionStr);
    if (hasDuplicateCondition(conditionStr)) {
      alert('The condition "' + conditionStr + '" already exists.');
      return;
    }
    addNextNode(nodeId, nextId, conditionStr);
  };

  const handleSelectNext = (e, eventKey) => {
    setSelectedNext(selectedNext !== eventKey ? eventKey : -1);
    setAddBranch(false);
  };

  return (
    <div className="nextnode">
      <Accordion activeKey={selectedNext}>
        {Object.entries(convertNext)
          .sort(([a, aC], [b, bC]) => (a > b ? 1 : -1))
          .map(([nextNodeId, conditionList], nextIndex) => (
            <Card key={`nextnode-item-${nextIndex}`}>
              <Accordion.Toggle
                as={Card.Header}
                className={conditionList[0] === "default" && "no-cursor"}
                eventKey={conditionList[0] !== "default" ? nextIndex : null}
                onClick={e =>
                  handleSelectNext(
                    e,
                    conditionList[0] !== "default" ? nextIndex : null
                  )
                }
              >
                <h5>{nextNodeId}</h5>
                <div>
                  {conditionList.map(condition => (
                    <Badge
                      key={`badge-${nextNodeId}-${condition}`}
                      variant="dark"
                    >
                      {condition}
                    </Badge>
                  ))}
                </div>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey={nextIndex}>
                <Card.Body className="nextnode-branch">
                  {conditionList.map((condition, branchIndex) => {
                    const branchId = getBranchId(nextNodeId, condition);
                    return (
                      <div
                        className="nextnode-branch-item"
                        key={`branch-${branchId}`}
                      >
                        <div className="nextnode-checkbox">
                          {branchCondition.map((item, branchIndex) => (
                            <Form.Check
                              custom
                              key={`checkbox-${branchId}-${branchIndex}`}
                              id={`checkbox-${branchId}-${branchIndex}`}
                              ref={conditionInputRef[branchId][branchIndex]}
                              disabled={editableBranchId !== branchId}
                              defaultChecked={isChecked(condition, branchIndex)}
                              type="checkbox"
                              label={conditionToText(item)}
                            />
                          ))}
                        </div>
                        <div className="nextnode-buttons">
                          {branchCondition.length !== 0 &&
                            editableBranchId === branchId && (
                              <ButtonGroup vertical>
                                <Button
                                  variant="primary"
                                  className="array-add-item"
                                  size="sm"
                                  onClick={e => handleSubmit(e, branchId)}
                                >
                                  Save
                                </Button>
                                {conditionList.length > 1 && (
                                  <Button
                                    variant="danger"
                                    className="array-add-item"
                                    size="sm"
                                    onClick={e => handleDelete(e, branchId)}
                                  >
                                    Delete
                                  </Button>
                                )}
                                <Button
                                  variant="secondary"
                                  className="array-add-item"
                                  size="sm"
                                  onClick={e => restoreEdit(branchId)}
                                >
                                  Cancel
                                </Button>
                              </ButtonGroup>
                            )}
                          {branchCondition.length !== 0 &&
                            editableBranchId !== branchId && (
                              <Button
                                variant="primary"
                                className="array-add-item"
                                size="sm"
                                onClick={e => toggleEdit(branchId)}
                              >
                                Edit
                              </Button>
                            )}
                        </div>
                      </div>
                    );
                  })}
                  {addBranch ? (
                    <div className="nextnode-branch-item">
                      <div className="nextnode-checkbox">
                        {branchCondition.map((item, branchIndex) => (
                          <Form.Check
                            custom
                            key={`checkbox-add-${nextNodeId}-${branchIndex}`}
                            id={`checkbox-add-${nextNodeId}-${branchIndex}`}
                            ref={addBranchRef[nextNodeId][branchIndex]}
                            type="checkbox"
                            label={conditionToText(item)}
                          />
                        ))}
                      </div>
                      <div className="nextnode-buttons">
                        <ButtonGroup vertical>
                          <Button
                            variant="primary"
                            className="array-add-item"
                            size="sm"
                            onClick={e => handleSubmitAddBranch(e, nextNodeId)}
                          >
                            Save
                          </Button>
                          <Button
                            variant="danger"
                            className="array-add-item"
                            size="sm"
                            onClick={handleCancelAddBranch}
                          >
                            Cancel
                          </Button>
                        </ButtonGroup>
                      </div>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="success"
                      block
                      onClick={handleAddBranch}
                    >
                      Add
                    </Button>
                  )}
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          ))}
      </Accordion>
    </div>
  );
}

export default Links;
