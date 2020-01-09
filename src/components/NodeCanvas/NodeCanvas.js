import { mapValues } from "lodash";
import React from "react";
import * as actions from "@mrblenny/react-flow-chart/src/container/actions";
import { FlowChart } from "@mrblenny/react-flow-chart";
import NodeInner from "./NodeInner";
import InputModal from "../Common/InputModal";

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
  }


  componentDidUpdate(props, state) {
    //TODO this.state Update from this.props
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
    const currentProps = this.props;
    event.preventDefault();
    this.setState({isOpenAddChild: !this.state.isOpenAddChild});
    console.log(event.target)
  }

  render() {
    const stateActions = mapValues(actions, func => (...args) =>
      this.setState(func(...args))
    );
    return (
      <div>
        <InputModal
          isOpen={this.state.isOpenAddChild}
          title="Create New Child Node"
          inputArray={[
            {title:"Node ID", id:"nodeId", name:"nodeId",type:"text",placeholder:"Input Node ID", value:this.state.selected.id},
            {title:"Child ID",id:"childId", name:"childId",type:"text",placeholder:"Enter New Child ID"},
            {title:"Type",id:"childType", name:"childType", type:"select", options:["control","http"]}
          ]}
          onSubmit={this.onSubmit}
        />
        <FlowChart
          chart={this.state}
          callbacks={stateActions}
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
