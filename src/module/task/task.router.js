import { auth } from "../../middleware/authentication.js";
import * as taskController from "./controller/task.js";
import { Router } from "express";
import validation from "../../middleware/validation.js";
import * as validator from "./validation.js";
import { fileUpload, fileValidation } from "../../utils/multer.cloud.js";
const router = Router();

router.get("/add", auth, validation(validator.add), taskController.add);
router.put(
  "/update/:id",
  auth,
  validation(validator.update),
  taskController.update
);
router.delete(
  "/delete/:id",
  auth,
  validation(validator.remove),
  taskController.deleteTask
);
router.post(
  "/getAllTasks",
  validation(validator.general),
  taskController.getAllTasks
);
router.post(
  "/getAllCreatedTasks",
  auth,
  validation(validator.general),
  taskController.getAllCreatedTasks
);
router.get(
  "/getAllAssignedToMe",
  auth,
  validation(validator.general),
  taskController.getAllAssignedToMe
);
router.get(
  "/getAllLateTasks",
  auth,
  validation(validator.general),
  taskController.getAllLateTasks
);
router.get(
  "/getAllTaskAssignToAnyOne/:id",
  auth,
  validation(validator.getAllTaskAssignToAnyOne),
  taskController.getAllTaskAssignToAnyOne
);
router.patch(
  "/attachment/:id",
  auth,
  fileUpload(fileValidation.file).single("file"),
  validation(validator.attachment),
  taskController.updateAttachment
);

export default router;
