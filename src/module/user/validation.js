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
};

export const login = {
  body: Joi.object({
    email: generalValidation.email.required(),
    password: generalValidation.password.required(),
  }).required(),
};

export const forgetPasswordMail = {
  body: Joi.object({
    email: generalValidation.email.required(),
  }).required(),
};

export const forgetPassword = {
  body: Joi.object({
    newPassword: generalValidation.password.required(),
    CNewPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
    token: generalValidation.token.required(),
  }).required(),
};

export const updatePassword = {
  body: Joi.object({
    oldPassword: generalValidation.password.required(),
    newPassword: generalValidation.password.required(),
    cPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
    token: generalValidation.token.required(),
  }).required(),
};

export const update = {
  body: Joi.object({
    userName: generalValidation.userName,
    age: generalValidation.age,
    phone: generalValidation.phone,
    token: generalValidation.token.required(),
  }).required(),
};

export const ValidateToken = {
  body: Joi.object({
    token: generalValidation.token.required(),
  }).required(),
};
