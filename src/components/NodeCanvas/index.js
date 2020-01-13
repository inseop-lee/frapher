import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators as actions } from "../../container/reducer";
import NodeCanvas from "./NodeCanvas";

function mapStateToProps(state) {
  const { nodes, links, selected, selectedChild } = state;
  return {
    nodes,
    links,
    selected,
    selectedChild
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addNode: bindActionCreators(actions.addNode, dispatch),
    selectItem: bindActionCreators(actions.selectItem, dispatch),
    addChildNode: bindActionCreators(actions.addChildNode, dispatch),
    editChildNode: bindActionCreators(actions.editChildNode, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NodeCanvas);