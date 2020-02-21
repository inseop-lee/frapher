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

// Reducer
const initialState = {
  selected: { type: "node", id: "node1" },
  rule: {
    nodes: {
      start: "c001",
      c001: {
        jobList: ["ctm001"],
        next: {
          default: "b001"
        }
      },
      b001: {
        jobList: ["bs001"],
        next: {
          "00000": "error_invalid_capacity",
          "00001": "error_continuous",
          "00010": "c1000",
          "00100": "c500",
          "01000": "c120",
          "10000": "cw001"
        }
      },
      cw001: {
        jobList: ["cw001"],
        next: {
          default: "bs002"
        }
      },
      bs002: {
        jobList: ["bs002"],
        next: {
          "0": "bs003",
          "1": "error_no_user"
        }
      },
      bs003: {
        jobList: ["bs003"],
        next: {
          "100100": "cc120",
          "100010": "cc500",
          "100001": "cc1000",
          "010100": "cn120",
          "010010": "cn500",
          "010001": "cn1000",
          "001100": "error_hot",
          "001010": "error_hot",
          "001001": "error_hot"
        }
      },
      cc120: {
        jobList: []
      },
      cc500: {
        jobList: []
      },
      cc1000: {
        jobList: []
      },
      cn120: {
        jobList: []
      },
      cn500: {
        jobList: []
      },
      cn1000: {
        jobList: []
      },
      c120: {
        jobList: []
      },
      c500: {
        jobList: []
      },
      c1000: {
        jobList: []
      },
      error_invalid_capacity: {
        jobList: []
      },
      error_continuous: {
        jobList: []
      },
      error_hot: {
        jobList: []
      },
      error_no_user: {
        jobList: []
      }
    },
    children: {
      final_actions: {
        cc120: [
          {
            type: "ctrl/tag",
            message: [
              {
                class: "WP",
                ctrl_key: "waterDispenseStart",
                code: "waterDispenseStart",
                param: {
                  waterSelection: "COLD_WATER",
                  waterAmountMode: 1
                },
                device_id: "$.device.id"
              }
            ],
            feedback_list: {
              SUCCESS: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_DISPENSE_COLD_120ML"
                  }
                ]
              },
              FAIL_WP_SPECIAL_MODE: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_SPECIAL_MODE"
                  }
                ]
              },
              FAIL_ERROR: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_ERROR"
                  }
                ]
              },
              FAIL_SAME_VALUE: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_DISPENSE_ALREADY"
                  }
                ]
              },
              FAIL_CTRL_0106: {
                type: "feedback/response",
                message: [
                  {
                    code: "External/Error/Network"
                  }
                ]
              }
            }
          }
        ],
        cc500: [
          {
            type: "ctrl/tag",
            message: [
              {
                class: "WP",
                ctrl_key: "waterDispenseStart",
                code: "waterDispenseStart",
                param: {
                  waterSelection: "COLD_WATER",
                  waterAmountMode: 2
                },
                device_id: "$.device.id"
              }
            ],
            feedback_list: {
              SUCCESS: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_DISPENSE_COLD_500ML"
                  }
                ]
              },
              FAIL_WP_SPECIAL_MODE: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_SPECIAL_MODE"
                  }
                ]
              },
              FAIL_ERROR: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_ERROR"
                  }
                ]
              },
              FAIL_SAME_VALUE: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_DISPENSE_ALREADY"
                  }
                ]
              },
              FAIL_CTRL_0106: {
                type: "feedback/response",
                message: [
                  {
                    code: "External/Error/Network"
                  }
                ]
              }
            }
          }
        ],
        cc1000: [
          {
            type: "ctrl/tag",
            message: [
              {
                class: "WP",
                ctrl_key: "waterDispenseStart",
                code: "waterDispenseStart",
                param: {
                  waterSelection: "COLD_WATER",
                  waterAmountMode: 3
                },
                device_id: "$.device.id"
              }
            ],
            feedback_list: {
              SUCCESS: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_DISPENSE_COLD_1000ML"
                  }
                ]
              },
              FAIL_WP_SPECIAL_MODE: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_SPECIAL_MODE"
                  }
                ]
              },
              FAIL_ERROR: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_ERROR"
                  }
                ]
              },
              FAIL_SAME_VALUE: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_DISPENSE_ALREADY"
                  }
                ]
              },
              FAIL_CTRL_0106: {
                type: "feedback/response",
                message: [
                  {
                    code: "External/Error/Network"
                  }
                ]
              }
            }
          }
        ],
        cn120: [
          {
            type: "ctrl/tag",
            message: [
              {
                class: "WP",
                ctrl_key: "waterDispenseStart",
                code: "waterDispenseStart",
                param: {
                  waterSelection: "NORMAL_WATER",
                  waterAmountMode: 1
                },
                device_id: "$.device.id"
              }
            ],
            feedback_list: {
              SUCCESS: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_DISPENSE_NORMAL_120ML"
                  }
                ]
              },
              FAIL_WP_SPECIAL_MODE: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_SPECIAL_MODE"
                  }
                ]
              },
              FAIL_ERROR: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_ERROR"
                  }
                ]
              },
              FAIL_SAME_VALUE: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_DISPENSE_ALREADY"
                  }
                ]
              },
              FAIL_CTRL_0106: {
                type: "feedback/response",
                message: [
                  {
                    code: "External/Error/Network"
                  }
                ]
              }
            }
          }
        ],
        cn500: [
          {
            type: "ctrl/tag",
            message: [
              {
                class: "WP",
                ctrl_key: "waterDispenseStart",
                code: "waterDispenseStart",
                param: {
                  waterSelection: "NORMAL_WATER",
                  waterAmountMode: 2
                },
                device_id: "$.device.id"
              }
            ],
            feedback_list: {
              SUCCESS: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_DISPENSE_NORMAL_500ML"
                  }
                ]
              },
              FAIL_WP_SPECIAL_MODE: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_SPECIAL_MODE"
                  }
                ]
              },
              FAIL_ERROR: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_ERROR"
                  }
                ]
              },
              FAIL_SAME_VALUE: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_DISPENSE_ALREADY"
                  }
                ]
              },
              FAIL_CTRL_0106: {
                type: "feedback/response",
                message: [
                  {
                    code: "External/Error/Network"
                  }
                ]
              }
            }
          }
        ],
        cn1000: [
          {
            type: "ctrl/tag",
            message: [
              {
                class: "WP",
                ctrl_key: "waterDispenseStart",
                code: "waterDispenseStart",
                param: {
                  waterSelection: "NORMAL_WATER",
                  waterAmountMode: 3
                },
                device_id: "$.device.id"
              }
            ],
            feedback_list: {
              SUCCESS: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_DISPENSE_NORMAL_1000ML"
                  }
                ]
              },
              FAIL_WP_SPECIAL_MODE: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_SPECIAL_MODE"
                  }
                ]
              },
              FAIL_ERROR: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_ERROR"
                  }
                ]
              },
              FAIL_SAME_VALUE: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_DISPENSE_ALREADY"
                  }
                ]
              },
              FAIL_CTRL_0106: {
                type: "feedback/response",
                message: [
                  {
                    code: "External/Error/Network"
                  }
                ]
              }
            }
          }
        ],
        c120: [
          {
            type: "ctrl/tag",
            message: [
              {
                class: "WP",
                ctrl_key: "waterDispenseStart",
                code: "waterDispenseStart",
                param: {
                  waterSelection: "",
                  waterAmountMode: "1"
                },
                device_id: "$.device.id"
              }
            ],
            feedback_list: {
              SUCCESS_WP_COLD_120ML: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_DISPENSE_COLD_120ML"
                  }
                ]
              },
              SUCCESS_WP_COLD_500ML: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_DISPENSE_COLD_500ML"
                  }
                ]
              },
              SUCCESS_WP_COLD_1000ML: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_DISPENSE_COLD_1000ML"
                  }
                ]
              },
              SUCCESS_WP_NORMAL_120ML: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_DISPENSE_NORMAL_120ML"
                  }
                ]
              },
              SUCCESS_WP_NORMAL_500ML: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_DISPENSE_NORMAL_500ML"
                  }
                ]
              },
              SUCCESS_WP_NORMAL_1000ML: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_DISPENSE_NORMAL_1000ML"
                  }
                ]
              },
              FAIL_WP_ONEMORE_TIMEOUT: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_DISPENSE_MORE_1MIN"
                  }
                ]
              },
              FAIL_WP_SPECIAL_MODE: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_SPECIAL_MODE"
                  }
                ]
              },
              FAIL_ERROR: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_ERROR"
                  }
                ]
              },
              FAIL_SAME_VALUE: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_DISPENSE_ALREADY"
                  }
                ]
              },
              FAIL_CTRL_0106: {
                type: "feedback/response",
                message: [
                  {
                    code: "External/Error/Network"
                  }
                ]
              }
            }
          }
        ],
        c500: [
          {
            type: "ctrl/tag",
            message: [
              {
                class: "WP",
                ctrl_key: "waterDispenseStart",
                code: "waterDispenseStart",
                param: {
                  waterSelection: "",
                  waterAmountMode: "2"
                },
                device_id: "$.device.id"
              }
            ],
            feedback_list: {
              SUCCESS_WP_COLD_120ML: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_DISPENSE_COLD_120ML"
                  }
                ]
              },
              SUCCESS_WP_COLD_500ML: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_DISPENSE_COLD_500ML"
                  }
                ]
              },
              SUCCESS_WP_COLD_1000ML: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_DISPENSE_COLD_1000ML"
                  }
                ]
              },
              SUCCESS_WP_NORMAL_120ML: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_DISPENSE_NORMAL_120ML"
                  }
                ]
              },
              SUCCESS_WP_NORMAL_500ML: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_DISPENSE_NORMAL_500ML"
                  }
                ]
              },
              SUCCESS_WP_NORMAL_1000ML: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_DISPENSE_NORMAL_1000ML"
                  }
                ]
              },
              FAIL_WP_ONEMORE_TIMEOUT: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_DISPENSE_MORE_1MIN"
                  }
                ]
              },
              FAIL_WP_SPECIAL_MODE: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_SPECIAL_MODE"
                  }
                ]
              },
              FAIL_ERROR: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_ERROR"
                  }
                ]
              },
              FAIL_SAME_VALUE: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_DISPENSE_ALREADY"
                  }
                ]
              },
              FAIL_CTRL_0106: {
                type: "feedback/response",
                message: [
                  {
                    code: "External/Error/Network"
                  }
                ]
              }
            }
          }
        ],
        c1000: [
          {
            type: "ctrl/tag",
            message: [
              {
                class: "WP",
                ctrl_key: "waterDispenseStart",
                code: "waterDispenseStart",
                param: {
                  waterSelection: "",
                  waterAmountMode: "3"
                },
                device_id: "$.device.id"
              }
            ],
            feedback_list: {
              SUCCESS_WP_COLD_120ML: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_DISPENSE_COLD_120ML"
                  }
                ]
              },
              SUCCESS_WP_COLD_500ML: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_DISPENSE_COLD_500ML"
                  }
                ]
              },
              SUCCESS_WP_COLD_1000ML: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_DISPENSE_COLD_1000ML"
                  }
                ]
              },
              SUCCESS_WP_NORMAL_120ML: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_DISPENSE_NORMAL_120ML"
                  }
                ]
              },
              SUCCESS_WP_NORMAL_500ML: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_DISPENSE_NORMAL_500ML"
                  }
                ]
              },
              SUCCESS_WP_NORMAL_1000ML: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_DISPENSE_NORMAL_1000ML"
                  }
                ]
              },
              FAIL_WP_ONEMORE_TIMEOUT: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_DISPENSE_MORE_1MIN"
                  }
                ]
              },
              FAIL_WP_SPECIAL_MODE: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_SPECIAL_MODE"
                  }
                ]
              },
              FAIL_ERROR: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_ERROR"
                  }
                ]
              },
              FAIL_SAME_VALUE: {
                type: "feedback/response",
                message: [
                  {
                    code: "WP_CTRL_DISPENSE_ALREADY"
                  }
                ]
              },
              FAIL_CTRL_0106: {
                type: "feedback/response",
                message: [
                  {
                    code: "External/Error/Network"
                  }
                ]
              }
            }
          }
        ],
        error_continuous: [
          {
            type: "feedback/response",
            message: [
              {
                code: "WP_CTRL_DISPENSE_CONTINUOUS"
              }
            ]
          }
        ],
        error_invalid_capacity: [
          {
            type: "feedback/response",
            message: [
              {
                code: "WP_CTRL_DISPENSE_INVALID_CAPACITY"
              }
            ]
          }
        ],
        error_hot: [
          {
            type: "feedback/response",
            message: [
              {
                code: "WP_CTRL_DISPENSE_HOT_WATER"
              }
            ]
          }
        ],
        error_no_user: [
          {
            type: "feedback/response",
            message: [
              {
                code: "WP_CTRL_DISPENSE_NO_USER"
              }
            ]
          }
        ]
      },
      jobs: {
        ctm001: {
          result: "ctm001",
          type: "control_tag_message",
          info: {
            ctrlKey: "waterDispenseStart"
          }
        },
        bs001: {
          result: "bs001",
          type: "branch",
          info: {
            condition: [
              {
                key: "$.slots.capacity",
                value: "default",
                exp: "eq"
              },
              {
                key: "$.slots.capacity",
                value: "120",
                exp: "eq"
              },
              {
                key: "$.slots.capacity",
                value: "500",
                exp: "eq"
              },
              {
                key: "$.slots.capacity",
                value: "1000",
                exp: "eq"
              },
              {
                key: "$.slots.capacity",
                value: "continuous",
                exp: "eq"
              }
            ]
          }
        },
        cw001: {
          result: "cw001",
          source: "custom",
          type: "http",
          info: {
            url: {
              path:
                "/v1/backend/livingai/devices/{deviceId}/custom-water-request",
              parameter: {
                deviceId: "$.device.id"
              }
            },
            domain: "kic-st-service.lgthinq.com",
            method: "GET",
            port: "46030",
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
              Accept: "application/json",
              "x-country-code": "$.countryCode",
              "x-service-phase": "$.servicePhase",
              "x-api-key": "VGhpblEyLjAgU0VSVklDRQ==",
              "x-message-id": "$.messageId"
            },
            parameters: {
              specifierCode: "$.slots.user"
            }
          }
        },
        bs002: {
          result: "bs002",
          type: "branch",
          info: {
            condition: [
              {
                key: "$.cw001.cw001.result.waterType",
                value: "",
                exp: "null"
              }
            ]
          }
        },
        bs003: {
          result: "bs003",
          type: "branch",
          info: {
            condition: [
              {
                key: "$.cw001.cw001.result.waterType",
                value: "cold",
                exp: "eq"
              },
              {
                key: "$.cw001.cw001.result.waterType",
                value: "normal",
                exp: "eq"
              },
              {
                key: "$.cw001.cw001.result.waterType",
                value: "hot",
                exp: "eq"
              },
              {
                key: "$.cw001.cw001.result.waterRequestAmount",
                value: "120",
                exp: "eq"
              },
              {
                key: "$.cw001.cw001.result.waterRequestAmount",
                value: "500",
                exp: "eq"
              },
              {
                key: "$.cw001.cw001.result.waterRequestAmount",
                value: "1000",
                exp: "eq"
              }
            ]
          }
        }
      }
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
function editNextNode(id, nextId, condition) {
  return {
    type: EDIT_NEXT_NODE,
    id,
    nextId,
    condition
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
    default:
      return state;
  }
}

// Reducer Functions

function applyAddNode(state, { id, isFinal }) {
  const nodeData = isFinal ? { jobList: [] } : { jobList: [], next: {} };
  return {
    ...state,
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
function applyEditNextNode(state, { id, nextId, condition }) {
  console.log(id, nextId, condition);
  const nextObj = cloneDeep(state.rule.nodes[id].next);
  const origin = Object.entries(nextObj).find(
    ([key, value]) => value === nextId
  );
  if (!origin) {
    return state;
  }
  delete nextObj[origin[0]];
  nextObj[condition] = nextId;
  return {
    ...state,
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
    rule: {
      ...state.rule,
      nodes: nodes
    }
  };
}

function applyAddNextNode(state, { fromId, toId, nextKey }) {
  return {
    ...state,
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
    const target = Object.entries(nodes[fromId].next).find(
      element => element[1] === toId
    );
    if (target) {
      delete nodes[fromId].next[target[0]];
    }
  }
  return {
    ...state,
    rule: {
      ...state.rule,
      nodes: nodes
    }
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
  deleteLink
};
export { actionCreators };

// Default
export default nodeItem;
