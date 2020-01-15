
export const JobType = {
     BRANCH:"branch",
     CALCULATOR:"calculator",
     CONTROL_MESSAGE: "control_message",
     CONTROL_TAG_MESSAGE: "control_tag_message",
     DATABASE: "database",
     HTTP: "http",
     RANDOM: "random",
     FEEDBACK: "feedback/response"
    }
export const PROC_START = "start";

export function getChildDataSetById(nodeId,rule) {
    const children = rule.nodes[nodeId].jobList;
    const filtered = Object.keys(rule.children)
    .filter(key => children.includes(key))
    .reduce((obj, key) => {
        obj[key] = rule.children[key];
        return obj;
    }, {});
    return filtered;
}

export function hasBranchChild(nodeId,rule) {
    const children = rule.nodes[nodeId].jobList
    const hasBranch = children
    .map(id=>rule.children[id].type)
    .find(obj=>obj===JobType.BRANCH) === JobType.BRANCH
    return hasBranch;
}

export function nextPosition(currentPosition,numOfNextNode) {
    let {x,y} = currentPosition;
    x += 270
}