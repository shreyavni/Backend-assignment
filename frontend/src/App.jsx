import React, { useState } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Toast from './components/Toast';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import Navbar from './components/Navbar';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState('login');
  const [toast, setToast] = useState(null);

  return (
    <AuthProvider>
      <AuthContext.Consumer>
        {({ token, user, logout }) => {

          // ✅ FIX: Agar token hai par user object abhi tak decode nahi hua, toh loading show karo (crash roko)
          if (token && !user) {
            return <div className="min-h-screen flex items-center justify-center text-gray-500 animate-pulse">Loading session...</div>;
          }

          let Content;
          if (!token) {
            Content = currentRoute === 'register'
              ? <Register navigate={setCurrentRoute} showToast={(msg, t) => setToast({ message: msg, type: t })} />
              : <Login navigate={setCurrentRoute} showToast={(msg, t) => setToast({ message: msg, type: t })} />;
          } else {
            Content = (
              <div className="min-h-screen bg-gray-100">
                <Navbar user={user} logout={logout} />

                {/* ✅ FIX: user?.role lagaya gaya hai taaki undefined errors na aayein */}
                {user?.role === 'admin'
                  ? <AdminDashboard showToast={(msg, t) => setToast({ message: msg, type: t })} logout={logout} />
                  : <UserDashboard showToast={(msg, t) => setToast({ message: msg, type: t })} logout={logout} />
                }
              </div>
            );
          }

          return (
            <div className="font-sans text-gray-900 antialiased">
              {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
              {Content}
            </div>
          );
        }}
      </AuthContext.Consumer>
    </AuthProvider>
  );
}