import { isEqual } from "lodash";
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
export const PROC_START = "start";

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

const [NODE_WIDTH, NODE_HEIGHT] = [10, 10];

function traverse(graph, parent, id, x, y, depth) {
    const setItems = (s, d, x, y) => {
      graph[id].space = s;
      graph[id].depth = d;
      graph[id].x = x;
      graph[id].y = y;
      graph.spaceBefore[d] = graph.spaceBefore[d] ? graph.spaceBefore[d] + s : s;
    };
  
    graph.deepest = graph.deepest? graph.deepest:0
    graph.deepest = depth > graph.deepest? depth : graph.deepest
    graph.loopCheck = !graph.loopCheck ? {} : graph.loopCheck;
    graph.spaceBefore = !graph.spaceBefore ? {} : graph.spaceBefore;
  
    if (graph.loopCheck[id]) {
      return { graph, space: 0, x, y, depth };
    }
  
    graph.loopCheck[id] = true;
    let spaceBefore = graph.spaceBefore[depth] ? graph.spaceBefore[depth] : 0;
  
    if (isEqual(graph[id].next, {}) || !graph[id].next) {
      setItems(
        1,
        depth,
        spaceBefore * NODE_WIDTH + NODE_WIDTH / 2,
        NODE_HEIGHT * depth
      );
      graph[id].parent = parent;
      return { graph, space: 1, x, y, depth };
    }
  
    let sumSpace = 0;
    for (const nextId of Object.values(graph[id].next)) {
      sumSpace += traverse(graph, id, nextId, x, y, depth + 1).space;
    }
  
    spaceBefore = graph.spaceBefore[depth] ? graph.spaceBefore[depth] : 0;
    setItems(
      sumSpace,
      depth,
      spaceBefore * NODE_WIDTH + (NODE_WIDTH * sumSpace) / 2,
      NODE_HEIGHT * depth
    );
    graph[id].parent = parent;
  
    return { graph, space: sumSpace, x, y, depth };
  }

  export function makePosition(rule) {
    const { graph } = traverse(rule.nodes, null, rule.nodes[PROC_START], 0, 0, 0,0);
    const depth = graph.deepest
    const lastDepthNodes = Object.entries(rule.nodes).map(
        ([key, data]) => (
          data.depth === depth ? key:false
      ))
      .filter(item=>item);
    const parent = graph[lastDepthNodes[0]].parent
    const parentX = parent ? graph[parent].x : 0
    lastDepthNodes.map((id,index) => {
      graph[id].x = parentX + (index - (lastDepthNodes.length-1)/2) * NODE_WIDTH
      return null
    })
    return graph
  }
