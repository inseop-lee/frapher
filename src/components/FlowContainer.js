import React from "react";
import SplitterLayout from "react-splitter-layout";
import "react-splitter-layout/lib/index.css";
import "../bootstrap.min.css";
import NodeCanvas from "./NodeCanvas";
import NodeInfo from "./NodeInfo";

function FlowContainer({ nodes, selected, selectItem }) {
  return (
    <div id="container">
      <SplitterLayout id="container" percentage secondaryInitialSize={35}>
        <div id="section">
          <NodeCanvas />
        </div>
        {selected.type === "node" && (
            <NodeInfo
            id="sidebar"
            nodes={nodes}
            selected={selected}
            selectItem={selectItem}
            />
        )}
      </SplitterLayout>
    </div>
  );
}

export default FlowContainer;
