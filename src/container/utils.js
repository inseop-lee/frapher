import { isEqual, cloneDeep } from "lodash";
import { JobType, ActionType, NodePort } from "./constants";

import dagre from "dagre";

export const MinimalChildData = {
  [JobType.BRANCH]: {
    result: "",
    type: JobType.BRANCH,
    info: {
      condition: [
        {
          key: "",
          value: "",
          exp: "eq"
        }
      ]
    }
  },
  [JobType.CALCULATOR]: {
    result: "",
    type: JobType.CALCULATOR,
    info: {
      expression: "",
      params: {}
    }
  },
  [JobType.CONTROL_MESSAGE]: {
    result: "",
    type: JobType.CONTROL_MESSAGE,
    info: {
      ctrlKey: "",
      code: {
        key: "",
        value: ""
      }
    }
  },
  [JobType.CONTROL_TAG_MESSAGE]: {
    result: "",
    type: JobType.CONTROL_TAG_MESSAGE,
    info: {
      ctrlKey: ""
    }
  },
  [JobType.DATABASE]: {
    result: "",
    source: "",
    type: JobType.DATABASE,
    info: {
      fields: [""],
      condition: [
        {
          key: "",
          value: "",
          exp: "eq"
        }
      ]
    }
  },
  [JobType.HTTP]: {
    result: "",
    source: "device/snapshot",
    type: JobType.HTTP,
    info: {
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Accept: "application/json",
        "x-country-code": "$.countryCode",
        "x-service-phase": "$.servicePhase",
        "x-api-key": "VGhpblEyLjAgU0VSVklDRQ",
        "x-message-id": "$.messageId"
      }
    }
  },
  [JobType.RANDOM]: {
    result: "",
    type: JobType.RANDOM,
    info: {
      array: [""]
    }
  },
  [ActionType.FEEDBACK]: {
    type: ActionType.FEEDBACK,
    message: [{ code: "" }]
  },
  [ActionType.CTRL_TAG]: {
    type: ActionType.CTRL_TAG,
    message: [
      {
        class: "",
        ctrl_key: "",
        code: "",
        device_id: "",
        param: {}
      }
    ],
    feedback_list: [
      {
        type: ActionType.FEEDBACK,
        message: [{ code: "" }]
      }
    ]
  },
  [ActionType.CTRL_ASYNC]: {
    type: ActionType.CTRL_ASYNC,
    message: [
      {
        class: "",
        ctrl_key: "",
        code: "",
        device_id: "",
        param: {}
      }
    ],
    feedback_list: [
      {
        type: ActionType.FEEDBACK,
        message: [{ code: "" }]
      }
    ]
  }
};

export function getNewNodeName(rule) {
  let nodeNamePrefix = "new-node-";
  let count = 1;
  while (rule.nodes[nodeNamePrefix + count]) count += 1;

  return nodeNamePrefix + count;
}

export function getBranchCondition(rule, nodeId) {
  let branchCondition;
  const node = rule.nodes[nodeId];
  node.jobList.forEach(id => {
    if (rule.children.jobs[id].type === JobType.BRANCH) {
      branchCondition = rule.children.jobs[id].info.condition;
      return;
    }
  });
  return branchCondition ? branchCondition : [];
}

export function getChildDataSetById(nodeId, rule) {
  if (!rule.nodes[nodeId]) return {};
  if (!rule.nodes[nodeId].next) return rule.children.final_actions[nodeId];
  const children = rule.nodes[nodeId].jobList;
  const filtered = Object.keys(rule.children.jobs)
    .filter(key => children.includes(key))
    .reduce((obj, key) => {
      obj[key] = rule.children.jobs[key];
      return obj;
    }, {});
  return filtered;
}

export function hasNode(nodeId, rule) {
  return rule.nodes[nodeId] ? true : false;
}

export function hasBranchChild(nodeId, rule) {
  const children = rule.nodes[nodeId].jobList;
  const hasBranch =
    children
      .map(id => rule.children.jobs[id].type)
      .find(obj => obj === JobType.BRANCH) === JobType.BRANCH;
  return hasBranch;
}

export const linkId = (from, to) => from + "-" + to;
export const PROC_START = "start";

const [NODE_WIDTH, NODE_HEIGHT] = [250, 250];

