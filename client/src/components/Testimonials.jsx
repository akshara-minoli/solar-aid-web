import React, { useEffect, useState } from 'react';
import api from '../api';

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const res = await api.get('/api/feedback/public');
                if (res.data && res.data.success) {
                    setTestimonials(res.data.data);
                }
            } catch (err) {
                console.error('Error fetching testimonials:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTestimonials();
    }, []);

    if (loading) return (
        <div className="flex justify-center py-12">
            <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-slate-200 h-10 w-10"></div>
                <div className="flex-1 space-y-6 py-1">
                    <div className="h-2 bg-slate-200 rounded"></div>
                    <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                            <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                        </div>
                        <div className="h-2 bg-slate-200 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (testimonials.length === 0) return null;

    return (
        <section className="py-16 bg-slate-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Voices of Satisfaction</h2>
                    <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
                        Real stories from our community members who have embraced the power of the sun.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((item) => (
                        <div
                            key={item._id}
                            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div>
                                <div className="flex gap-1 mb-4">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <span key={s} className={`text-sm ${s <= item.rating ? 'grayscale-0' : 'grayscale opacity-30'}`}>
                                            ⭐
                                        </span>
                                    ))}
                                </div>
                                <h4 className="font-bold text-slate-800 mb-2 truncate">{item.title}</h4>
                                <p className="text-slate-600 text-sm leading-relaxed italic line-clamp-4">
                                    "{item.message}"
                                </p>
                            </div>

                            <div className="mt-8 flex items-center gap-4 border-t border-slate-50 pt-6">
                                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs border-2 border-white shadow-sm">
                                    {item.isAnonymous ? '👤' : (item.userId?.fullName?.charAt(0) || 'U')}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">
                                        {item.isAnonymous ? 'Anonymous Member' : (item.userId?.fullName || 'Valued User')}
                                    </p>
                                    <p className="text-[10px] text-slate-400 font-medium">
                                        Verified {item.feedbackType.replace('Feedback', '').trim()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
