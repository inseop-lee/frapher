import { cloneDeep } from "lodash";

// Actions
const ADD_NODE = "ADD_NODE";
const SELECT_ITEM = "SELECT_ITEM";
const ADD_CHILD_NODE = "ADD_CHILD";
const SELECT_CHILD_NODE = "SELECT_CHILD_NODE";
const EDIT_CHILD_NODE = "EDIT_CHILD_NODE";
const EDIT_NEXT_NODE = "EDIT_NEXT_NODE";
const DELETE_CHILD_NODE = "DELETE_CHILD_NODE";
const EDIT_NODE_ID = "EDIT_NODE_ID";
const DELETE_NODE = "DELETE_NODE";
const ADD_NEXT_NODE = "ADD_NEXT_NODE";
const DELETE_LINK = "DELETE_LINK";
const SET_INIT_RULE = "SET_INIT_RULE";
const UPDATE_RULE = "UPDATE_RULE";
const DELETE_NEXT_BRANCH = "DELETE_NEXT_BRANCH";
const EDIT_META = "EDIT_META";
const INIT_CHANGED = "INIT_CHANGED";

// Reducer
const initialState = {
  selected: { type: null, id: null },
  changed: false,
  meta: {},
  rule: {
    nodes: {
      start: "new_node_1",
      new_node_1: {
        jobList: [],
        next: {}
      }
    },
    children: {
      final_actions: {},
      jobs: {}
    }
  }
};

// Action Creators
function addNode(id, isFinal) {
  return {
    type: ADD_NODE,
    id,
    isFinal
  };
}

function selectItem(id, itemType) {
  return {
    type: SELECT_ITEM,
    id,
    itemType
  };
}

function addChildNode(parentId, id, data, isAction) {
  return {
    type: ADD_CHILD_NODE,
    parentId,
    id,
    data,
    isAction
  };
}

function editChildNode(parentId, id, data, isAction) {
  return {
    type: EDIT_CHILD_NODE,
    parentId,
    id,
    data,
    isAction
  };
}

function selectChildNode(parentId, id) {
  return {
    type: SELECT_CHILD_NODE,
    parentId,
    id
  };
}
function editNextNode(id, nextId, originalCondition, targetCondition) {
  return {
    type: EDIT_NEXT_NODE,
    id,
    nextId,
    originalCondition,
    targetCondition
  };
}
function deleteChildNode(parentId, id) {
  return {
    type: DELETE_CHILD_NODE,
    parentId,
    id
  };
}

function editNodeId(fromId, toId, isStart) {
  return {
    type: EDIT_NODE_ID,
    fromId,
    toId,
    isStart
  };
}
function deleteNode(id) {
  return {
    type: DELETE_NODE,
    id
  };
}
function addNextNode(fromId, toId, nextKey) {
  return {
    type: ADD_NEXT_NODE,
    fromId,
    toId,
    nextKey
  };
}

function deleteLink(fromId, toId) {
  return {
    type: DELETE_LINK,
    fromId,
    toId
  };
}

function setInitRule(rule = null, meta = null) {
  return {
    type: SET_INIT_RULE,
    rule,
    meta
  };
}

function updateRule(rule, meta) {
  return {
    type: UPDATE_RULE,
    rule,
    meta
  };
}

function deleteNextBranch(nodeId, condition) {
  return {
    type: DELETE_NEXT_BRANCH,
    nodeId,
    condition
  };
}

function editMeta(meta) {
  return {
    type: EDIT_META,
    meta
  };
}
function initChanged() {
  return {
    type: INIT_CHANGED
  };
}

function nodeItem(state = initialState, action) {
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
    case EDIT_NEXT_NODE:
      return applyEditNextNode(state, action);
    case DELETE_CHILD_NODE:
      return applyDeleteChildNode(state, action);
    case EDIT_NODE_ID:
      return applyEditNodeId(state, action);
    case DELETE_NODE:
      return applyDeleteNode(state, action);
    case ADD_NEXT_NODE:
      return applyAddNextNode(state, action);
    case DELETE_LINK:
      return applyDeleteLink(state, action);
    case SET_INIT_RULE:
      return applySetInitRule(state, action);
    case UPDATE_RULE:
      return applyUpdateRule(state, action);
    case DELETE_NEXT_BRANCH:
      return applyDeleteNextBranch(state, action);
    case EDIT_META:
      return applyEditMeta(state, action);
    case INIT_CHANGED:
      return applyInitChanged(state, action);
    default:
      return state;
  }
}

// Reducer Functions

