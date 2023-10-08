import userModel from "../../../../DB/model/user.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import sendEmail from "../../../utils/email.js";
import cloudinary from "../../../utils/cloudinary.js";

export const signup = asyncHandler(async (req, res, next) => {
  const { userName, email, password,  phone, age, gender } = req.body;

  const checkEmail = await userModel.findOne({ email });
  if (checkEmail != null)
    return next(
      new Error("email is already exist", { cause: StatusCodes.CONFLICT })
    );

  const hashPassword = bcrypt.hashSync(
    password,
    parseInt(process.env.SALT_ROUND)
  );
  const user = await userModel.create({
    userName,
    email,
    password: hashPassword,
    phone,
    age,
    gender,
  });
  const token = Jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.EMAIL_SIGNATURE,
    { expiresIn: 60 * 5 }
  );
  const link = `${req.protocol}://${req.headers.host}/user/confirmEmail/${token}`;
  const linkConfirm = `${req.protocol}://${req.headers.host}/user/newConfirmEmail/${token}`;
  const html = `<a href="${link}">confirm email</a>
                <br>
                <br>
                <a href="${linkConfirm}">resend confirm email</a>`;

  await sendEmail({
    to: email,
    subject: "confirm Email",
    html,
  });
  return res.status(200).json({ message: "done", user });
});

export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const tokenVerify = Jwt.verify(token, process.env.EMAIL_SIGNATURE);
  const user = await userModel.findByIdAndUpdate(
    { _id: tokenVerify.id },
    { confirmEmail: true }
  );
  if (!user)
    return res.send(
      "<a href='http://localhost:5000/user/signup/'>you look like do not have account , signup?</a>"
    );
  return res.redirect("http://localhost:5000/user/login");
});

export const newConfirmEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const tokenVerify = Jwt.verify(token, process.env.EMAIL_SIGNATURE);
  const user = await userModel.findById(tokenVerify.id);
  if (!user)
    return res.send(
      "<a href='http://localhost:5000/user/signup/'>you look like do not have account , signup?</a>"
    );
  if (user.confirmEmail)
    return res.redirect("http://localhost:5000/user/login");
  const tokenConfirm = Jwt.sign(
    { id: user._id, email: user.email },
    process.env.EMAIL_SIGNATURE,
    { expiresIn: 60 * 2 }
  );
  const link = `${req.protocol}://${req.headers.host}/user/confirmEmail/${tokenConfirm}`;
  const linkConfirm = `${req.protocol}://${req.headers.host}/user/newConfirmEmail/${tokenConfirm}`;
  const html = `<a href="${link}">confirm email</a>
                <br>
                <br>
                <a href="${linkConfirm}">resend confirm email</a>`;

  await sendEmail({
    to: user.email,
    subject: "confirmEmail",
    html,
  });
  return res.json("check your inbox");
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const checkUser = await userModel.findOne({ email });
  if (checkUser == null)
    return next(new Error("invalid-data information", { cause: 400 }));
  const checkPassword = bcrypt.compareSync(password, checkUser.password);
  if (!checkPassword)
    return next(new Error("invalid-data information", { cause: 400 }));

  if (!checkUser.confirmEmail)
    return next(new Error("you must confirm your email first", { cause: 401 }));

  const token = Jwt.sign(
    {
      userName: checkUser.userName,
      id: checkUser._id,
    },
    process.env.TOKEN_SIGNATURE
  );
  const updateLoginStatus = await userModel.updateOne(
    { _id: checkUser._id },
    { isLogin: true, isDeleted: false }
  );

  return res.status(200).json({ message: "done", token });
});

export const forgetPasswordMail = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  if (!user)
    return next(
      new Error("Email does not signup before Or deleted", { cause: 400 })
    );
  const token = Jwt.sign(
    { id: user._id, email: user.email },
    process.env.EMAIL_SIGNATURE
  );
  const link = `${req.protocol}://${req.headers.host}/user/forgetPassword/${token}`;
  const html = `<a href='${link}'>forget Password</a>`;
  await sendEmail({ to: user.email, subject: "forgetPassword", html });
  return res.status(200).json({ message: "done" });
});

