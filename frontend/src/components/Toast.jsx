import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Toast({ message, type, onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColors = type === 'error' ? 'bg-red-100 border-red-500 text-red-700' : 'bg-green-100 border-green-500 text-green-700';

    return (
        <div className={`fixed top-4 right-4 p-4 rounded shadow-lg border-l-4 ${bgColors} flex items-center gap-2 z-50`}>
            {type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
            <p className="font-medium">{message}</p>
        </div>
    );
}
