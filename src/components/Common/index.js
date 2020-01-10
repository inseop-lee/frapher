import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators as actions } from "../../container/reducer";
import AddChildInputModal from "./AddChildInputModal";

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
    addChildNode: bindActionCreators(actions.addChildNode, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddChildInputModal);