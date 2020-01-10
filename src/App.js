import React from "react";
import "./App.css";
import { Provider } from "react-redux";
import { createStore } from "redux";
import nodeItems from "./container/reducer";
import FlowContents from "./components";

let store = createStore(nodeItems);

function App(props) {
  return (
    <Provider store={store}>
      <FlowContents/>
    </Provider>
  );
}

export default App;
