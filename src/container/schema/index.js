import job from "./job_schema.json";
import action from "./action_schema.json";
import processors from "./processors_schema.json";

export const jobsSchema = {
  type: "object",
  additionalProperties: job
};

export const processorsSchema = processors;

export const finalActionsSchema = {
  type: "object",
  additionalProperties: {
    type: "array",
    items: action
  }
};

export { job, action };
