import mongoose from "mongoose";

//use mongoose to connect to mongodb
export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  try {
    await mongoose.connect(uri, { dbName: "Readly" });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    // process.exit(1);
    throw err; //สั่งให้จบ program ถ้าติดต่อกับ MongoDB ไม่ได้
  }
}
