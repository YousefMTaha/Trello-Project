import Joi from "joi";
import { Types } from "mongoose";

const idValidation = (value, helper) => {
  if (Types.ObjectId.isValid(value)) return true;
  else return helper.message("invalid id from validation");
};

export const generalValidation = {

  id: Joi.custom(idValidation),
  token: Joi.string(),
  userName: Joi.string().alphanum().min(3).max(20),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      maxDomainSegments: 5,
      tlds: { allow: ["eg", "com", "net", "org", "edu"] },
    })
    ,
  password: Joi.string()
    .pattern(
      new RegExp(
        /^(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z])(?=\D*\d)(?=[^!#%]*[!#%])[A-Za-z0-9!#%]{8,}$/
      )
    ),
  phone: Joi.string().pattern(new RegExp(/^01[0125][0-9]{8}$/)),
  age: Joi.number().min(18).max(80),
  gender: Joi.string()
    .pattern(new RegExp(/(?:male|Male|female|Female|FEMALE|MALE)$/))
    .lowercase(),
    task:{
      title: Joi.string().min(3).max(20),
      description: Joi.string().max(1000),
      deadline: Joi.date().greater(Date.now()),
     status: Joi.string().pattern(new RegExp(/(?:toDo|done|doing)$/)),

    }
};
