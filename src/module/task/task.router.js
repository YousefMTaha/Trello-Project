import { auth } from "../../middleware/authentication.js";
import * as taskController from "./controller/task.js"
import { Router } from "express";
import {validation, validationWithToken} from "../../middleware/validation.js"
import * as validator from "./validation.js"
import { fileUpload, fileValidation } from "../../utils/multer.cloud.js";
const router = Router()

router.get("/add",auth,validationWithToken(validator.add),taskController.add)
router.put("/update/:id",auth,validationWithToken(validator.update),taskController.update)
router.delete("/delete/:id",auth,validationWithToken(validator.remove),taskController.deleteTask)
router.post("/getAllTasks",taskController.getAllTasks)
router.post("/getAllCreatedTasks",auth,validationWithToken(validator.validateToken),taskController.getAllCreatedTasks)
router.get("/getAllAssignedToMe",auth,validationWithToken(validator.validateToken),taskController.getAllAssignedToMe)
router.get("/getAllLateTasks",auth,validationWithToken(validator.validateToken),taskController.getAllLateTasks)
router.get("/getAllTaskAssignToAnyOne/:id",auth,validationWithToken(validator.getAllTaskAssignToAnyOne),taskController.getAllTaskAssignToAnyOne)
router.patch("/attachment/:id",auth,fileUpload(fileValidation.file).single('file'),validationWithToken(validator.attachment),taskController.updateAttachment)



export default router