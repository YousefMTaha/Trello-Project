import { Schema,Types,model } from "mongoose";

const taskSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:"toDo",
        enum:["toDo","done","doing"]
    },
    userId:{
        type:Types.ObjectId,
        ref:'Users',
        required:true
    },
    assignTo:{
        type:Types.ObjectId,
        ref:'Users',
        required:true
    },
    deadline:{
        type:Date,
        required:true
    },
    attachment:{public_id:String,secure_url:String}
},{
    timestamps:true
})

const taskModel = model("Tasks",taskSchema)
export default taskModel