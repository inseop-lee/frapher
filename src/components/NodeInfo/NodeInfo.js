import React, { useState } from "react";
import "./NodeInfo.css";
import { Accordion, Modal } from "react-bootstrap";
import ChildCard from "./ChildCard";
import {bindActionCreators} from "redux";
import { connect } from 'react-redux';
import {actionCreators as nodeItemActions} from "../../store/modules/nodeItem";

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

function Links({node}) {
  return (
    <div>
    {
      Object.entries(node.next).map(([key,value],index)=> (
        <div key={index}>
          <span>{key} : {value}</span>
        </div>
      ))
    }
    </div>
  )
}

function NodeInfo({ rule, selected, selectItem, NodeItemActions }) {
  const [isToastOpen, setToastOpen] = useState(false);
  const nodes = rule.nodes
  const node = nodes[selected.id]
  const onSubmit = ({ formData }, id) => {
    setToastOpen(true);
    NodeItemActions.editChildNode(id, formData);
  };

  const isFinal = () => !node.next;
  const isStart = () => selected.id === rule.nodes.start;

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
        { isStart() && <span>[start]</span>}
      </li>
      {!isFinal() && 
        <li className="nodeInfo">
          <h4>Next</h4>
          <Links node={node} />
        </li>
      }
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
  ({nodeItem}) => ({
    selected : nodeItem.selected,
    rule: nodeItem.rule
  }), 
  (dispatch) => ({
    NodeItemActions: bindActionCreators(nodeItemActions, dispatch)
  })
)(NodeInfo);