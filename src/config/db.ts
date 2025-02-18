import mongoose from "mongoose";

const mongoDBURL = "mongodb://localhost:27017/tudo_app";

export const connectDB = async () => {
  try {
    return await mongoose.connect(mongoDBURL);
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

