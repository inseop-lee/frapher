// Actions
const ADD_NODE = "ADD_NODE";
const SELECT_ITEM = "SELECT_ITEM";
const ADD_CHILD_NODE = "ADD_CHILD";
const SELECT_CHILD_NODE = "SELECT_CHILD_NODE";
const EDIT_CHILD_NODE = "EDIT_CHILD_NODE";

// Action Creators
function addNode(id, x, y) {
  return {
    type: ADD_NODE,
    id,
    x,
    y
  };
}

function selectItem(id, itemType) {
  return {
    type: SELECT_ITEM,
    id,
    itemType
  };
}

function addChildNode(parentId, id, itemType) {
  return {
    type: ADD_CHILD_NODE,
    parentId,
    id,
    itemType
  };
}

function editChildNode(parentId, id, data) {
  return {
    type: EDIT_CHILD_NODE,
    parentId,
    id,
    data
  };
}

function selectChildNode(parentId, id) {
  return {
    type: SELECT_CHILD_NODE,
    parentId,
    id
  };
}
// Reducer

const initialState = {
  nodes: {
    node1: {
      id: "node1",
      type: "left-right",
      position: {
        x: 50,
        y: 270
      },
      ports: {
        out: {
          id: "out",
          type: "right"
        }
      }
    },
    node2: {
      id: "node2",
      type: "left-right",
      position: {
        x: 380,
        y: 330
      },
      ports: {
        in: {
          id: "in",
          type: "left"
        },
        out: {
          id: "out",
          type: "right"
        }
      }
    },
    node3: {
      id: "node3",
      type: "left-right",
      position: {
        x: 710,
        y: 260
      },
      ports: {
        in: {
          id: "in",
          type: "left"
        },
        out: {
          id: "out",
          type: "right"
        }
      }
    },
    node4: {
      id: "node4",
      type: "left-right",
      position: {
        x: 710,
        y: 400
      },
      ports: {
        in: {
          id: "in",
          type: "left"
        },
        out: {
          id: "out",
          type: "right"
        }
      }
    }
  },
  links: {
    link1: {
      id: "link1",
      from: {
        nodeId: "node1",
        portId: "out"
      },
      to: {
        nodeId: "node2",
        portId: "in"
      }
    },
    link2: {
      id: "link2",
      from: {
        nodeId: "node2",
        portId: "out"
      },
      to: {
        nodeId: "node3",
        portId: "in"
      }
    },
    link3: {
      id: "link3",
      from: {
        nodeId: "node2",
        portId: "out"
      },
      to: {
        nodeId: "node4",
        portId: "in"
      }
    }
  },
  selected: { type: "node", id: "node1" },
  selectedChild: {},
  rule: {
    nodes: {
      start: "node1",
      node1: {
        jobList: ["child1", "child2"],
        next: { default: "node2" }
      },
      node2: {
        jobList: ["child3"],
        next: { "01": "node3", "10": "node4" }
      },
      node3: {
        jobList: ["child4"],
        next: {}
      },
      node4: {
        jobList: ["child5", "child6"],
        next: {}
      }
    },
    children: {
      child1: {
        result: "child1",
        type: "calculator",
        info: {
          expression: "a+1",
          params: {
            a: "$.test"
          }
        }
      },
      child2: {
        result: "child2",
        type: "control_tag_message",
        info: { ctrlKey: "WMDownload" }
      },
      child3: {
        result: "child3",
        type: "branch",
        info: {
          condition: [
            {
              key: "$.device.type",
              value: "",
              exp: "null"
            },
            {
              key: "$.slots.function",
              value: "test1, test2",
              exp: "in"
            }
          ]
        }
      },
      child4: {
        result: "child4",
        source: "content_function",
        type: "database",
        info: {
          fields: ["response_template_code"],
          condition: [
            {
              key: "id",
              value: "$.slots.function",
              exp: "eq"
            },
            {
              key: "device_type",
              value: "$.device.type",
              exp: "eq"
            }
          ]
        }
      },
      child5: {
        result: "child5",
        type: "control_message",
        info: {
          required: ["soilWash", "temp"],
          ctrlKey: "WMDownload",
          code: {
            key: "course",
            value: "$.ic029.icw001.ctrl_template_code"
          }
        }
      },
      child6: {
        result: "child5",
        type: "random",
        info: {
          array: ["TEST1", "TEST2"]
        }
      }
    }
  }
};

function nodeItems(state = initialState, action) {
  switch (action.type) {
    case ADD_NODE:
      return applyAddNode(state, action);
    case SELECT_ITEM:
      return applySelectItem(state, action);
    case ADD_CHILD_NODE:
      return applyAddChildNode(state, action);
    case SELECT_CHILD_NODE:
      return applySelectChildNode(state, action);
    case EDIT_CHILD_NODE:
      return applyEditChildNode(state, action);
    default:
      return state;
  }
}

// Reducer Functions

function applyAddNode(state, action) {
  const nodes = state.nodes;
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
  };
  return {
    ...state,
    selected: selectedNode
  };
}

function applyAddChildNode(state, action) {
  const nodes = state.nodes;
  nodes[action.parentId].children.push({
    id: action.id,
    data: { type: action.itemType }
  });
  return state;
}

function applySelectChildNode(state, action) {
  const selectedChild = {
    id: action.id
  };
  return {
    ...state,
    selectedChild: selectedChild
  };
}

function applyEditChildNode(state, { parentId, id, data }) {
  const nodes = state.nodes;
  const target = nodes[parentId].children.find(obj => obj.id === id);
  target.data = data;
  return state;
}
// Exports
const actionCreators = {
  addNode,
  selectItem,
  addChildNode,
  selectChildNode,
  editChildNode
};
export { actionCreators };

// Default
export default nodeItems;
