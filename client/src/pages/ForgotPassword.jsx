import React, { useState } from 'react';

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
            // Simulate API call
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
                setMessage('Reset link sent! Please check your email inbox.');
            } else {
                setMessage(data.message || 'Error requesting reset.');
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            setMessage('Network error. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-orange-100 rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-emerald-50 rounded-full blur-3xl opacity-50" />

            <div className="max-w-xl w-full relative z-10">
                <div className="bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[3.5rem] shadow-2xl border border-white/50">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2 text-2xl font-bold">
                            <span className="text-3xl">☀️</span>
                            <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">Solar Aid</span>
                        </div>
                        <a href="#login" className="text-gray-400 hover:text-orange-500 transition-colors">
                            ✕
                        </a>
                    </div>

                    <div className="mb-10 text-center">
                        <div className="w-20 h-20 bg-orange-100 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6">🔑</div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
                        <p className="text-gray-500 font-medium">No worries, we'll send you reset instructions.</p>
                    </div>

                    {isSuccess ? (
                        <div className="space-y-8 text-center animate-fade-in">
                            <div className="p-6 bg-emerald-50 text-emerald-600 rounded-3xl border border-emerald-100 font-bold">
                                {message}
                            </div>
                            <a
                                href="#login"
                                className="block w-full p-5 bg-orange-500 text-white rounded-[1.5rem] text-lg font-bold transition-all duration-300 shadow-xl shadow-orange-500/20 hover:bg-orange-600 hover:-translate-y-1 hover:shadow-2xl"
                            >
                                Back to Login
                            </a>
                        </div>
                    ) : (
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm text-gray-800 font-bold ml-1">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full p-5 bg-gray-50 border-2 border-transparent rounded-[1.5rem] text-base transition-all duration-300 focus:outline-none focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-100/50"
                                    required
                                />
                            </div>

                            {message && (
                                <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-center font-bold text-sm animate-fade-in">
                                    {message}
                                </div>
                            )}

                            <button
                                type="submit"
                                className={`w-full p-5 bg-orange-500 text-white rounded-[1.5rem] text-lg font-bold transition-all duration-300 shadow-xl shadow-orange-500/20 ${loading
                                        ? 'opacity-70 cursor-not-allowed'
                                        : 'hover:bg-orange-600 hover:-translate-y-1 hover:shadow-2xl'
                                    }`}
                                disabled={loading}
                            >
                                {loading ? 'Sending...' : 'Reset Password'}
                            </button>

                            <div className="text-center pt-4">
                                <a href="#login" className="text-gray-500 hover:text-orange-500 font-bold transition-colors">
                                    ← Back to Login
                                </a>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
