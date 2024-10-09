import Message from '../models/MessageModel.js';
import mongoose from 'mongoose';
import User from '../models/UserModel.js';
const { ObjectId } = mongoose.Types;
// Send a message
export const sendMessage = async (req, res) => {
  const { sender, receiver, message, timestamp } = req.body;

  // Validate required fields
  if (!sender || !receiver) {
    return res.status(400).json({ message: 'Sender and receiver IDs are required' });
  }

  // Validate other fields if needed
  if (!message) {
    return res.status(400).json({ message: 'Message is required' });
  }

  try {
    const newMessage = new Message({
      sender,
      receiver,
      message,
      timestamp: timestamp ? new Date(timestamp) : new Date()
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ message: 'Server error' });
  }
};



// Get chat history between two users
export const getChatHistory = async (req, res) => {
  const { userId1, userId2 } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender: userId1, receiver: userId2 },
        { sender: userId2, receiver: userId1 },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (err) {
    console.error('Error fetching chat history:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get users with whom the current user has a chat history
export const getUsersWithChatHistory = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find all messages where the current user is either the sender or the receiver
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    });

    // Extract unique user IDs (excluding the current user's ID)
    const userIds = new Set();
    messages.forEach((msg) => {
      if (msg.sender.toString() !== userId) {
        userIds.add(msg.sender.toString());
      }
      if (msg.receiver.toString() !== userId) {
        userIds.add(msg.receiver.toString());
      }
    });

    // Convert Set to Array
    const uniqueUserIds = Array.from(userIds);

    // Optionally, you can fetch full user details based on these IDs
    const usersWithChatHistory = await User.find({ _id: { $in: uniqueUserIds } });

    res.status(200).json(usersWithChatHistory);
  } catch (err) {
    console.error('Error fetching users with chat history:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// import Message from '../models/MessageModel.js';
// import mongoose from 'mongoose';
// import User from '../models/UserModel.js';

// const { ObjectId } = mongoose.Types;

// // Send a message
// export const sendMessage = async (req, res) => {
//   const { sender, receiver, message, timestamp } = req.body;

//   // Validate required fields
//   if (!sender || !receiver) {
//     return res.status(400).json({ message: 'Sender and receiver IDs are required' });
//   }

//   if (!message) {
//     return res.status(400).json({ message: 'Message is required' });
//   }

//   try {
//     const newMessage = new Message({
//       sender,
//       receiver,
//       message,
//       timestamp: timestamp ? new Date(timestamp) : new Date(),
//       isRead: false, // Unread by default
//     });

//     await newMessage.save();
//     res.status(201).json(newMessage);
//   } catch (err) {
//     console.error('Error sending message:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Get chat history between two users and mark messages as read
// export const getChatHistory = async (req, res) => {
//   const { userId1, userId2 } = req.params;

//   try {
//     const messages = await Message.find({
//       $or: [
//         { sender: userId1, receiver: userId2 },
//         { sender: userId2, receiver: userId1 },
//       ],
//     }).sort({ timestamp: 1 });

//     // Mark messages as read for the user retrieving the chat history
//     await Message.updateMany(
//       {
//         receiver: userId1, // Mark only the messages sent to the current user as read
//         sender: userId2,
//         isRead: false,
//       },
//       { $set: { isRead: true } }
//     );

//     res.status(200).json(messages);
//   } catch (err) {
//     console.error('Error fetching chat history:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Get users with whom the current user has a chat history
// export const getUsersWithChatHistory = async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const messages = await Message.find({
//       $or: [{ sender: userId }, { receiver: userId }]
//     });

//     const userIds = new Set();
//     messages.forEach((msg) => {
//       if (msg.sender.toString() !== userId) {
//         userIds.add(msg.sender.toString());
//       }
//       if (msg.receiver.toString() !== userId) {
//         userIds.add(msg.receiver.toString());
//       }
//     });

//     const uniqueUserIds = Array.from(userIds);
//     const usersWithChatHistory = await User.find({ _id: { $in: uniqueUserIds } });

//     res.status(200).json(usersWithChatHistory);
//   } catch (err) {
//     console.error('Error fetching users with chat history:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Get unread messages count for a specific user
// export const getUnreadMessagesCount = async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const unreadCount = await Message.countDocuments({
//       receiver: userId,
//       isRead: false,
//     });

//     res.status(200).json({ unreadCount });
//   } catch (err) {
//     console.error('Error fetching unread messages count:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };
