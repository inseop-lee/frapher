import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import SplitterLayout from "react-splitter-layout";
import "react-splitter-layout/lib/index.css";
import NodeCanvas from "./components/NodeCanvas";
import { Provider } from "react-redux";
import { createStore } from "redux";
import nodeItems from "./reducer";

let store = createStore(nodeItems);

function App(props) {
  return (
    <Provider store={store}>
      <SplitterLayout id="container" percentage secondaryInitialSize={25}>
        <div id="section">
          <NodeCanvas />
        </div>
        <div id="aside">
          {/* {chart.selected.type ? (
            <h1>{chart.selected.id}</h1>
          ) : (
            <h1>not selected</h1>
          )} */}
        </div>
      </SplitterLayout>
    </Provider>
  );
}

export default App;
