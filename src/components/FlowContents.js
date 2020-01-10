import React from "react";
import SplitterLayout from "react-splitter-layout";
import "react-splitter-layout/lib/index.css";
import "bootstrap/dist/css/bootstrap.css";
import NodeCanvas from "./NodeCanvas";

function FlowContents(props) {
  return (
      <div id="container">
        <SplitterLayout id="container" percentage secondaryInitialSize={25}>
          <div id="section">
            <NodeCanvas />
          </div>
          <div id="aside">
            {props.selected.type ? (
              <h1>{props.selected.id}</h1>
            ) : (
              <h1>not selected</h1>
            )}
          </div>
        </SplitterLayout>
      </div>
  );
}

export default FlowContents;
