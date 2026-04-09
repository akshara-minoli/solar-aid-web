import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (data.success) {
                setIsSuccess(true);
                setMessage('Recovery protocol initiated. Please check your secure inbox for instructions.');
            } else {
                setMessage(data.message || 'Error processing recovery request.');
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            setMessage('Network error. Security link temporarily unavailable.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Reset Password"
            subtitle="Enter your email to recover your account"
        >
            {isSuccess ? (
                <div className="space-y-8 text-center animate-fade-in">
                    <div className="p-6 bg-blue-500/10 text-blue-400 rounded-3xl border border-blue-500/20 font-black text-[10px] uppercase tracking-[0.2em] leading-relaxed">
                        {message}
                    </div>
                    <Link
                        to="/login"
                        className="block w-full py-4 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-blue-600/20 hover:bg-blue-500 hover:shadow-blue-500/40 hover:-translate-y-0.5"
                    >
                        Return to Terminal
                    </Link>
                </div>
            ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="mb-8 text-center">
                        <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 border border-blue-500/20">🔑</div>
                        <p className="text-slate-400 text-xs font-medium leading-relaxed">
                            Enter your registered identity email to receive an encrypted recovery sequence.
                        </p>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Identity Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="email@example.com"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-medium placeholder:text-slate-600"
                            required
                        />
                    </div>

                    {message && (
                        <div className="p-4 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20 text-center font-black text-[10px] uppercase tracking-widest animate-fade-in">
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-blue-600/20 ${loading
                            ? 'opacity-70 cursor-not-allowed'
                            : 'hover:bg-blue-500 hover:shadow-blue-500/40 hover:-translate-y-0.5'
                            }`}
                    >
                        {loading ? 'Sending Request...' : 'Reset Password'}
                    </button>

                    <div className="text-center pt-4 border-t border-white/5">
                        <Link to="/login" className="text-[10px] font-black text-slate-500 hover:text-blue-400 uppercase tracking-widest transition-colors">
                            ← Return to Login
                        </Link>
                    </div>
                </form>
            )}
        </AuthLayout>
    );
};

export default ForgotPassword;

