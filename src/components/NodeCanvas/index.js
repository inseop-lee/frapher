import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators as actions } from "../../container/reducer";
import NodeCanvas from "./NodeCanvas";

function mapStateToProps(state) {
  const { nodes, links, selected,rule} = state;
  return {
    nodes,
    links,
    selected,
    rule
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