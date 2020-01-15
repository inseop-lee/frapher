import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators as actions } from "../../container/reducer";
import NodeInfo from "./NodeInfo";

function mapStateToProps(state) {
  const { selected,rule} = state;
  return {
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(NodeInfo);