function traverse(graph, prev, id, x, y, depth) {
  //init graph
  graph.state = graph.state
    ? graph.state
    : { loopCheck: {}, spaceBefore: {}, deepest: 0 };

  const setItems = (s, d, x, y, p) => {
    graph[id].space = s;
    graph[id].depth = d;
    graph[id].x = x;
    graph[id].y = y;
    graph.state.spaceBefore[d] = graph.state.spaceBefore[d]
      ? graph.state.spaceBefore[d] + s
      : s;
    graph[id].prev = p;
  };

  graph.state.deepest =
    depth > graph.state.deepest ? depth : graph.state.deepest;

  if (graph.state.loopCheck[id]) {
    return { graph, space: 0, x, y, depth };
  }

  graph.state.loopCheck[id] = true;
  let spaceBefore = graph.state.spaceBefore[depth]
    ? graph.state.spaceBefore[depth]
    : 0;

  if (isEqual(graph[id].next, {}) || !graph[id].next) {
    const [resX, resY] = [
      spaceBefore * NODE_WIDTH + NODE_WIDTH / 2,
      y + NODE_HEIGHT * depth
    ];
    setItems(1, depth, resX, resY, prev);
    return { graph, space: 1, x, y, depth };
  }

  //traverse nexts
  let sumSpace = 0;
  for (const nextId of Object.values(graph[id].next)) {
    sumSpace += traverse(graph, id, nextId, x, y, depth + 1).space;
  }

  spaceBefore = graph.state.spaceBefore[depth]
    ? graph.state.spaceBefore[depth]
    : 0;
  const [resX, resY] = [
    spaceBefore * NODE_WIDTH + (NODE_WIDTH * sumSpace) / 2,
    y + NODE_HEIGHT * depth
  ];
  setItems(sumSpace, depth, resX, resY, prev);
  return { graph, space: sumSpace, x, y, depth };
}
export function initChart(nodes) {
  const nodesTmp = cloneDeep(nodes);
  const rootNode = nodesTmp[PROC_START];
  delete nodesTmp[PROC_START];
  const g = new dagre.graphlib.Graph();
  g.setGraph({});
  g.setDefaultEdgeLabel(function() {
    return {};
  });

  const widthMap = {};
  const heightMap = {};
  const nodesTmpList = Object.entries(nodesTmp).sort((a, b) => {
    if (a[1].next) {
      if (!b[1].next) return -1;
      else
        return Object.keys(a[1].next).length < Object.keys(b[1].next).length
          ? 1
          : -1;
    } else {
      if (b[1].next) return 1;
      else return 0;
    }
  });

  console.log(nodesTmpList);

  for (const [nodeId, item] of nodesTmpList) {
    console.log(nodeId, item);
    const next = nodesTmp[nodeId].next;
    widthMap[nodeId] = 270;
    heightMap[nodeId] = next ? 100 : 50;
    g.setNode(nodeId, { width: widthMap[nodeId], height: heightMap[nodeId] });
    if (next) {
      for (const nextKey in next) {
        const nextId = next[nextKey];
        g.setEdge(nodeId, nextId);
      }
    }
  }
  g.graph().rankDir = "LR";
  g.graph().marginx = 50;
  g.graph().marginy = 50;
  g.graph().align = "UL";
  dagre.layout(g);

  const chart = { nodes: {}, links: {} };
  for (const nodeId in nodesTmp) {
    const next = nodesTmp[nodeId].next;
    const x = g.node(nodeId).x - widthMap[nodeId] / 2;
    const y = g.node(nodeId).y - heightMap[nodeId] / 2;
    chart.nodes[nodeId] = initNode(nodeId, x, y, nodeId === rootNode, !next);
    if (next) {
      for (const nextId of Object.values(next)) {
        chart.links[linkId(nodeId, nextId)] = initLink(nodeId, nextId);
      }
    }
  }

  return chart;
}

function initNode(id, x, y, isStart, isFinal) {
  const result = {
    id: id,
    type: "input-output",
    position: { x, y },
    ports: {}
  };
  if (!isStart) result.ports[NodePort.IN] = { id: NodePort.IN, type: "left" };
  if (!isFinal)
    result.ports[NodePort.OUT] = { id: NodePort.OUT, type: "right" };
  return result;
}

function initLink(from, to) {
  const result = {
    id: linkId(from, to),
    from: {
      nodeId: from,
      portId: "out"
    },
    to: {
      nodeId: to,
      portId: "in"
    }
  };
  return result;
}

export function getTypeVariant(type) {
  return Object.values(ActionType).find(item => item === type)
    ? "success"
    : "info";
}
