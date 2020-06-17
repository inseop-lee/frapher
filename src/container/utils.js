import { cloneDeep } from "lodash";
import { JobType, ActionType, NodePort } from "./constants";
import Ajv from "ajv";
import dagre from "dagre";
import { jobsSchema, processorsSchema, finalActionsSchema } from "./schema";

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
  let nodeNamePrefix = "new_node_";
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

export const PROC_START = "start";

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

  for (const item of nodesTmpList) {
    const nodeId = item[0];
    const next = nodesTmp[nodeId].next;
    widthMap[nodeId] = 270;
    heightMap[nodeId] = next ? 100 : 76;
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
        const linkId = uuidv4();
        chart.links[linkId] = initLink(nodeId, nextId, linkId);
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

function initLink(from, to, linkId) {
  const result = {
    id: linkId,
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

export function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function schemaValidate(title, schema, data) {
  const ajv = new Ajv();
  if (!ajv.validate(schema, data)) {
    const error = ajv.errorsText().replace(/, /gi, "\n");
    throw Error(`Schema Error(${title}) -\n${error}`);
  }
  return null;
}

export function validate(jobs, processors, final_actions) {
  schemaValidate("Jobs", jobsSchema, jobs);
  schemaValidate("Processors", processorsSchema, processors);
  schemaValidate("Final Actions", finalActionsSchema, final_actions);

  const data = cloneDeep(processors);
  if (!data[data.start])
    throw Error(`Integration Error -\nStart "${data.start}" is not exists.`);
  delete data.start;

  for (const pId in data) {
    data[pId].jobList.forEach(job => {
      if (!jobs[job])
        throw Error(
          `Integration Error -\nThe job "${job}" in "${pId}" is not exists.`
        );
    });

    if (data[pId].next) {
      Object.values(data[pId].next).forEach(next => {
        if (!data[next])
          throw Error(
            `Integration Error -\nThe next property "${next}" in "${pId}" is not exists.`
          );
      });
    } else {
      if (!final_actions[pId]) {
        throw Error(
          `Integration Error -\nThere is no Final Action as "${pId}"`
        );
      }
    }
  }
}
