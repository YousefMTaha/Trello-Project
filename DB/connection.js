import mongoose from "mongoose";
import { connect } from "mongoose";
const connectDB = async () => {
  return await connect(process.env.DB_URL, {
    serverSelectionTimeoutMS: 1000,
  })
    .then(() => {
      console.log("DBConnected");
    })
    .catch((err) => {
      console.log(`errDB , ${err.message}`);
    });
};
export default connectDB;
