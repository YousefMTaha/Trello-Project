import { Schema, Types, model } from "mongoose";
const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    isDeleted: { type: Boolean, default: false },
    isLogin: { type: Boolean, default: false },
    confirmEmail: { type: Boolean, default: false },
    age: Number,
    gender: {
      type: String,
      enum: ["male", "female"],
      default: "male",
      lowercase: true,
    },
    tasks: [
      {
        type: Types.ObjectId,
        ref: "Tasks",
      },
    ],
    profilePhoto: { public_id: String, secure_url: String },
    coverPhoto: [{ public_id: String, secure_url: String }],
  },

  {
    timestamps: true,
  }
);
const userModel = model("Users", userSchema);
export default userModel;
