import React, { useEffect, useState } from "react";
import "react-splitter-layout/lib/index.css";
import NodeCanvas from "./NodeCanvas/NodeCanvas";
import NodeInfo, { LinkInfo } from "./NodeInfo/NodeInfo";
import Tools from "./Tools/Tools";
import JsonSchemaInputModal from "./Common/JsonSchemaInputModal";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actionCreators as nodeItemActions } from "../store/modules/nodeItem";
import nodemeta_schema from "../container/schema/nodemeta_schema.json";

function FlowContainer({ rule, meta, selected, changed, NodeItemActions }) {
  const [onLoad, setOnLoad] = useState(false);
  const [isOpenNewRuleModal, setOpenNewRuleModal] = useState(false);
  useEffect(() => {
    setOnLoad(true);
    window.ipcRenderer.on("new-rule", function (event, message) {
      setOpenNewRuleModal(true);
    });
    window.ipcRenderer.on("save-rule", function (event, message) {
      NodeItemActions.initChanged();
      window.refreshTitle();
    });
    window.ipcRenderer.on("import-rule", function (event, data) {
      NodeItemActions.setInitRule(data.rule, data.meta);
      setOpenNewRuleModal(false);
      window.refreshTitle();
    });
  }, []);

  useEffect(() => {
    console.log(onLoad);
  }, [onLoad]);

  useEffect(() => {
    window.remote.app.showExitPrompt = changed;
    window.refreshTitle();
  }, [changed]);

  useEffect(() => {
    window.remote.app.ruleData = { rule, meta };
  }, [rule, meta]);

  const handleSubmitNewRule = ({ formData }) => {
    NodeItemActions.setInitRule(null, formData);
    setOpenNewRuleModal(false);
    window.refreshTitle();
  };
  return (
    <>
      <JsonSchemaInputModal
        title="New rule"
        isOpen={isOpenNewRuleModal}
        onClose={(e) => setOpenNewRuleModal(false)}
        onSubmit={handleSubmitNewRule}
        schema={nodemeta_schema}
        closable={true}
      />
      <div id="container">
        <div id="menu">
          <Tools />
        </div>
        <div id="node-canvas">
          <NodeCanvas />
        </div>
        {selected.type === "node" && rule.nodes[selected.id] && (
          <NodeInfo id="sidebar" key={`nodeInfo-${selected.id}`} />
        )}
        {selected.type === "link" && (
          <LinkInfo
            selected={selected}
            selectItem={NodeItemActions.selectItem}
          />
        )}
      </div>
    </>
  );
}

export default connect(
  ({ nodeItem }) => ({
    selected: nodeItem.selected,
    rule: nodeItem.rule,
    changed: nodeItem.changed,
    meta: nodeItem.meta,
  }),
  (dispatch) => ({
    NodeItemActions: bindActionCreators(nodeItemActions, dispatch),
  })
)(FlowContainer);
