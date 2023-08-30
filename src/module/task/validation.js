import Joi from "joi";
import { generalValidation } from "../../utils/validation.js";

export const add = {
  body: Joi.object({
    title: generalValidation.task.title.required(),
    description: generalValidation.task.description.required(),
    deadline: generalValidation.task.deadline.required(),
    assignTo: generalValidation.id.required(),
    token: generalValidation.token.required(),
  }).required(),
};

export const update = {
  body: Joi.object({
    title: generalValidation.task.title,
    description: generalValidation.task.description,
    deadline: generalValidation.task.deadline,
    assignTo: generalValidation.id,
    status: generalValidation.task.status,
    id: generalValidation.id.required(),
    token: generalValidation.token.required(),
  }).required(),
};
export const remove = {
  body: Joi.object({
    id: generalValidation.id.required(),
    token: generalValidation.token.required(),
  }).required(),
};

export const getAllTaskAssignToAnyOne = {
  body: Joi.object({
    id: generalValidation.id.required(),

    token: generalValidation.token.required(),
  }).required(),
};

export const validateToken = {
  body: Joi.object({
    token: generalValidation.token.required(),
  }).required(),
};
export const attachment = {
  body: Joi.object({
    id: generalValidation.id.required(),
    token: generalValidation.token.required(),
  }).required(),
};
