import { auth} from "../../middleware/authentication.js";
import {validation,validationWithToken} from "../../middleware/validation.js";
import * as userController from "./controller/user.js";
import { Router } from "express";
import * as validator from "./validation.js"
import { fileUpload, fileValidation } from "../../utils/multer.cloud.js";
const router = Router();


router.post("/signup",validation(validator.signup), userController.signup);
router.get("/confirmEmail/:token",userController.confirmEmail)
router.get("/newConfirmEmail/:token",userController.newConfirmEmail)
router.get("/forgetPasswordMail",validation(validator.forgetPasswordMail),userController.forgetPasswordMail)
router.post("/forgetPassword/:token",validation(validator.forgetPassword),userController.forgetPassword)
router.post("/login",validation(validator.login) , userController.login);
router.patch("/updatePassword",auth,validationWithToken(validator.updatePassword), userController.updatePassword);
router.put("/update",auth,validationWithToken(validator.update), userController.update);
router.delete("/delete",auth,validationWithToken(validator.ValidateToken), userController.deleteUser);
router.patch("/softDelete",auth,validationWithToken(validator.ValidateToken), userController.softDelete);
router.patch("/logout",auth,validationWithToken(validator.ValidateToken), userController.logout);
router.patch("/profile/image",auth,validationWithToken(validator.ValidateToken),fileUpload(fileValidation.Image).single('image'),userController.changeProfilePic)
router.patch("/cover/image",auth,validationWithToken(validator.ValidateToken),fileUpload(fileValidation.Image).array('image',4),userController.changeCoverPic)

export default router;