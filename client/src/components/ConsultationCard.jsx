import { useState } from 'react';

const ConsultationCard = () => {
    const API_URL = import.meta.env.VITE_API_URL || 'https://solar-aid-web.onrender.com/api';
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        village: '',
        phoneNumber: '',
        consultationType: '',
        description: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(''); // Clear error on input change
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Please login to submit a consultation request');
                setLoading(false);
                return;
            }

            const response = await fetch(`${API_URL}/consultations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit consultation request');
            }

            setSubmitted(true);
            setTimeout(() => {
                setShowForm(false);
                setSubmitted(false);
                setFormData({
                    fullName: '',
                    village: '',
                    phoneNumber: '',
                    consultationType: '',
                    description: ''
                });
            }, 2000);
        } catch (err) {
            setError(err.message || 'Failed to submit consultation request');
        } finally {
            setLoading(false);
        }
    };

    if (showForm) {
        return (
            <div className="bg-[#0B1120] rounded-2xl border border-white/10 p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>
                <div className="flex items-center justify-between mb-8 relative z-10">
                    <h3 className="text-base font-black text-white tracking-tight uppercase">Solar Consultation Protocol</h3>
                    <button
                        onClick={() => setShowForm(false)}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {submitted ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 text-center animate-in fade-in zoom-in duration-300 relative z-10">
                        <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                            <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-emerald-400 font-bold">Request submitted successfully!</p>
                        <p className="text-slate-400 text-sm mt-1">We will contact you shortly.</p>
                    </div>
                ) : (
                    <div className="relative z-10">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 animate-in slide-in-from-top-2 duration-300">
                                <p className="text-red-400 text-sm font-medium flex items-center gap-2">
                                    <span>⚠️</span> {error}
                                </p>
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all font-medium"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                                        Village
                                    </label>
                                    <input
                                        type="text"
                                        name="village"
                                        value={formData.village}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all font-medium"
                                        placeholder="Enter your village"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all font-medium"
                                        placeholder="+94 XX XXX XXXX"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                                        Consultation Type
                                    </label>
                                    <select
                                        name="consultationType"
                                        value={formData.consultationType}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all font-medium appearance-none"
                                    >
                                        <option value="" className="bg-[#111827] text-white">Select type</option>
                                        <option value="Solar Installation" className="bg-[#111827] text-white">Solar Installation</option>
                                        <option value="System Maintenance" className="bg-[#111827] text-white">System Maintenance</option>
                                        <option value="Energy Efficiency" className="bg-[#111827] text-white">Energy Efficiency</option>
                                        <option value="Financial Planning" className="bg-[#111827] text-white">Financial Planning</option>
                                        <option value="Other" className="bg-[#111827] text-white">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                                    Description <span className="text-slate-600 font-normal normal-case ml-1">(Optional)</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all font-medium resize-none text-sm"
                                    placeholder="Describe your consultation needs..."
                                />
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-white/5">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 tracking-wide uppercase text-xs"
                                >
                                    {loading ? 'Submitting...' : 'Submit Request'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    disabled={loading}
                                    className="px-8 py-3.5 bg-white/5 border border-white/10 text-slate-300 rounded-xl font-bold hover:bg-white/10 transition-all uppercase text-xs tracking-wide"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-xl hover:bg-white/10 transition-all duration-500 group cursor-pointer relative overflow-hidden text-left h-full flex flex-col justify-center">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all duration-700"></div>

            <div className="flex items-start gap-6 relative z-10">
                <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                    <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-black text-white mb-2 tracking-tight uppercase">Expert Consultation</h3>
                    <p className="text-slate-400 text-sm mb-6 leading-relaxed max-w-sm">
                        Ask questions and get expert advice before installing your solar system.
                    </p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all duration-300 shadow-lg shadow-emerald-500/10 inline-flex items-center gap-2 group/btn"
                    >
                        <span>Start Now</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConsultationCard;
