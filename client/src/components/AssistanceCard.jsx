import { useState } from 'react';

const AssistanceCard = () => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        village: '',
        phoneNumber: '',
        assistanceType: '',
        problemDescription: '',
        image: null
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                image: file
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here (API call with FormData for file upload)
        console.log('Assistance Form Data:', formData);
        setSubmitted(true);
        setTimeout(() => {
            setShowForm(false);
            setSubmitted(false);
            setFormData({
                fullName: '',
                village: '',
                phoneNumber: '',
                assistanceType: '',
                problemDescription: '',
                image: null
            });
        }, 2000);
    };

    if (showForm) {
        return (
            <div className="bg-[#0B1120] rounded-2xl border border-white/10 p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl"></div>
                <div className="flex items-center justify-between mb-8 relative z-10">
                    <h3 className="text-base font-black text-white tracking-tight uppercase">Assistance Request Protocol</h3>
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
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-6 text-center animate-in fade-in zoom-in duration-300 relative z-10">
                        <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-500/30">
                            <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-orange-400 font-bold">Request submitted successfully!</p>
                        <p className="text-slate-400 text-sm mt-1">Our team will assist you shortly.</p>
                    </div>
                ) : (
                    <div className="relative z-10">
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
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all font-medium"
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
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all font-medium"
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
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all font-medium"
                                        placeholder="+94 XX XXX XXXX"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                                        Assistance Type
                                    </label>
                                    <select
                                        name="assistanceType"
                                        value={formData.assistanceType}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all font-medium appearance-none"
                                    >
                                        <option value="" className="bg-[#111827] text-white">Select type</option>
                                        <option value="installation" className="bg-[#111827] text-white">Installation</option>
                                        <option value="repair" className="bg-[#111827] text-white">Repair</option>
                                        <option value="maintenance" className="bg-[#111827] text-white">Maintenance</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                                    Problem Description
                                </label>
                                <textarea
                                    name="problemDescription"
                                    value={formData.problemDescription}
                                    onChange={handleChange}
                                    required
                                    rows="3"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all font-medium resize-none text-sm"
                                    placeholder="Describe the issue or assistance needed..."
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                                    Upload Image <span className="text-slate-600 font-normal normal-case ml-1">(Optional)</span>
                                </label>
                                <div className="relative group/file">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 focus:outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-orange-500/10 file:text-orange-400 hover:file:bg-orange-500/20 cursor-pointer"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-white/5">
                                <button
                                    type="submit"
                                    className="flex-1 bg-orange-500 hover:bg-orange-400 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-orange-500/20 tracking-wide uppercase text-xs"
                                >
                                    Submit Request
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
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
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-all duration-700"></div>

            <div className="flex items-start gap-6 relative z-10">
                <div className="w-16 h-16 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                    <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-black text-white mb-2 tracking-tight uppercase">Technical Assistance</h3>
                    <p className="text-slate-400 text-sm mb-6 leading-relaxed max-w-sm">
                        Request physical help for installing, repairing, or maintaining your solar panels.
                    </p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-orange-500/10 border border-orange-500/20 text-orange-400 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-lg shadow-orange-500/10 inline-flex items-center gap-2 group/btn"
                    >
                        <span>Request Aid</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssistanceCard;
