import React from 'react';
import { LayoutDashboard, ShieldAlert, LogOut } from 'lucide-react';

export default function Navbar({ user, logout }) {
    return (
        <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-2 font-bold text-xl">
                    <LayoutDashboard className={user?.role === 'admin' ? "text-red-600" : "text-blue-600"} />
                    TaskFlow Workspace
                    {user?.role === 'admin' && (
                        <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center gap-1">
                             Admin
                        </span>
                    )}
                </div>
                <button onClick={logout} className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600">
                    <LogOut size={16} /> Logout
                </button>
            </div>
        </nav>
    );
}
