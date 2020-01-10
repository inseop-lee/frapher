import { mapValues } from "lodash";
import React from "react";
import * as actions from "@mrblenny/react-flow-chart/src/container/actions";
import { FlowChart } from "@mrblenny/react-flow-chart";
import NodeInner from "./NodeInner";
import AddChildInputModal from "../Common";

class NodeCanvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      offset: {
        x: 0,
        y: 0
      },
      nodes: this.props.nodes,
      links: this.props.links,
      selected: this.props.selected,
      hovered: {},
      isOpenAddChild: false
    };
    this.onClickAddChild = this.onClickAddChild.bind(this)
    this.onSelectChild = this.onSelectChild.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    
    this.callbacks = mapValues(actions, func => (...args) =>
      this.setState(func(...args))
    );

    this.callbacks = Object.keys(actions).reduce((obj,key,idx)=>{
      obj[key] = (...args) =>{
          this.onAction(key,...args);
          return this.setState(actions[key](...args));
      };
      return obj;
    },{});

  }
  
  onAction(action,{nodeId}) {
    const NODE_CLICK = "onNodeClick";
    const CANVAS_CLICK = "onCanvasClick";
    const NODE = "node";

    console.log("action",action);

    switch (action) {
      case NODE_CLICK:
        this.props.selectItem(nodeId,NODE)
        break;
      case CANVAS_CLICK:
        this.props.selectItem(null,null)
        break;
      default:
        break;
    }

  }
  onSelectChild(nodeId, id) {
    console.log(nodeId, id);
    return;
  }
  onClickAddChild(id) {
    this.setState({isOpenAddChild: !this.state.isOpenAddChild});
    return;
  }
  onSubmit(event) {
    this.setState({isOpenAddChild: !this.state.isOpenAddChild});
  }

  render() {
    return (
      <div>
        <AddChildInputModal
          isOpen={this.state.isOpenAddChild}
          parentId={this.state.selected.id}
          onSubmit={this.onSubmit}
        />
        <FlowChart
          chart={this.state}
          callbacks={this.callbacks}
          Components={{
            NodeInner: props =>
              NodeInner({
                ...props,
                onClickAddChild: this.onClickAddChild,
                onSelectChild: this.onSelectChild
              })
          }}
        />
      </div>
    );
  }
}

export default NodeCanvas;
