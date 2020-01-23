import React, { useState } from "react";
import "./NodeInfo.css";
import {Accordion,Modal,Table,OverlayTrigger,Tooltip,Button,Form,ListGroup} from "react-bootstrap";
import ChildCard from "./ChildCard";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actionCreators as nodeItemActions } from "../../store/modules/nodeItem";
import { getBranchCondition } from "../../container/utils";
import { MdSave, MdEdit } from "react-icons/md";

function AlertModal({ isOpen, onClose, title, content }) {
  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{content}</Modal.Body>
    </Modal>
  );
}

function Links({ nodeId, nodeData, branchCondition, onToggle }) {
  const conditionToText = condition => {
    const expMap = { eq: "=", ne: "≠", lt: "<", le: "≤", gt: ">", ge: "≥" };
    switch (condition.exp) {
      case "null":
      case "notNull":
        return "is " + condition.key + " " + condition.exp;
      case "in":
        return "is " + condition.key + " in " + condition.value;
      default:
        return (
          "is " +
          condition.key +
          " " +
          expMap[condition.exp] +
          " " +
          condition.value
        );
    }
  };
  const [editMode,setEditMode] = useState(Array.from({length: branchCondition.length},x=>false))
  const isChecked = (bitStr, i) => bitStr[i] === "1";
  const handleChange = (e, key, value, index) => {
    console.log(e.target, key, value, index);
  };
  const toggleEdit = (index) => {
    const tempEditMode = editMode.slice();
    tempEditMode[index] = !editMode[index];
    setEditMode(tempEditMode);
  }
  return (
    <ListGroup className="nextnode">
      {Object.entries(nodeData.next).map(([key, value], nextIndex) => (
          <ListGroup.Item className="nextnode-item" key={`nextnode-item-${nextIndex}`}>
          <h6>{value}</h6>
          <div className="nextnode-item-key">
            <div>
              {branchCondition.length === 0
                ? key
                : branchCondition.map((item, branchIndex) => (
                    <OverlayTrigger
                      key={`ot-${branchIndex}`}
                      placement="top"
                      overlay={
                        <Tooltip id={`tooltip-${branchIndex}`}>
                          {conditionToText(item)}
                        </Tooltip>
                      }
                    >
                      <input
                        type="checkbox"
                        disabled={!editMode[nextIndex]}
                        onChange={e => handleChange(e, key, value, branchIndex)}
                        defaultChecked={isChecked(key, branchIndex)}
                      />
                    </OverlayTrigger>
                  ))}
              </div>
              <div>
                  {branchCondition.length !== 0 && editMode[nextIndex] &&
                    <>
                    <Button variant="primary" className="array-add-item" size="sm" type="submit">
                      Save
                    </Button>
                    <Button variant="danger" className="array-add-item" size="sm" onClick={e=>toggleEdit(nextIndex)}>
                      Cancel
                    </Button>
                    </>
                    }
                  {branchCondition.length !== 0 && !editMode[nextIndex] &&
                    <Button variant="success" className="array-add-item" size="sm" onClick={e=>toggleEdit(nextIndex)}>
                      Edit
                    </Button>
                  }
                </div>
            </div>
          </ListGroup.Item>
      ))}
      </ListGroup>
  );
}

function NodeInfo({ rule, selected, selectItem, NodeItemActions }) {
  const [isToastOpen, setToastOpen] = useState(false);
  const nodes = rule.nodes;
  const node = nodes[selected.id];
  const onSubmit = ({ formData }, id) => {
    setToastOpen(true);
    NodeItemActions.editChildNode(id, formData);
  };

  const isFinal = () => !node.next;
  const isStart = () => selected.id === rule.nodes.start;
  const onToggle = (e, nodeId, nextObj, branchIndex) => {
    console.log(e, nodeId, nextObj, branchIndex);
  };
  return (
    <ul className="nodeInfo-container">
      <AlertModal
        isOpen={isToastOpen}
        onClose={e => setToastOpen(false)}
        title="info"
        content="saved"
      />
      <li className="nodeInfo">
        <h3>{selected.id} </h3>
        {isStart() && <span>[start]</span>}
      </li>
      {!isFinal() && (
        <li className="nodeInfo">
          <h4>Next</h4>
          <Links
            nodeId={selected.id}
            nodeData={node}
            branchCondition={getBranchCondition(rule, selected.id)}
            onToggle={onToggle}
          />
        </li>
      )}
      <li className="childList nodeInfo">
        <h4>Job List</h4>
        <Accordion defaultActiveKey="0">
          {node.jobList.map((id, i) => {
            return (
              <ChildCard
                key={id}
                parentId={selected.id}
                id={id}
                data={rule.children[id]}
                onSubmit={onSubmit}
                index={i}
              />
            );
          })}
        </Accordion>
      </li>
    </ul>
  );
}

export default connect(
  ({ nodeItem }) => ({
    selected: nodeItem.selected,
    rule: nodeItem.rule
  }),
  dispatch => ({
    NodeItemActions: bindActionCreators(nodeItemActions, dispatch)
  })
)(NodeInfo);
