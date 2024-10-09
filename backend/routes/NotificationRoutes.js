import express from 'express';
import { getUserNotifications, markNotificationAsRead } from '../controllers/NotificationController.js';

const router = express.Router();


router.get('/user/:userId', getUserNotifications);


router.put('/mark-read/:id', markNotificationAsRead);

export default router;