export const forgetPassword = asyncHandler(async (req, res, next) => {
  const { newPassword, CNewPassword } = req.body;
  const { token } = req.params;

  const decode = Jwt.verify(token, process.env.EMAIL_SIGNATURE);

  const user = await userModel.findOne({ email: decode.email });
  if (!user)
    return next(
      new Error("you look like do not have account ,you need to sign up", {
        cause: 401,
      })
    );

  // if (newPassword != CNewPassword)
  //   return next(new Error("confirm password does not match new password",{cause:400}));
  const newPasswordHashed = await bcrypt.hash(
    newPassword,
    parseInt(process.env.SALT_ROUND)
  );
  const userUpdate = await userModel.findByIdAndUpdate(
    { _id: user._id },
    { password: newPasswordHashed }
  );

  return res.status(200).json({ message: "done" });
});

export const updatePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const user = req.user;

  // if (newPassword != cPassword)
  //   return next(
  //     new Error("confirmPassword does not match new password", { cause: 400 })
  //   );

  const match = await bcrypt.compare(oldPassword, user.password);
  if (!match)
    return next(new Error("old password is incorrect", { cause: 401 }));
  const hashNewPassword = await bcrypt.hash(
    newPassword,
    parseInt(process.env.SALT_ROUND)
  );
  await userModel.updateOne({ _id: user.id }, { password: hashNewPassword });
  return res.status(200).json({ message: "done" });
});

export const update = asyncHandler(async (req, res, next) => {
  const { userName, age, phone } = req.body;
  const user = req.user;

  const updateUser = await userModel.updateOne(
    {
      _id: user.id,
    },
    {
      phone,
      age,
      userName,
    }
  );
  return res.status(200).json({ message: "done" });
});

export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = req.user;

  await userModel.deleteOne({
    _id: user.id,
  });
 const rmProfilePic =  await cloudinary.uploader.destroy(user.profilePhoto.public_id)
 for (const coverPic of user.coverPhoto) {
  await cloudinary.uploader.destroy(coverPic.public_id)  

}
const deleteFolderCloudinary = await cloudinary.api.delete_resources_by_prefix(`trello/user/${user._id}`)
  return res.status(200).json({ message: "done" });
});

export const softDelete = asyncHandler(async (req, res, next) => {
  const user = req.user;

  await userModel.updateOne(
    { _id: user.id },
    { isLogin: false, isDeleted: true }
  );
  return res.status(200).json({ message: "done" });
});

export const logout = asyncHandler(async (req, res, next) => {
  const user = req.user;
  await userModel.updateOne({ _id: user.id }, { isLogin: false });
  return res.status(200).json({ message: "done" });
});

export const changeProfilePic = asyncHandler(async (req, res, next) => {
  const {public_id,secure_url} = await cloudinary.uploader.upload(req.file.path,{folder:`trello/user/${req.user._id}/profile`})
  const user = await userModel.findOneAndUpdate(
    { _id: req.user._id },
    { profilePhoto: {public_id,secure_url} },
    { new: true }
  );

  return res.status(200).json({ message: "done",user, file:req.file});
});

export const changeCoverPic = asyncHandler(async (req, res, next) => {
  const images = req.files;
  const destinationFiles = []
  for (const image of images) {
    const {public_id,secure_url} = await cloudinary.uploader.upload(image.path,{folder:`trello/user/${req.user._id}/cover`})

    destinationFiles.push({public_id,secure_url});
  }

  const user = await userModel.findOneAndUpdate(
    { _id: req.user._id },
    { $push:{coverPhoto:destinationFiles}},
    { new: true }
  );

  return res.status(200).json({ message: "done", user });
});
