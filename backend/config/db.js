import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
        "mongodb+srv://azannoor:5oZtMNIOTVcuE4t0@portal.btwk5.mongodb.net/?retryWrites=true&w=majority&appName=Portal",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB