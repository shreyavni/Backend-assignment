import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { api } from '../api/api';

export default function AdminDashboard({ showToast, logout }) {
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [newTask, setNewTask] = useState({ title: '', description: '', assignToUserId: 'all' });
    const [feedbackInputs, setFeedbackInputs] = useState({});

    const fetchData = async () => {
        try {
            const [taskRes, userRes] = await Promise.all([
                api.get('/tasks/admin/all'),
                api.get('/tasks/admin/users')
            ]);
            setTasks(taskRes.data);
            setUsers(userRes.data);
        } catch (err) {
            if (err.message.includes('Access Denied')) logout();
            showToast(err.message, 'error');
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleAssignTask = async (e) => {
        e.preventDefault();
        if (!newTask.title.trim()) return;
        try {
            await api.post('/tasks/admin/assign', newTask);
            setNewTask({ title: '', description: '', assignToUserId: 'all' });
            showToast('Task assigned successfully!', 'success');
            fetchData();
        } catch (err) { showToast(err.message, 'error'); }
    };

    const handleReview = async (id, status) => {
        try {
            await api.put(`/tasks/admin/review/${id}`, {
                status,
                adminFeedback: feedbackInputs[id] || ''
            });
            showToast(`Task marked as ${status}`, 'success');
            setFeedbackInputs(prev => ({ ...prev, [id]: '' }));
            fetchData();
        } catch (err) { showToast(err.message, 'error'); }
    };

    // ✅ NEW: Handle Delete Function
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to permanently delete this task?")) return;
        try {
            await api.delete(`/tasks/admin/delete/${id}`);
            showToast('Task deleted successfully', 'success');
            fetchData();
        } catch (err) { showToast(err.message, 'error'); }
    };

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            <div className="bg-white rounded-lg shadow-sm border-t-4 border-red-500 p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center"><Plus size={20} className="mr-2 text-red-500" /> Assign New Task</h3>
                <form onSubmit={handleAssignTask} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input type="text" placeholder="Task Title" required className="border rounded-md py-2 px-3" value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} />
                    <input type="text" placeholder="Instructions" className="border rounded-md py-2 px-3" value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} />
                    <select className="border rounded-md py-2 px-3 bg-white" value={newTask.assignToUserId} onChange={e => setNewTask({ ...newTask, assignToUserId: e.target.value })}>
                        <option value="all">Assign to ALL Users</option>
                        {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
                    </select>
                    <button type="submit" className="bg-red-600 text-white rounded-md py-2 px-4 hover:bg-red-700">Assign Task</button>
                </form>
            </div>

            <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b bg-gray-50"><h3 className="text-lg font-semibold">User Submissions & Progress</h3></div>
                <ul className="divide-y divide-gray-100">
                    {tasks.length === 0 ? <li className="p-6 text-center text-gray-500">No tasks assigned yet.</li> : tasks.map(task => (
                        <li key={task._id} className="p-6 hover:bg-gray-50">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <span className="text-xs font-bold bg-gray-200 px-2 py-1 rounded text-gray-700">{task.assignedTo?.name || 'Unknown User'}</span>
                                    <h4 className="text-lg font-medium mt-1">{task.title}</h4>
                                    {task.submissionLink ? (
                                        <p className="text-sm mt-1">Link: <a href={task.submissionLink} target="_blank" rel="noreferrer" className="text-blue-600 underline">{task.submissionLink}</a></p>
                                    ) : <p className="text-sm text-gray-400 mt-1 italic">No link submitted yet</p>}
                                </div>

                                <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                                    <span className={`text-xs px-3 py-1 rounded-full font-semibold uppercase ${task.status === 'completed' ? 'bg-green-100 text-green-700' : task.status === 'submitted' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {task.status}
                                    </span>

                                    <div className="flex gap-2 mt-2 w-full items-center">
                                        {task.status !== 'completed' && (
                                            <>
                                                <input type="text" placeholder="Add feedback..." className="border rounded text-sm px-2 py-1 flex-1"
                                                    value={feedbackInputs[task._id] || ''} onChange={e => setFeedbackInputs({ ...feedbackInputs, [task._id]: e.target.value })} />
                                                <button onClick={() => handleReview(task._id, 'pending')} className="bg-orange-100 text-orange-700 px-3 py-1.5 rounded text-sm font-medium hover:bg-orange-200">Revert</button>
                                                <button onClick={() => handleReview(task._id, 'completed')} className="bg-green-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-green-700">Approve</button>
                                            </>
                                        )}
                                        {/* ✅ NEW: Delete Button (Visible on all tasks) */}
                                        <button onClick={() => handleDelete(task._id)} className="text-gray-400 hover:text-red-600 p-1.5 rounded bg-gray-100 hover:bg-red-50 ml-2 transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}