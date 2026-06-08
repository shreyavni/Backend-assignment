import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { api } from '../api/api';

export default function Register({ navigate, showToast }) {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/register', formData);
            login(res.data.user, res.data.token);
            showToast('Registered successfully!', 'success');
        } catch (err) { showToast(err.message, 'error'); }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4">
            <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white py-8 px-8 shadow rounded-lg">
                <h2 className="text-center text-2xl font-bold mb-6">Register User</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input type="text" placeholder="Name" required className="w-full border rounded p-2" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    <input type="email" placeholder="Email" required className="w-full border rounded p-2" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    <input type="password" placeholder="Password" required className="w-full border rounded p-2" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                    <button type="submit" className="w-full bg-green-600 text-white rounded py-2 hover:bg-green-700">Register</button>
                </form>
                <p className="mt-4 text-center text-sm"><button onClick={() => navigate('login')} className="text-blue-600">Already have an account?</button></p>
            </div>
        </div>
    );
}
