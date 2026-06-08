import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { api } from '../api/api';

export default function Login({ navigate, showToast }) {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', formData);
            login(res.data.user, res.data.token);
            showToast('Logged in successfully!', 'success');
        } catch (err) { showToast(err.message, 'error'); }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4">
            <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white py-8 px-8 shadow rounded-lg">
                <h2 className="text-center text-2xl font-bold mb-6">Sign In</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input type="email" placeholder="Email" required className="w-full border rounded p-2" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    <input type="password" placeholder="Password" required className="w-full border rounded p-2" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                    <button type="submit" className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700">Login</button>
                </form>
                <p className="mt-4 text-center text-sm"><button onClick={() => navigate('register')} className="text-blue-600">Create an account</button></p>
            </div>
        </div>
    );
}
