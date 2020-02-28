import React, { useState } from "react";
import SplitterLayout from "react-splitter-layout";
import "react-splitter-layout/lib/index.css";
import NodeCanvas from "./NodeCanvas/NodeCanvas";
import NodeInfo from "./NodeInfo/NodeInfo";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actionCreators as nodeItemActions } from "../store/modules/nodeItem";
import { Button, Modal } from "react-bootstrap";
import Editor from "@monaco-editor/react";
import download from "downloadjs";

const toJson = val => JSON.stringify(val, null, 2);

function FCModal({ title, isOpen, dialogClassName, onClose, child }) {
  return (
    <Modal show={isOpen} onHide={onClose} dialogClassName={dialogClassName}>
      <Modal.Header closeButton>{title}</Modal.Header>
      <Modal.Body>{child}</Modal.Body>
    </Modal>
  );
}

function ExportContents({ rule }) {
  const monacoEditorOptions = {
    minimap: {
      enabled: false
    },
    automaticLayout: true
  };

  return (
    <div id="export-modal" className="d-flex justify-content-between">
      <div>
        <h4>Jobs</h4>
        <Editor
          language="json"
          value={toJson(rule.children.jobs)}
          width="65vh"
          height={600}
          theme="vs-light"
          options={monacoEditorOptions}
        />
      </div>
      <div>
        <h4>Processors</h4>
        <Editor
          language="json"
          value={toJson(rule.nodes)}
          width="65vh"
          height={600}
          theme="vs-light"
          options={monacoEditorOptions}
        />
      </div>
      <div>
        <h4>Final Actions</h4>
        <Editor
          language="json"
          value={toJson(rule.children.final_actions)}
          width="65vh"
          height={600}
          theme="vs-light"
          options={monacoEditorOptions}
        />
      </div>
    </div>
  );
}

function FlowContainer({ rule, selected, selectItem, NodeItemActions }) {
  const MODAL_CLOSED = 0;
  const EXPORT_MODAL = 1;
  const NEW_MODAL = 2;
  const [modalType, setModalType] = useState(MODAL_CLOSED);
  const openModal = type => {
    setModalType(type);
  };
  const handleCloseModal = e => {
    setModalType(MODAL_CLOSED);
  };
  const handleClickNew = e => {
    NodeItemActions.setInitRule(null);
    setModalType(MODAL_CLOSED);
  };
  const handleSaveRule = e => {
    download(toJson(rule), "rule.json", "application/json");
  };

  return (
    <>
      <div id="container">
        <SplitterLayout id="container" percentage secondaryInitialSize={35}>
          <div id="section">
            <div id="menu">
              <Button size="sm" onClick={e => openModal(NEW_MODAL)}>
                New
              </Button>
              <Button size="sm" onClick={e => openModal(EXPORT_MODAL)}>
                Export
              </Button>
              <Button size="sm" onClick={e => openModal(EXPORT_MODAL)}>
                Export
              </Button>
              <div className="custom-file">
                <input
                  type="file"
                  className="custom-file-input"
                  id="customFile"
                />
                <label className="custom-file-label" htmlFor="customFile">
                  Choose file
                </label>
              </div>
            </div>
            <NodeCanvas />
          </div>
          {selected.type === "node" && rule.nodes[selected.id] && (
            <NodeInfo id="sidebar" />
          )}
        </SplitterLayout>
      </div>
      <FCModal
        isOpen={modalType !== MODAL_CLOSED}
        onClose={handleCloseModal}
        title={modalType === EXPORT_MODAL ? "Export JSON" : "Are you sure?"}
        dialogClassName={modalType === EXPORT_MODAL ? "modal-90w" : ""}
        child={
          modalType === EXPORT_MODAL ? (
            <ExportContents rule={rule} />
          ) : (
            <div>
              <Button onClick={handleClickNew}>OK</Button>
              <Button variant="danger" onClick={handleCloseModal}>
                Cancel
              </Button>
            </div>
          )
        }
      />
    </>
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
)(FlowContainer);
