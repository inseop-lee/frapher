import React from "react";
import "./App.css";
import { Provider } from "react-redux";
import FlowContainer from "./components/FlowContainer";
import store from "./store"

function App(props) {
  return (
    <Provider store={store}>
      <FlowContainer/>
    </Provider>
  );
}

export default App;
