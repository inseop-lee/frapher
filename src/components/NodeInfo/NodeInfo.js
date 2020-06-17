import React, { useState } from "react";
import "./NodeInfo.css";
import { Accordion, Form, Button, Card } from "react-bootstrap";
import ChildCard from "./ChildCard";
import Links from "./Links";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actionCreators as NodeItemActions } from "../../store/modules/nodeItem";
import {
  MinimalChildData,
  hasBranchChild,
  getBranchCondition,
} from "../../container/utils";
import { JobType, ActionType } from "../../container/constants";
import { job, action } from "../../container/schema";
import { MdClose } from "react-icons/md";

function AddChildSection({ isFinal, onSubmit }) {
  const [tempChildId, setTempChildId] = useState("");
  const [tempChildType, setTempChildType] = useState(
    isFinal ? ActionType.FEEDBACK : JobType.BRANCH
  );
  const handleChangeChildId = (e) => {
    const id = e.target.value;
    setTempChildId(id);
  };

  const handleChangeChildType = (e) => {
    const type = e.target.value;
    setTempChildType(type);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(tempChildId, tempChildType);
  };
  return (
    <div className="add-child-section">
      <Form onSubmit={handleSubmit}>
        {!isFinal && (
          <Form.Control
            value={tempChildId}
            onChange={handleChangeChildId}
            size="sm"
            type="text"
            placeholder={isFinal ? "Action ID" : "Job ID"}
          />
        )}
        <Form.Control
          value={tempChildType}
          onChange={handleChangeChildType}
          size="sm"
          as="select"
        >
          {isFinal
            ? Object.values(ActionType).map((item) => (
                <option key={`child-itemtype-${item}`}>{item}</option>
              ))
            : Object.values(JobType).map((item) => (
                <option key={`child-itemtype-${item}`}>{item}</option>
              ))}
        </Form.Control>
        <Button size="sm" type="submit">
          Add
        </Button>
      </Form>
    </div>
  );
}

export function LinkInfo({ selected, selectItem }) {
  return (
    <ul className="node-info-container">
      <li className="node-info">
        <h3>
          {selected.id.fromId} → {selected.id.toId}
        </h3>
        <div
          className="node-info-close"
          onClick={(e) => selectItem(null, null)}
        >
          <MdClose />
        </div>
      </li>
      <li>
        <p>If you want to delete this link, press "Delete" key.</p>
      </li>
    </ul>
  );
}

