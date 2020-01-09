import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators as actions } from "../../reducer";
import NodeCanvas from "./NodeCanvas";

function mapStateToProps(state) {
  const { nodes, links, selected, selectedChild } = state;
  console.log("mapStateToProps")
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
    addChildNode: bindActionCreators(actions.addChildNode, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NodeCanvas);