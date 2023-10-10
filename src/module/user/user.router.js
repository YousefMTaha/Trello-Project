import { auth } from "../../middleware/authentication.js";
import validation from "../../middleware/validation.js";
import * as userController from "./controller/user.js";
import { Router } from "express";
import * as validator from "./validation.js";
import { fileUpload, fileValidation } from "../../utils/multer.cloud.js";
const router = Router();

router.post("/signup", validation(validator.signup), userController.signup);
router.get("/confirmEmail/:token", userController.confirmEmail);
router.get("/newConfirmEmail/:token", userController.newConfirmEmail);
router.get(
  "/forgetPasswordMail",
  validation(validator.forgetPasswordMail),
  userController.forgetPasswordMail
);
router.post(
  "/forgetPassword/:token",
  validation(validator.forgetPassword),
  userController.forgetPassword
);
router.post("/login", validation(validator.login), userController.login);
router.patch(
  "/updatePassword",
  auth,
  validation(validator.updatePassword),
  userController.updatePassword
);
router.put(
  "/update",
  auth,
  validation(validator.update),
  userController.update
);
router.delete(
  "/delete",
  auth,
  validation(validator.general),
  userController.deleteUser
);
router.patch(
  "/softDelete",
  auth,
  validation(validator.general),
  userController.softDelete
);
router.patch(
  "/logout",
  auth,
  validation(validator.general),
  userController.logout
);
router.patch(
  "/profile/image",
  auth,
  fileUpload(fileValidation.Image).single("image"),
  validation(validator.profileImage),
  userController.changeProfilePic
);
router.patch(
  "/cover/image",
  auth,
  fileUpload(fileValidation.Image).array("image", 4),
  validation(validator.coverImage),
  userController.changeCoverPic
);

export default router;
