import React, { useState } from "react";
import "./NodeInfo.css";
import { Accordion, Modal } from "react-bootstrap";
import ChildCard from "./ChildCard";
import {hasBranchChild} from "../../container/utils"
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

function NodeInfo({ rule, selected, selectItem, editChildNode }) {
  console.log(rule)
  const [isToastOpen, setToastOpen] = useState(false);
  const nodes = rule.nodes
  const node = nodes[selected.id]
  const onSubmit = ({ formData }, parentId, id) => {
    setToastOpen(true);
    editChildNode(parentId, id, formData);
  };

  const isFinal = () => !node.next;
  const isStart = () => selected.id === rule.nodes.start;
  

  return (
    <div className="nodeInfo-container">
      <AlertModal
        isOpen={isToastOpen}
        onClose={e => setToastOpen(false)}
        title="info"
        content="saved"
      />
      <div className="nodeInfo">
        <h3>{selected.id} </h3>
        { isStart() && <span>[start]</span>}
      </div>
      {!isFinal() && 
        <div className="nodeInfo">
          <h4>Next</h4>
          <Links node={node} />
        </div>
      }
      <div className="childList nodeInfo">
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
      </div>
    </div>
  );
}

export default NodeInfo;
