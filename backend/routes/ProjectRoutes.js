import express from 'express';
import { createProject, getProjects, getProjectById, updateProject, deleteProject, getClients,updateAdminStatus,getProjectByID,getEmployeeProjects,countUserAdminStatus,getApprovedProjects } from '../controllers/ProjectController.js';

const router = express.Router();

router.post('/create', createProject);


router.get('/projects', getProjects);


router.get('/projects/:id', getProjectById);

router.get('/projectsClient/:id', getProjectByID);


router.put('/projects/:id', updateProject);

router.delete('/projects/:id', deleteProject);

// Route to get adminStatus counts and total projects for a specific user
router.get('/projects/admin-status-count/:userId', countUserAdminStatus);

// Route to fetch projects for a specific employee by their ID
router.get('/projects/employee/:employeeId', getEmployeeProjects);


router.put('/projects/:projectId/admin-status', updateAdminStatus);
// Route to fetch all clients (for old client selection)
router.get('/clients', getClients);

router.get('/approved-projects', getApprovedProjects);

export default router;
