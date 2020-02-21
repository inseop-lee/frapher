import { cloneDeep } from "lodash";
import React from "react";
import * as actions from "@mrblenny/react-flow-chart/src/container/actions";

import NodeInnerTemplate from "./NodeInnerTemplate";
import InputModal from "../Common/InputModal";
import { FlowChart } from "@mrblenny/react-flow-chart";
import {
  getChildDataSetById,
  initChart,
  getNewNodeName,
  getBranchCondition,
  hasBranchChild
} from "../../container/utils";
import { NodePort } from "../../container/constants";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actionCreators as NodeItemActions } from "../../store/modules/nodeItem";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import "./NodeCanvas.css";

const EDIT_NODE = "EDIT_NODE";
const INPUT_BRANCH = "INPUT_BRANCH";

class NodeCanvas extends React.Component {
  constructor(props) {
    super(props);
    const chart = initChart(this.props.rule.nodes);
    this.state = {
      offset: {
        x: 0,
        y: 0
      },
      nodes: chart.nodes,
      links: chart.links,
      selected: cloneDeep(this.props.selected),
      hovered: {},
      modalData: null
    };
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.onSelectChild = (nodeId, id) =>
      this.props.NodeItemActions.selectItem(id, "node");
    this.OpenModal = this.OpenModal.bind(this);
    this.handleSubmitModal = this.handleSubmitModal.bind(this);
    this.handleAddNode = this.handleAddNode.bind(this);
    this.handleDeleteNode = this.handleDeleteNode.bind(this);
    this.handleAddLink = this.handleAddLink.bind(this);
    this.callbacks = Object.keys(actions).reduce((obj, key, idx) => {
      obj[key] = (...args) => {
        this.onAction(key, ...args);
        return this.setState(actions[key](...args));
      };
      return obj;
    }, {});
  }

