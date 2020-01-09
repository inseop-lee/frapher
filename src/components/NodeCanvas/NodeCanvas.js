import { mapValues } from "lodash";
import {merge} from 'lodash/fp';
import React from "react";
import * as actions from "@mrblenny/react-flow-chart/src/container/actions";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input
} from "reactstrap";
import { FlowChart } from "@mrblenny/react-flow-chart";
import NodeInner from "./NodeInner"

class NodeCanvas extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      offset: {
        x: 0,
        y: 0
      },
      nodes: this.props.nodes,
      links: this.props.links,
      selected: this.props.selected,
      hovered: {}
    };
    this.state = {
      ...this.state,
      addJobModal: {
        isOpen: false,
        title: "Input job id"
      }
    }
  }

  toggleAddJobModal = () => {
    const newState = merge(this.state, {
      addJobModal: { isOpen: !this.state.addJobModal.isOpen}
    })
    this.setState(newState);
  };

  componentDidUpdate(props,state) {
  }
  onSelectChild(nodeId, id) {
    console.log(nodeId,id)
    return;
  }
  onClickAddChild(id) {
    console.log(id)
    return;
  }

  render() {
    const stateActions = mapValues(actions, func => (...args) =>
    this.setState(func(...args))
    );
    return (
      <div>
        <Modal isOpen={this.state.addJobModal.isOpen} toggle={this.toggleAddJobModal}>
        <ModalHeader toggle={this.toggleAddJobModal}>
          {this.state.addJobModal.title}
        </ModalHeader>
        <ModalBody>
          <Input type="text" name="jobId" placeholder="Job ID" />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" type="submit">Add</Button>{' '}
          <Button color="secondary" onClick={this.toggleAddJobModal}>Cancel</Button>
        </ModalFooter>
        </Modal>
        <FlowChart
          chart={this.state}
          callbacks={stateActions}
          Components={{
            NodeInner: (props) => NodeInner({...props,onClickAddChild:this.onClickAddChild,onSelectChild:this.onSelectChild})
          }}
        />
      </div>
    );
  }
}

export default NodeCanvas;