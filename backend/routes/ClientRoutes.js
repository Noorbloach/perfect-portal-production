import express from 'express';
import { createClient } from '../controllers/ClientController.js'; // For handling new client creation
import { getClients } from '../controllers/ProjectController.js';

const router = express.Router();

// Create new client
router.post('/create', createClient);

// Get all clients
router.get('/clients', getClients);

export default router;
