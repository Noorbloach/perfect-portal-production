import express from 'express';
import { sendMessage, getChatHistory,getUsersWithChatHistory} from '../controllers/ChatController.js';

const router = express.Router();

// Route to send a message
router.post('/message', sendMessage);

// Route to get chat history between two users
router.get('/history/:userId1/:userId2', getChatHistory);

router.get('/users/:userId', getUsersWithChatHistory);


export default router;