function applyAddNode(state, { id, isFinal }) {
  const nodeData = isFinal ? { jobList: [] } : { jobList: [], next: {} };
  return {
    ...state,
    changed: true,
    rule: {
      ...state.rule,
      nodes: {
        ...state.rule.nodes,
        [id]: nodeData
      }
    }
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

function applyAddChildNode(state, { parentId, id, data, isAction }) {
  const jobList = state.rule.nodes[parentId].jobList.slice();
  jobList.push(id);

  const returnState = isAction
    ? {
        ...state,
        changed: true,
        rule: {
          ...state.rule,
          children: {
            ...state.rule.children,
            final_actions: {
              ...state.rule.children.final_actions,
              [parentId]: [data]
            }
          }
        }
      }
    : {
        ...state,
        changed: true,
        rule: {
          ...state.rule,
          nodes: {
            ...state.rule.nodes,
            [parentId]: {
              ...state.rule.nodes[parentId],
              jobList: jobList
            }
          },
          children: {
            ...state.rule.children,
            jobs: {
              ...state.rule.children.jobs,
              [id]: data
            }
          }
        }
      };

  return returnState;
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

function applyEditChildNode(state, { parentId, id, data, isAction }) {
  const returnState = isAction
    ? {
        ...state,
        changed: true,
        rule: {
          ...state.rule,
          children: {
            ...state.rule.children,
            final_actions: {
              ...state.rule.children.final_actions,
              [parentId]: [data]
            }
          }
        }
      }
    : {
        ...state,
        changed: true,
        rule: {
          ...state.rule,
          children: {
            ...state.rule.children,
            jobs: {
              ...state.rule.children.jobs,
              [id]: data
            }
          }
        }
      };
  return returnState;
}
function applyEditNextNode(
  state,
  { id, nextId, originalCondition, targetCondition }
) {
  const nextObj = cloneDeep(state.rule.nodes[id].next);
  delete nextObj[originalCondition];
  nextObj[targetCondition] = nextId;
  return {
    ...state,
    changed: true,
    rule: {
      ...state.rule,
      nodes: {
        ...state.rule.nodes,
        [id]: {
          ...state.rule.nodes[id],
          next: nextObj
        }
      }
    }
  };
}

function applyDeleteChildNode(state, { parentId, id }) {
  const jobList = state.rule.nodes[parentId].jobList.slice();
  jobList.splice(
    jobList.findIndex(item => item === id),
    1
  );
  const jobs = cloneDeep(state.rule.children.jobs);
  delete jobs[id];
  return {
    ...state,
    changed: true,
    rule: {
      ...state.rule,
      nodes: {
        ...state.rule.nodes,
        [parentId]: {
          ...state.rule.nodes[parentId],
          jobList: jobList
        }
      },
      children: {
        ...state.rule.children,
        jobs: jobs
      }
    }
  };
}

function applyEditNodeId(state, { fromId, toId, isStart }) {
  const nodes = cloneDeep(state.rule.nodes);
  nodes[toId] = nodes[fromId];
  delete nodes[fromId];
  nodes.start = isStart ? toId : nodes.start;
  for (const key in nodes) {
    if (nodes.hasOwnProperty(key)) {
      if (nodes[key].hasOwnProperty("next"))
        for (const next in nodes[key].next) {
          if (nodes[key].next[next] === fromId) {
            nodes[key].next[next] = toId;
          }
        }
    }
  }

  return {
    ...state,
    changed: true,
    rule: {
      ...state.rule,
      nodes: nodes
    }
  };
}

function applyDeleteNode(state, { id }) {
  const nodes = cloneDeep(state.rule.nodes);
  for (const key in nodes) {
    if (nodes.hasOwnProperty(key)) {
      if (nodes[key].hasOwnProperty("next"))
        for (const next in nodes[key].next) {
          if (nodes[key].next[next] === id) {
            delete nodes[key].next[next];
          }
        }
    }
  }

  delete nodes[id];
  return {
    ...state,
    selected: {},
    changed: true,
    rule: {
      ...state.rule,
      nodes: nodes
    }
  };
}

function applyAddNextNode(state, { fromId, toId, nextKey }) {
  return {
    ...state,
    changed: true,
    rule: {
      ...state.rule,
      nodes: {
        ...state.rule.nodes,
        [fromId]: {
          ...state.rule.nodes[fromId],
          next: {
            ...state.rule.nodes[fromId].next,
            [nextKey]: toId
          }
        }
      }
    }
  };
}

function applyDeleteLink(state, { fromId, toId }) {
  const nodes = cloneDeep(state.rule.nodes);
  if (nodes[fromId].next) {
    const targets = Object.entries(nodes[fromId].next).filter(
      element => element[1] === toId
    );
    for (const target of targets) {
      delete nodes[fromId].next[target[0]];
    }
  }
  return {
    ...state,
    changed: true,
    rule: {
      ...state.rule,
      nodes: nodes
    }
  };
}

function applySetInitRule(state, { rule, meta }) {
  if (!rule || !rule.nodes || !rule.nodes.start) {
    return {
      ...state,
      changed: false,
      init: {
        rule: {
          nodes: {
            start: "new_node_1",
            new_node_1: {
              jobList: [],
              next: {}
            }
          },
          children: { jobs: {}, final_actions: {} }
        },
        meta: meta
      }
    };
  }
  return {
    ...state,
    changed: !meta,
    init: {
      rule,
      meta: meta ? meta : state.meta
    }
  };
}

function applyUpdateRule(state, { rule, meta }) {
  return {
    ...state,
    selected: { type: null, id: null },
    rule: rule,
    meta: meta,
    init: null
  };
}

function applyDeleteNextBranch(state, { nodeId, condition }) {
  const node = cloneDeep(state.rule.nodes[nodeId]);
  delete node.next[condition];
  return {
    ...state,
    changed: true,
    rule: {
      ...state.rule,
      nodes: {
        ...state.rule.nodes,
        [nodeId]: node
      }
    }
  };
}

function applyEditMeta(state, { meta }) {
  return {
    ...state,
    changed: true,
    meta: meta
  };
}

function applyInitChanged(state, action) {
  return {
    ...state,
    changed: false
  };
}

// Exports
const actionCreators = {
  addNode,
  selectItem,
  addChildNode,
  selectChildNode,
  editChildNode,
  editNextNode,
  deleteChildNode,
  editNodeId,
  deleteNode,
  addNextNode,
  deleteLink,
  setInitRule,
  updateRule,
  deleteNextBranch,
  editMeta,
  initChanged
};
export { actionCreators };

// Default
export default nodeItem;
