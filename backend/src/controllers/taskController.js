const Task = require('../models/Task');
const User = require('../models/User');

// ==========================================
// ADMIN FUNCTIONS (Manager)
// ==========================================

// 1. Get All Users (Admin ko assign karne ke liye dropdown me list chahiye)
const getAllUsers = async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access Denied' });
        const users = await User.find({ role: 'user' }).select('-password');
        res.status(200).json(users);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

const assignTask = async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access Denied' });

        const { title, description, assignToUserId } = req.body;

        if (assignToUserId === 'all') {
            const users = await User.find({ role: 'user' });
            const tasksToInsert = users.map(user => ({
                title, description, assignedTo: user._id
            }));
            const createdTasks = await Task.insertMany(tasksToInsert);
            return res.status(201).json({ message: 'Task assigned to all users', count: createdTasks.length });
        } else {
            const task = await Task.create({ title, description, assignedTo: assignToUserId });
            return res.status(201).json(task);
        }
    } catch (err) { res.status(500).json({ message: err.message }); }
};

const getAllTasksAdmin = async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access Denied' });
        const tasks = await Task.find().populate('assignedTo', 'name email').sort({ updatedAt: -1 });
        res.status(200).json(tasks);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

const reviewTask = async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access Denied' });

        const { status, adminFeedback } = req.body;

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { status, adminFeedback: adminFeedback || '' },
            { returnDocument: 'after' } // Fixed mongoose warning
        );
        res.status(200).json(task);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

const deleteTaskAdmin = async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access Denied' });

        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) { res.status(500).json({ message: err.message }); }
};

const getMyTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ assignedTo: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

// 7. User submits their work (Link submit karna)
const submitTask = async (req, res) => {
    try {
        const { submissionLink } = req.body;

        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        if (task.assignedTo.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Ye task aapka nahi hai!' });
        }

        task.submissionLink = submissionLink;
        task.status = 'submitted';
        await task.save();

        res.status(200).json(task);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = {
    getAllUsers,
    assignTask,
    getAllTasksAdmin,
    reviewTask,
    deleteTaskAdmin,
    getMyTasks,
    submitTask
};