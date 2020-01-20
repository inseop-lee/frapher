import {cloneDeep} from "lodash"
import React from "react";
import * as actions from "@mrblenny/react-flow-chart/src/container/actions";

import NodeInnerTemplate from "./NodeInnerTemplate";
import AddChildInputModal from "../Common/AddChildInputModal";
import { FlowChart } from "@mrblenny/react-flow-chart";
import {getChildDataSetById, initChart} from "../../container/utils"
import {bindActionCreators} from "redux";
import { connect } from 'react-redux';
import {actionCreators as nodeItemActions} from "../../store/modules/nodeItem";


class NodeCanvas extends React.Component {
  constructor(props) {
    super(props);
    console.log('NodeCanvas')
    const chart = initChart(this.props.rule.nodes)
    this.state = {
      offset: {
        x: 0,
        y: 0
      },
      nodes: chart.nodes,
      links: chart.links,
      selected: cloneDeep(this.props.selected),
      hovered: {},
      isOpenAddChild: false
    };
    this.onClickAddChild = this.onClickAddChild.bind(this)
    this.onSelectChild = this.onSelectChild.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.callbacks = Object.keys(actions).reduce((obj,key,idx)=>{
      obj[key] = (...args) =>{
          this.onAction(key,...args);
          return this.setState(actions[key](...args));
      };
      return obj;
    },{});
  }

  onAction(action,args) {
    const NODE_CLICK = "onNodeClick";
    const CANVAS_CLICK = "onCanvasClick";
    const DRAG_NODE = "onDragNode";
    const NODE = "node";
    const {nodeId} = args;
    switch (action) {
      case NODE_CLICK:
        this.props.NodeItemActions.selectItem(nodeId,NODE)
        break;
      case CANVAS_CLICK:
        this.props.NodeItemActions.selectItem(null,null)
        break;
      case DRAG_NODE:
        console.log(args)
        break;
      default: 
        break;
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
  }

  onSelectChild(nodeId, id) {
    this.props.NodeItemActions.selectItem(id,"child")
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
          config={{
            portConfig: {
              to:"bottom",
              from:"top"
            }
          }}
          Components={{
            NodeInner: props =>
              NodeInnerTemplate({
                ...props,
                childDataSet: getChildDataSetById(props.node.id,this.props.rule),
                selectItem: this.onSelectChild
              })
          }}
        />
      </div>
    );
  }
}

export default connect(
  ({nodeItem}) => ({
    selected : nodeItem.selected,
    rule: nodeItem.rule
  }), 
  (dispatch) => ({
    NodeItemActions: bindActionCreators(nodeItemActions, dispatch)
  })
)(NodeCanvas);
