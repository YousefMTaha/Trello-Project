import { asyncHandler } from "../../../utils/errorHandling.js";
import taskModel from "../../../../DB/model/task.model.js";
import userModel from "../../../../DB/model/user.model.js";
import cloudinary from "../../../utils/cloudinary.js";

export const add = asyncHandler(async (req, res, next) => {
  const { title, description, deadline, assignTo } = req.body;
  

  const checkUser = await userModel.findById(assignTo);
  if (!checkUser) return next(new Error("user does not exist"), { cause: 404 });

  const task = await taskModel.create({
    title,
    description,
    deadline,
    assignTo,
    userId: req.user._id,
  });
  await userModel.updateOne(
    { _id: assignTo },
    { $push: { tasks: [task._id] } }
  );

  return res.status(200).json({ message: "done", task });
});

export const update = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { title, description, deadline, assignTo, status } = req.body;
  

  const checkUser = await userModel.findById(assignTo);
  if (!checkUser) return next(new Error("user does not exist"), { cause: 404 });

  const checkTask = await taskModel.findById(id);
  if (checkTask == null)
    return next(new Error("id task does not exist", { cause: 404 }));

  const task = await taskModel.findById(id);
  const updateTask = await taskModel.updateOne(
    { _id: id, userId: req.user.id },
    { title, description, deadline, assignTo, status }
  );
  if (updateTask.matchedCount == 0)
    return next(new Error("you do not have permission"), { cause: 403 });

  await userModel.updateOne({ _id: task.assignTo }, { $pull: { tasks: [id] } });
  await userModel.updateOne({ _id: assignTo }, { $push: { tasks: [id] } });

  return res.status(200).json({ message: "done" });
});

export const deleteTask = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const checkTask = await taskModel.findById(id);
  if (!checkTask) return next(new Error("invalid task id", { cause: 404 }));
  const task = await taskModel.deleteOne({ _id: id, userId: req.user.id });
  if (task.deletedCount == 0)
  return next(new Error("you do not have a permission", { cause: 403 }));
  
  await userModel.findOneAndUpdate(
    { _id: checkTask.assignTo },
    { $pull: { tasks: id } }
    );  
    const cloud = await cloudinary.api.delete_resources_by_prefix(`trello/task/${checkTask._id}`)
  return res.status(200).json({ message: "done" });
});

export const getAllTasks = asyncHandler(async (req, res, next) => {
  const tasks = await taskModel
    .find()
    .populate({
      path: "userId",
    })
    .populate({
      path: "assignTo",
      select: "userName email",
    });
  if (tasks.length == 0)
    return next(new Error("no tasks exist", { cause: 400 }));
  return res.status(200).json({ message: "done", tasks });
});

export const getAllCreatedTasks = asyncHandler(async (req, res, next) => {
  const tasks = await taskModel.find({ userId: req.user.id }).populate({
    path: "assignTo",
    select: "userName email",
  });
  if (tasks.length == 0)
    return next(new Error("no tasks exist", { cause: 400 }));
  return res.status(200).json({ message: "done", tasks });
});

export const getAllAssignedToMe = asyncHandler(async (req, res, next) => {
  const tasks = await userModel
    .find({ _id: req.user.id })
    .select("-_id tasks")
    .populate("tasks");
  if (tasks.length == 0)
    return next(new Error("no tasks exist", { cause: 400 }));
  return res.status(200).json({ message: "done", tasks });
});

export const getAllLateTasks = asyncHandler(async (req, res, next) => {
  const now = new Date();
  const tasks = await taskModel
    .find({ assignTo: req.user.id, deadline: { $lt: now } })
    .populate({ path: "userId", select: "userName email" })
    .populate({
      path: "assignTo",
      select: "userName email",
    });
  if (tasks.length == 0)
    return next(new Error("no tasks exist", { cause: 400 }));
  return res.status(200).json({ message: "done", tasks });
});

export const getAllTaskAssignToAnyOne = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const checkUser = await userModel.findById(id);
  if (checkUser == null)
    return next(new Error("invalid user id", { cause: 404 }));
  const tasks = await taskModel
    .find({
      assignTo: id,
    })
    .populate("userId")
    .populate("assignTo");
  if (tasks.length == 0)
    return next(new Error("no tasks exist", { cause: 400 }));
  return res.status(200).json({ message: "done", tasks });
});

export const updateAttachment = asyncHandler(async(req,res,next)=>{
  const {id} = req.params
  const user = req.user
  const taskId = await taskModel.findById(id)
  if(!taskId)return next(new Error("invalid task id",{cause:400}))
  if((String(user._id)!=String(taskId.userId)))
  return next(new Error("you do not have permission on this task",{cause:400}))
  
  const {public_id,secure_url} = await cloudinary.uploader.upload(req.file.path,{folder:`trello/task/${id}/attachment`})
    await taskModel.updateOne({_id:id},{
    attachment:{public_id,secure_url}
   })
   return res.status(200).json({message:"done",})
})
