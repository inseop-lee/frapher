import { isEqual, cloneDeep } from "lodash";
export const JobType = {
  BRANCH: "branch",
  CALCULATOR: "calculator",
  CONTROL_MESSAGE: "control_message",
  CONTROL_TAG_MESSAGE: "control_tag_message",
  DATABASE: "database",
  HTTP: "http",
  RANDOM: "random",
  FEEDBACK: "feedback/response"
};

export function getChildDataSetById(nodeId, rule) {
  const children = rule.nodes[nodeId].jobList;
  const filtered = Object.keys(rule.children)
    .filter(key => children.includes(key))
    .reduce((obj, key) => {
      obj[key] = rule.children[key];
      return obj;
    }, {});
  return filtered;
}

export function hasBranchChild(nodeId, rule) {
  const children = rule.nodes[nodeId].jobList;
  const hasBranch =
    children
      .map(id => rule.children[id].type)
      .find(obj => obj === JobType.BRANCH) === JobType.BRANCH;
  return hasBranch;
}

export const linkId = (from, to) => from + "-" + to;
export const PROC_START = "start";

const [NODE_WIDTH, NODE_HEIGHT] = [250, 250];

function traverse(graph, prev, id, x, y, depth) {
  //init graph
  graph.state = graph.state ? graph.state : {loopCheck:{},spaceBefore:{},deepest:0};

  const setItems = (s, d, x, y, p) => {
    graph[id].space = s;
    graph[id].depth = d;
    graph[id].x = x;
    graph[id].y = y;
    graph.state.spaceBefore[d] = graph.state.spaceBefore[d] ? graph.state.spaceBefore[d] + s : s;
    graph[id].prev = p;
  };

  graph.state.deepest = depth > graph.state.deepest ? depth : graph.state.deepest;

  if (graph.state.loopCheck[id]) {
    return { graph, space: 0, x, y, depth };
  }

  graph.state.loopCheck[id] = true;
  let spaceBefore = graph.state.spaceBefore[depth] ? graph.state.spaceBefore[depth] : 0;


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

  spaceBefore = graph.state.spaceBefore[depth] ? graph.state.spaceBefore[depth] : 0;
  const [resX, resY] = [
    spaceBefore * NODE_WIDTH + (NODE_WIDTH * sumSpace) / 2,
    y + NODE_HEIGHT * depth
  ];
  setItems(sumSpace, depth, resX, resY, prev);
  return { graph, space: sumSpace, x, y, depth };
}

export function initChart(nodes) {
  const nodesTmp = cloneDeep(nodes)
  const rootNode = nodesTmp[PROC_START]
  delete nodesTmp[PROC_START]
  const { graph } = traverse(cloneDeep(nodesTmp),null,rootNode,0,50,0,0);
  const depth = graph.state.deepest;
  const lastDepthNodes = Object.entries(graph)
    .map(([key, data]) => (data.depth === depth ? key : false))
    .filter(item => item);
  const prev = graph[lastDepthNodes[0]].prev;
  const prevX = prev ? graph[prev].x : 0;
  lastDepthNodes.map((id, index) => {
    graph[id].x =
      prevX + (index - (lastDepthNodes.length - 1) / 2) * NODE_WIDTH;
    return null;
  });

  delete graph.state

  const result = { nodes: {}, links: {} };

  Object.keys(graph).forEach(function(key, idx) {
    result.nodes[key] = initNode(graph[key], key);
    for (const nextId of Object.values(graph[key].next)) {
      result.links[linkId(key, nextId)] = initLink(key, nextId);
    }
  });

  return result;
}

function initNode(node, id) {
  const result = {
    id: id,
    type: "input-output",
    position: {
      x: node.x,
      y: node.y
    },
    ports: {
    }
  };
  if (node.prev) result.ports.in = { id: "in", type: "top" };
  if (node.next) result.ports.out = { id: "out", type: "bottom" };
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