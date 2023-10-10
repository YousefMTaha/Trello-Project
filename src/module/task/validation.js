import Joi from "joi";
import { generalValidation } from "../../utils/validation.js";

export const add = {
  body: Joi.object({
    title: generalValidation.task.title.required(),
    description: generalValidation.task.description.required(),
    deadline: generalValidation.task.deadline.required(),
    assignTo: generalValidation.id.required(),
  }).required(),
  params: Joi.object({}).required(),
  query: Joi.object({}).required(),
};

export const update = {
  body: Joi.object({
    title: generalValidation.task.title,
    description: generalValidation.task.description,
    deadline: generalValidation.task.deadline,
    assignTo: generalValidation.id,
    status: generalValidation.task.status,
  }).required(),
  params: Joi.object({
    id: generalValidation.id.required(),
  }).required(),
  query: Joi.object({}).required(),
};
export const remove = {
  body: Joi.object({}).required(),
  params: Joi.object({
    id: generalValidation.id.required(),
  }).required(),
  query: Joi.object({}).required(),
};

export const getAllTaskAssignToAnyOne = {
  body: Joi.object({}).required(),
  params: Joi.object({
    id: generalValidation.id.required(),
  }).required(),
  query: Joi.object({}).required(),
};

export const general = {
  body: Joi.object({}).required(),
  params: Joi.object({}).required(),
  query: Joi.object({}).required(),
};
export const attachment = {
  body: Joi.object({}).required(),
  params: Joi.object({
    id: generalValidation.id.required(),
  }).required(),
  query: Joi.object({}).required(),
  file: generalValidation.file.required(),
};
