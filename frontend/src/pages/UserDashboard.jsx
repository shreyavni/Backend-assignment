import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Send, MessageSquare } from 'lucide-react';
import { api } from '../api/api';

export default function UserDashboard({ showToast, logout }) {
    const [tasks, setTasks] = useState([]);
    const [linkInputs, setLinkInputs] = useState({});

    const fetchMyTasks = async () => {
        try {
            const res = await api.get('/tasks/my-tasks');
            setTasks(res.data);
        } catch (err) {
            if (err.message.includes('Not authorized')) logout();
            showToast(err.message, 'error');
        }
    };

    useEffect(() => { fetchMyTasks(); }, []);

    const handleSubmitLink = async (id, e) => {
        e.preventDefault();
        const link = linkInputs[id];
        if (!link) return showToast('Please enter a link first', 'error');

        try {
            await api.put(`/tasks/submit/${id}`, { submissionLink: link });
            showToast('Task submitted successfully!', 'success');
            fetchMyTasks();
        } catch (err) { showToast(err.message, 'error'); }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="bg-white rounded-lg shadow border-t-4 border-blue-500">
                <div className="px-6 py-4 border-b bg-gray-50"><h3 className="text-lg font-semibold">My Assigned Tasks</h3></div>
                <ul className="divide-y">
                    {tasks.length === 0 ? <li className="p-8 text-center text-gray-500">No tasks assigned to you. Relax!</li> : tasks.map(task => (
                        <li key={task._id} className="p-6 flex flex-col md:flex-row justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    {task.status === 'completed' ? <CheckCircle2 className="text-green-500" /> : <Circle className="text-blue-500" />}
                                    <h4 className={`text-lg font-medium ${task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>{task.title}</h4>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${task.status === 'completed' ? 'bg-green-100 text-green-700' : task.status === 'submitted' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>{task.status}</span>
                                </div>
                                {task.description && <p className="text-gray-600 mt-2 ml-9">{task.description}</p>}

                                {task.adminFeedback && (
                                    <div className="ml-9 mt-3 p-3 bg-red-50 border border-red-100 rounded text-sm text-red-800 flex items-start gap-2">
                                        <MessageSquare size={16} className="mt-0.5 shrink-0" />
                                        <p><strong>Admin Feedback:</strong> {task.adminFeedback}</p>
                                    </div>
                                )}
                            </div>

                            {task.status !== 'completed' && (
                                <form onSubmit={(e) => handleSubmitLink(task._id, e)} className="w-full md:w-auto flex flex-col gap-2 ml-9 md:ml-0">
                                    <input type="url" placeholder="Paste link here..." required className="border rounded px-3 py-2 text-sm"
                                        value={linkInputs[task._id] || task.submissionLink || ''} onChange={e => setLinkInputs({ ...linkInputs, [task._id]: e.target.value })} />
                                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded text-sm flex items-center justify-center hover:bg-blue-700">
                                        <Send size={16} className="mr-2" /> {task.status === 'submitted' ? 'Update Link' : 'Submit Work'}
                                    </button>
                                </form>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
