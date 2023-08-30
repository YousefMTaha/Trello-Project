import userModel from "../../DB/model/user.model.js";
import { asyncHandler } from "../utils/errorHandling.js";
import Jwt from "jsonwebtoken";

export const auth = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;
  
  if (!authorization?.startsWith(process.env.BEARER_TOKEN))
    return next(
      new Error("authorization is required or invalid Bearerkey", {
        cause: 400,
      })
    );
  const token = authorization.split(process.env.BEARER_TOKEN)[1];
  if (!token) return next(new Error("token is required", { cause: 401 }));
  const decode = Jwt.verify(token, process.env.TOKEN_SIGNATURE);

  if (!decode?.id) return next(new Error("invalid payload", { cause: 400 }));
  const checkUser = await userModel.findById({ _id: decode.id });

  if (!checkUser) return next(new Error("user does not exist", { cause: 404 }));

  if (checkUser.isDeleted)
    return next(
      new Error("user is deleted and you must be login again", { cause: 401 })
    );

  if (!checkUser.isLogin)
    return next(new Error("user must be login", { cause: 401 }));


  req.user = checkUser;
  return next();
});
