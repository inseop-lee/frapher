// Actions
const ADD_NODE = "ADD_NODE"
const SELECT_ITEM = "SELECT_ITEM";
const ADD_CHILD_NODE = "ADD_CHILD";
const SELECT_CHILD_NODE = "SELECT_CHILD_NODE";

// Action Creators
function addNode(id,x,y) {
    return {
			type: ADD_NODE,
			id,x,y
    };
}
 
function selectItem(id,itemType) {
    return {
			type: SELECT_ITEM,
			id,itemType
    };
}

function addChildNode(parentId,id,itemType) {
  return {
		type: ADD_CHILD_NODE,
		parentId,id,itemType
  };
}

function selectChildNode(parentId,id) {
  return {
		type: SELECT_CHILD_NODE,
		parentId,id
  };
}
// Reducer

const initialState = {
    nodes: {
			node1: {
				id: "node1",
				type: "left-right",
				position: {
					x: 100,
					y: 300
				},
				ports: {
					port2: {
						id: "port2",
						type: "right"
					}
				},
				children: [
					{ id: "child1", type: "type1" },
					{ id: "child2", type: "type2" }
				]
			},
			node2: {
				id: "node2",
				type: "left-right",
				position: {
					x: 500,
					y: 400
				},
				ports: {
					port1: {
						id: "port1",
						type: "left"
					},
					port2: {
						id: "port2",
						type: "right"
					}
				},
				children: [{ id: "child1", type: "type2" }]
			}
		},
    links: {
			link1: {
				id: "link1",
				from: {
					nodeId: "node1",
					portId: "port2"
				},
				to: {
					nodeId: "node2",
					portId: "port1"
				}
			}
		},
		selected: {},
		selectedChild: {}
};

function nodeItems(state = initialState, action) {
  switch (action.type) {
    case ADD_NODE:
        return applyAddNode(state, action)
    case SELECT_ITEM:
        return applySelectItem(state, action)
    case ADD_CHILD_NODE:
        return applyAddChildNode(state, action)
    case SELECT_CHILD_NODE:
        return applySelectChildNode(state, action)
    default:
        return state;
  }
}

// Reducer Functions

function applyAddNode(state, action) {
	const nodes = state.nodes
	const newNode = {
		id: action.id,
		type: "left-right",
		position: {
			x: action.x,
			y: action.y
		},
		ports: {
			input: {
				id: "input",
				type: "left"
			},
			output: {
				id: "output",
				type: "right"
			}
		},
		children: []
	};

	nodes[action.id] = newNode;
  return {
		...state,
		nodes: nodes
  };
}

function applySelectItem(state, action) {
	const selectedNode = {
		type: action.itemType,
		id: action.id
	}
	return {
		...state,
		selected: selectedNode
	};
}

function applyAddChildNode(state, action) {
	const newChild = {
		id: action.id,
		type: action.itemType
	}
	const nodes = Object.assign({},state.nodes)
	nodes[action.parentId].children.push(newChild)
	return {
		...state,
		nodes: {
			...state.nodes,
						
		}
	}
}

function applySelectChildNode(state, action) {
	const selectedChild = {
		id: action.id
	}
	return {
		...state,
		selectedChild: selectedChild
	};
}


// Exports
const actionCreators = {
	addNode,
	selectItem,
	addChildNode,
	selectChildNode
};
export { actionCreators };

// Default
export default nodeItems;