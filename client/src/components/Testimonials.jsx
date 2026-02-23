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
        <section className="py-16 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <h2 className="text-2xl font-black text-white tracking-tight uppercase">Community Intelligence</h2>
                    <p className="mt-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest max-w-2xl">
                        Synthesized reports from our global network of verified solar adopters.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((item) => (
                        <div
                            key={item._id}
                            className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/5 flex flex-col justify-between hover:bg-white/10 hover:border-white/10 transition-all duration-500 group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all"></div>
                            <div className="relative z-10">
                                <div className="flex gap-1.5 mb-6">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <span key={s} className={`text-sm ${s <= item.rating ? 'grayscale-0 drop-shadow-[0_0_8px_rgba(234,179,8,0.3)]' : 'grayscale opacity-10'}`}>
                                            ⭐
                                        </span>
                                    ))}
                                </div>
                                <h4 className="font-black text-white mb-3 truncate uppercase tracking-tight text-sm">{item.title}</h4>
                                <p className="text-slate-400 text-sm leading-relaxed italic line-clamp-4 font-medium">
                                    "{item.message}"
                                </p>
                            </div>

                            <div className="mt-8 flex items-center gap-4 border-t border-white/5 pt-6 relative z-10">
                                <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 font-black text-xs border border-blue-500/20 shadow-lg">
                                    {item.isAnonymous ? '👤' : (item.userId?.fullName?.charAt(0) || 'U')}
                                </div>
                                <div>
                                    <p className="text-xs font-black text-white uppercase tracking-wider">
                                        {item.isAnonymous ? 'Anonymous Sync' : (item.userId?.fullName || 'Verified Node')}
                                    </p>
                                    <p className="text-[9px] text-blue-500 font-black uppercase tracking-widest mt-0.5">
                                        {item.feedbackType.replace('Feedback', '').trim()} Protocol
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
