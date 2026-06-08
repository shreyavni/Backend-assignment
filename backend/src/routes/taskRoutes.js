const express = require('express');
const router = express.Router();
const {
    getAllUsers, assignTask, getAllTasksAdmin, reviewTask, deleteTaskAdmin, getMyTasks, submitTask
} = require('../controllers/taskController');
const { protect, adminGuard } = require('../middlewares/authMiddleware');

// --- ADMIN ROUTES ---
router.get('/admin/users', protect, adminGuard, getAllUsers);
router.post('/admin/assign', protect, adminGuard, assignTask);
router.get('/admin/all', protect, adminGuard, getAllTasksAdmin);
router.put('/admin/review/:id', protect, adminGuard, reviewTask);

// ✅ NEW: Delete Route
router.delete('/admin/delete/:id', protect, adminGuard, deleteTaskAdmin);

// --- USER ROUTES ---
router.get('/my-tasks', protect, getMyTasks);
router.put('/submit/:id', protect, submitTask);

module.exports = router;