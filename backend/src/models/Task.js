const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    // Task kis user ko assign kiya gaya hai
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // Task status: pending -> submitted (user ne link daal di) -> completed (admin ne pass kar diya)
    status: { type: String, enum: ['pending', 'submitted', 'completed'], default: 'pending' },
    // User apna kaam yahan submit karega
    submissionLink: { type: String, default: '' },
    // Agar admin ko kaam pasand nahi aaya toh wo yahan comment likhega
    adminFeedback: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);