function NodeInfo({ rule, selected, NodeItemActions }) {
  const nodes = rule.nodes;
  const node = nodes[selected.id];
  const final_actions = rule.children.final_actions;
  const isFinal = !node.next;
  //const isStart = selected.id === rule.nodes.start;
  const [selectedChild, setSelectedChild] = useState(isFinal ? 0 : -1);
  const [tempChild, setTempChild] = useState({});

  const dismissAddChild = (isFinal) => {
    setSelectedChild(isFinal ? 0 : -1);
    setTempChild({});
  };

  const handleEditChild = ({ formData }, id) => {
    NodeItemActions.editChildNode(selected.id, id, formData, isFinal);
    setSelectedChild(-1);
  };

  const handleApplyAddChild = ({ formData }, id) => {
    NodeItemActions.addChildNode(selected.id, id, formData, isFinal);

    dismissAddChild(isFinal);
    setSelectedChild(-1);
  };

  const handleSelectChild = (e, eventKey) => {
    setSelectedChild(selectedChild !== eventKey ? eventKey : -1);
  };

  const handleDeleteChild = (e, id) => {
    NodeItemActions.deleteChildNode(selected.id, id);
    setSelectedChild(-1);
  };

  const handleAddChild = (id, type) => {
    if (!isFinal && (rule.children.jobs.hasOwnProperty(id) || !id)) {
      alert("Job ID must be unique and not empty.");
      return;
    }

    if (
      (type === JobType.BRANCH || hasBranchChild(selected.id, rule)) &&
      rule.nodes[selected.id].jobList.length > 0
    ) {
      alert("node which contain a branch job must have only one job");
      return;
    }

    if (isFinal) {
      const finalAction = rule.children.final_actions[selected.id];
      if (!finalAction ? false : finalAction.length > 0) {
        alert("Final node must have only one action");
        return;
      }
    }

    const dataTemplate = MinimalChildData[type];
    if (!isFinal) dataTemplate.result = id;
    setTempChild(dataTemplate);
    setSelectedChild(isFinal ? 0 : node.jobList.length);
  };

  return (
    <ul className="node-info-container">
      <li className="node-info">
        <h3>{selected.id} </h3>
        <div
          className="node-info-close"
          onClick={(e) => NodeItemActions.selectItem(null, null)}
        >
          <MdClose />
        </div>
      </li>
      <li className="childList">
        <h4>{isFinal ? "Actions" : "Jobs"}</h4>
        {((!isFinal &&
          (node.jobList.length === 0 || !hasBranchChild(selected.id, rule))) ||
          (isFinal && !final_actions[selected.id])) && (
          <AddChildSection isFinal={isFinal} onSubmit={handleAddChild} />
        )}
        {Object.keys(tempChild).length === 0 &&
          (isFinal
            ? (!final_actions[selected.id] ||
                final_actions[selected.id].length === 0) && (
                <Card body className="grey">
                  The action does not exist.
                </Card>
              )
            : node.jobList.length === 0 && (
                <Card className="grey" body>
                  The job does not exist.
                </Card>
              ))}

        <Accordion activeKey={selectedChild}>
          {Object.keys(tempChild).length > 0 && (
            <ChildCard
              parentId={selected.id}
              id={isFinal ? "Final Action" : tempChild.result}
              data={tempChild}
              index={node.jobList.length}
              onSubmit={handleApplyAddChild}
              onSelect={handleSelectChild}
              isSelected={selectedChild === node.jobList.length}
              onDelete={(e) => dismissAddChild(isFinal)}
              isNew={true}
              schema={isFinal ? action : job}
            />
          )}
          {isFinal && final_actions[selected.id]
            ? final_actions[selected.id].map((obj, i) => (
                <ChildCard
                  key={`childcard-${obj.type}`}
                  parentId={selected.id}
                  id={"Final Action"}
                  data={obj}
                  onSubmit={handleEditChild}
                  index={i}
                  onSelect={handleSelectChild}
                  isSelected={selectedChild === i}
                  isNew={false}
                  schema={action}
                />
              ))
            : node.jobList.map((id, i) => (
                <ChildCard
                  key={`childcard-${id}`}
                  parentId={selected.id}
                  id={id}
                  data={rule.children.jobs[id]}
                  onSubmit={handleEditChild}
                  index={i}
                  onSelect={handleSelectChild}
                  isSelected={selectedChild === i}
                  onDelete={handleDeleteChild}
                  isNew={false}
                  schema={job}
                />
              ))}
        </Accordion>
      </li>
      {!isFinal && (
        <li>
          <h4>Next</h4>
          {Object.keys(node.next).length === 0 ? (
            <Card body className="grey">
              There is no next processor
            </Card>
          ) : (
            <Links
              nodeId={selected.id}
              nodeData={node}
              branchCondition={getBranchCondition(rule, selected.id)}
              editNextNode={NodeItemActions.editNextNode}
              addNextNode={NodeItemActions.addNextNode}
              deleteNextBranch={NodeItemActions.deleteNextBranch}
            />
          )}
        </li>
      )}
    </ul>
  );
}

export default connect(
  ({ nodeItem }) => ({
    selected: nodeItem.selected,
    rule: nodeItem.rule,
  }),
  (dispatch) => ({
    NodeItemActions: bindActionCreators(NodeItemActions, dispatch),
  })
)(NodeInfo);
