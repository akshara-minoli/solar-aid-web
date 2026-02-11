import { useState } from 'react';

const ConsultationCard = () => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        village: '',
        phoneNumber: '',
        consultationType: '',
        description: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here (API call, etc.)
        console.log('Consultation Form Data:', formData);
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
    };

    if (showForm) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-800">Solar Consultation Form</h3>
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
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
                        <svg className="w-12 h-12 text-emerald-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-emerald-800 font-semibold">Consultation request submitted successfully!</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Village
                            </label>
                            <input
                                type="text"
                                name="village"
                                value={formData.village}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                placeholder="Enter your village"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                placeholder="+94 XX XXX XXXX"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Consultation Type
                            </label>
                            <select
                                name="consultationType"
                                value={formData.consultationType}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white"
                            >
                                <option value="">Select consultation type</option>
                                <option value="installation-advice">Installation Advice</option>
                                <option value="cost-inquiry">Cost Inquiry</option>
                                <option value="system-size-help">System Size Help</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows="4"
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                                placeholder="Describe your consultation needs..."
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow-sm hover:shadow-md"
                            >
                                Submit Request
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer">
            <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                    <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Need Solar Consultation?</h3>
                    <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                        Ask questions and get expert advice before installing solar panels.
                    </p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-emerald-700 transition-colors shadow-sm hover:shadow inline-flex items-center gap-2"
                    >
                        <span>Start Consultation</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConsultationCard;
