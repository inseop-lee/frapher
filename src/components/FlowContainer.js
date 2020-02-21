import React from "react";
import SplitterLayout from "react-splitter-layout";
import "react-splitter-layout/lib/index.css";
import NodeCanvas from "./NodeCanvas/NodeCanvas";
import NodeInfo from "./NodeInfo/NodeInfo";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actionCreators as nodeItemActions } from "../store/modules/nodeItem";

function FlowContainer({ rule, selected, selectItem }) {
  return (
    <div id="container">
      <SplitterLayout id="container" percentage secondaryInitialSize={35}>
        <div id="section">
          <NodeCanvas />
        </div>
        {selected.type === "node" && rule.nodes[selected.id] && (
          <NodeInfo id="sidebar" />
        )}
      </SplitterLayout>
    </div>
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
