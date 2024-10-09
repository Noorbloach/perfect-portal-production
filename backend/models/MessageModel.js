
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to a User model, if applicable
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to a User model, if applicable
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamp: true }
);

// Ensure unique messages between sender and receiver within a specific timeframe
messageSchema.index(
  { sender: 1, receiver: 1, message: 1, timestamp: 1 },
  { unique: true }
);

// Middleware to handle duplicate message prevention
messageSchema.pre("save", async function (next) {
  const existingMessage = await this.constructor.findOne({
    sender: this.sender,
    receiver: this.receiver,
    message: this.message,
    timestamp: { $gte: new Date(Date.now() - 1000) }, // Check within last second
  });

  if (existingMessage) {
    const error = new Error("Duplicate message detected");
    next(error);
  } else {
    next();
  }
});

export default mongoose.model("Message", messageSchema);

// import mongoose from "mongoose";

// const messageSchema = new mongoose.Schema(
//   {
//     sender: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User", // Reference to a User model, if applicable
//       required: true,
//     },
//     receiver: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User", // Reference to a User model, if applicable
//       required: true,
//     },
//     message: {
//       type: String,
//       required: true,
//     },
//     timestamp: {
//       type: Date,
//       default: Date.now,
//     },
//     isRead: {
//       type: Boolean,
//       default: false, // Message is unread by default
//     },
//   },
//   { timestamps: true }
// );

// // Ensure unique messages between sender and receiver within a specific timeframe
// messageSchema.index(
//   { sender: 1, receiver: 1, message: 1, timestamp: 1 },
//   { unique: true }
// );

// export default mongoose.model("Message", messageSchema);