  onAction(action, args) {
    const NODE_CLICK = "onNodeClick";
    const LINK_CLICK = "onLinkClick";
    const CANVAS_CLICK = "onCanvasClick";
    const DRAG_NODE = "onDragNode";
    const NODE = "node";
    const DELETE_KEY = "onDeleteKey";
    const { nodeId } = args;
    switch (action) {
      case NODE_CLICK:
        this.props.NodeItemActions.selectItem(nodeId, NODE);
        break;
      case CANVAS_CLICK:
      case LINK_CLICK:
        this.props.NodeItemActions.selectItem(null, null);
        break;
      case DRAG_NODE:
        break;
      case DELETE_KEY:
        switch (this.state.selected.type) {
          case "node":
            this.props.NodeItemActions.deleteNode(this.props.selected.id);
            break;
          case "link":
            const link = this.state.links[this.state.selected.id];
            const fromId =
              link.from.portId === NodePort.OUT
                ? link.from.nodeId
                : link.to.nodeId;
            const toId =
              link.to.portId === NodePort.IN
                ? link.to.nodeId
                : link.from.nodeId;
            this.props.NodeItemActions.deleteLink(fromId, toId);
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  }

  OpenModal(type, data = null) {
    switch (type) {
      case EDIT_NODE:
        this.setState({
          modalData: {
            title: "Edit Node ID",
            type: EDIT_NODE,
            inputArray: [
              {
                title: "ID",
                id: "nodeId",
                defaultValue: this.props.selected.id,
                type: "text"
              }
            ]
          }
        });
        break;
      case INPUT_BRANCH:
        const inputArray = this.getBranchConditionInput(data.fromId);
        this.setState({
          modalData: {
            title: "Input branch condition",
            type: INPUT_BRANCH,
            inputArray: inputArray,
            data
          }
        });
        break;
      default:
        break;
    }
  }

  handleSubmitModal(e, type, result) {
    switch (type) {
      case EDIT_NODE:
        this.submitEditNodeId(result);
        break;
      case INPUT_BRANCH:
        this.submitInputBranch(result);
        break;
      default:
        break;
    }
    this.setState({ modalData: null });
  }

  submitEditNodeId(result) {
    const fromId = this.props.selected.id;
    const toId = result.nodeId;
    const nodes = cloneDeep(this.state.nodes);
    const links = cloneDeep(this.state.links);
    if (nodes[toId]) {
      alert(`${toId} is already exists`);
      return;
    }
    nodes[toId] = nodes[fromId];
    nodes[toId].id = toId;
    delete nodes[fromId];
    for (const linkId in links) {
      links[linkId].from.nodeId =
        links[linkId].from.nodeId === fromId ? toId : links[linkId].from.nodeId;
      links[linkId].to.nodeId =
        links[linkId].to.nodeId === fromId ? toId : links[linkId].to.nodeId;
    }
    this.props.NodeItemActions.editNodeId(fromId, toId);
    this.props.NodeItemActions.selectItem(toId, "node");

    this.setState({
      nodes: nodes,
      links: links,
      selected: { id: toId, type: "node" }
    });
  }

  submitInputBranch(result) {
    const res = Object.keys(result)
      .sort()
      .reduce((acc, key) => (acc += result[key] ? "1" : "0"), "");
    const fromId = this.state.modalData.data.fromId;
    if (this.props.rule.nodes[fromId].next[res]) {
      alert(`"${res}" condition already exists.`);
      const linkId = this.state.modalData.data.linkId;
      const links = cloneDeep(this.state.links);
      delete links[linkId];
      this.setState({ links: links });
    } else {
      const fromId = this.state.modalData.data.fromId;
      const toId = this.state.modalData.data.toId;
      this.props.NodeItemActions.addNextNode(fromId, toId, res);
    }
  }

  handleCloseModal(e) {
    if (this.state.modalData.type === INPUT_BRANCH) {
      const linkId = this.state.modalData.data.linkId;
      const links = cloneDeep(this.state.links);
      delete links[linkId];
      this.setState({ links: links });
    }
    this.setState({ modalData: null });
  }
  handleDeleteNode() {
    const isStart = this.props.rule.nodes.start === this.props.selected.id;
    if (isStart) {
      alert("Delete root node is not allowed.");
      return;
    }
    const chart = cloneDeep(this.state);
    if (chart.selected.type === "node" && chart.selected.id) {
      var node_1 = chart.nodes[chart.selected.id];
      Object.keys(chart.links).forEach(function(linkId) {
        var link = chart.links[linkId];
        if (link.from.nodeId === node_1.id || link.to.nodeId === node_1.id) {
          delete chart.links[link.id];
        }
      });
      delete chart.nodes[chart.selected.id];
    }
    if (chart.selected) {
      chart.selected = {};
    }
    this.props.NodeItemActions.deleteNode(this.props.selected.id);
    this.setState(chart);
  }

  handleAddNode(e, data) {
    const nodes = cloneDeep(this.state.nodes);
    const [x, y] = [
      e.clientX - this.state.offset.x,
      e.clientY - this.state.offset.y
    ];
    const nodeId = getNewNodeName(this.props.rule);
    const ports = !data.isFinal
      ? {
          [NodePort.IN]: { id: NodePort.IN, type: "top" },
          [NodePort.OUT]: { id: NodePort.OUT, type: "bottom" }
        }
      : { [NodePort.IN]: { id: NodePort.IN, type: "top" } };
    const newNode = {
      id: nodeId,
      ports: ports,
      position: { x: x, y: y },
      type: "input-output"
    };
    nodes[nodeId] = newNode;
    this.props.NodeItemActions.addNode(nodeId, data.isFinal);
    this.setState({ nodes });
  }

  handleAddLink({ linkId, fromNodeId, toNodeId, fromPortId, toPortId, chart }) {
    if (fromPortId === toPortId || fromNodeId === toNodeId) return false;
    const fromId = fromPortId === NodePort.OUT ? fromNodeId : toNodeId;
    const toId = fromPortId === NodePort.OUT ? toNodeId : fromNodeId;

    for (const link in chart.links) {
      const from = chart.links[link].from;
      const to = chart.links[link].to;
      if (
        (from.nodeId === fromNodeId && to.nodeId === toNodeId) ||
        (from.nodeId === toNodeId && to.nodeId === fromNodeId)
      )
        return false;
    }

    const fromNodeHasBranchChild = hasBranchChild(fromId, this.props.rule);
    const fromHasNext =
      Object.keys(this.props.rule.nodes[fromId].next).length > 0;

    if (fromNodeHasBranchChild) {
      this.OpenModal(INPUT_BRANCH, {
        fromId: fromId,
        toId: toId,
        linkId: linkId
      });
      return true;
    } else {
      if (fromHasNext) return false;
      this.props.NodeItemActions.addNextNode(fromId, toId, "default");
      return true;
    }
  }

  getBranchConditionInput(fromId) {
    const conditionToText = condition => {
      const expMap = { eq: "=", ne: "≠", lt: "<", le: "≤", gt: ">", ge: "≥" };
      switch (condition.exp) {
        case "null":
          return (
            <>
              <em>{condition.key}</em> is null
            </>
          );
        case "notNull":
          return (
            <>
              <em>{condition.key}</em> is not null
            </>
          );
        case "in":
          return (
            <>
              <em>{condition.key}</em> in [{condition.value}]
            </>
          );
        default:
          return (
            <>
              <em>{condition.key}</em> {expMap[condition.exp]}
              <em>{condition.value}</em>
            </>
          );
      }
    };
    return getBranchCondition(this.props.rule, fromId).map((item, index) => ({
      title: conditionToText(item),
      id: `condition-${index}`,
      type: "checkbox"
    }));
  }

  render() {
    return (
      <>
        <InputModal
          isOpen={this.state.modalData ? true : false}
          onSubmit={this.handleSubmitModal}
          onClose={this.handleCloseModal}
          data={this.state.modalData}
        />
        <ContextMenu id="nodecanvas-context-menu">
          <MenuItem data={{ isFinal: false }} onClick={this.handleAddNode}>
            Add Processor
          </MenuItem>
          <MenuItem data={{ isFinal: true }} onClick={this.handleAddNode}>
            Add Final Action
          </MenuItem>
        </ContextMenu>
        <ContextMenuTrigger id="nodecanvas-context-menu" holdToDisplay={-1}>
          <FlowChart
            chart={this.state}
            callbacks={this.callbacks}
            config={{
              validateLink: this.handleAddLink
            }}
            Components={{
              NodeInner: props =>
                NodeInnerTemplate({
                  ...props,
                  childDataSet: getChildDataSetById(
                    props.node.id,
                    this.props.rule
                  ),
                  selected: this.props.selected.id === props.node.id,
                  onClickEditId: () => this.OpenModal(EDIT_NODE),
                  onClickDelete: this.handleDeleteNode
                })
            }}
          />
        </ContextMenuTrigger>
      </>
    );
  }
}

export default connect(
  ({ nodeItem }) => nodeItem,
  dispatch => ({
    NodeItemActions: bindActionCreators(NodeItemActions, dispatch)
  })
)(NodeCanvas);
