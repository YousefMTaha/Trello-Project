import Joi from "joi";
import { generalValidation } from "../../utils/validation.js";

export const signup = {
  body: Joi.object({
    userName: generalValidation.userName.required(),
    email: generalValidation.email.required(),
    password: generalValidation.password.required(),
    cPassword: Joi.string().valid(Joi.ref("password")).required(),
    phone: generalValidation.phone,
    age: generalValidation.age,
    gender: generalValidation.gender,
  }).required(),
  params: Joi.object({}).required(),
  query: Joi.object({}).required(),
};

export const login = {
  body: Joi.object({
    email: generalValidation.email.required(),
    password: generalValidation.password.required(),
  }).required(),
  params: Joi.object({}).required(),
  query: Joi.object({}).required(),
};

export const forgetPasswordMail = {
  body: Joi.object({
    email: generalValidation.email.required(),
  }).required(),
  params: Joi.object({}).required(),
  query: Joi.object({}).required(),
};

export const forgetPassword = {
  body: Joi.object({
    newPassword: generalValidation.password.required(),
    CNewPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
  }).required(),
  params: Joi.object({
    token: generalValidation.token.required(),
  }).required(),
  query: Joi.object({}).required(),
};

export const updatePassword = {
  body: Joi.object({
    oldPassword: generalValidation.password.required(),
    newPassword: generalValidation.password.required(),
    cPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
  }).required(),
  params: Joi.object({}).required(),
  query: Joi.object({}).required(),
};

export const update = {
  body: Joi.object({
    userName: generalValidation.userName,
    age: generalValidation.age,
    phone: generalValidation.phone,
  }).required(),
  params: Joi.object({}).required(),
  query: Joi.object({}).required(),
};

export const general = {
  body: Joi.object({}).required(),
  params: Joi.object({}).required(),
  query: Joi.object({}).required(),
};

export const profileImage = {
  body: Joi.object({}).required(),
  params: Joi.object({}).required(),
  query: Joi.object({}).required(),
  file: generalValidation.file.required(),
};

export const coverImage = {
  body: Joi.object({}).required(),
  params: Joi.object({}).required(),
  query: Joi.object({}).required(),
  files: Joi.array().items(generalValidation.file).max(4).required(),
};
