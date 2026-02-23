import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import api from '../api';

const EducationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/api/education/${id}`);
                if (res.data && res.data.success) {
                    setContent(res.data.data);
                } else {
                    setError('Content not found');
                }
            } catch (err) {
                console.error('Error fetching detail:', err);
                setError('Failed to load content. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [id]);

    if (loading) {
        return (
            <DashboardLayout title="Loading...">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin text-4xl">⏳</div>
                </div>
            </DashboardLayout>
        );
    }

    if (error || !content) {
        return (
            <DashboardLayout title="Error">
                <div className="max-w-4xl mx-auto p-6 text-center">
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
                        {error || 'Something went wrong'}
                    </div>
                    <button
                        onClick={() => navigate(-1)}
                        className="text-emerald-600 font-medium hover:underline"
                    >
                        &larr; Go Back
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title="Knowledge Manifest">
            <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">

                {/* Visual Header Section */}
                <div className="relative overflow-hidden bg-white/5 backdrop-blur-md border border-white/5 rounded-[2.5rem] shadow-2xl group">
                    <div className="absolute top-0 right-0 -mt-24 -mr-24 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] group-hover:bg-blue-600/20 transition-all duration-1000"></div>

                    <div className="relative z-10 p-10 md:p-16">
                        <div className="flex flex-wrap items-center gap-4 mb-8">
                            <span className="bg-blue-600/20 border border-blue-500/30 text-blue-400 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em]">
                                {content.category}
                            </span>
                            <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border ${content.difficulty === 'Advanced' ? 'bg-rose-500/20 border-rose-500/30 text-rose-400' :
                                    content.difficulty === 'Intermediate' ? 'bg-orange-500/20 border-orange-500/30 text-orange-400' :
                                        'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                                }`}>
                                Level: {content.difficulty}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-[1.05] uppercase">
                            {content.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <span className="flex items-center gap-2">
                                <span className="text-blue-500">📅</span> {new Date(content.createdAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="text-blue-500">👁️</span> {content.views} Operational Views
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="text-rose-500">❤️</span> {content.likes} User Endorsements
                            </span>
                        </div>
                    </div>
                </div>

                {/* Primary Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8 space-y-10">
                        <div className="bg-white/5 backdrop-blur-md border border-white/5 p-10 md:p-12 rounded-[2.5rem] shadow-xl relative">
                            <div className="absolute top-0 left-0 w-16 h-16 bg-blue-500/5 rounded-br-[3rem]"></div>

                            <p className="text-slate-400 text-xl leading-relaxed font-bold italic border-l-4 border-blue-500 pl-10 mb-12 py-2">
                                {content.description}
                            </p>

                            <div className="prose prose-invert prose-blue max-w-none">
                                <div
                                    className="text-slate-300 text-lg leading-relaxed whitespace-pre-wrap font-medium"
                                    style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                                >
                                    {content.content}
                                </div>
                            </div>
                        </div>

                        {content.videoUrl && (
                            <div className="bg-white/5 backdrop-blur-md border border-white/5 p-10 rounded-[2.5rem] shadow-xl">
                                <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                    <span className="text-2xl font-normal">🎥</span> Visual Technical Brief
                                </h2>
                                <div className="aspect-video rounded-3xl overflow-hidden bg-black/40 border border-white/10 shadow-inner group">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={content.videoUrl.replace('watch?v=', 'embed/')}
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="transition-transform duration-700 group-hover:scale-[1.02]"
                                    ></iframe>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white/5 backdrop-blur-md border border-white/5 p-8 rounded-[2rem] shadow-xl sticky top-8">
                            <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-6">Article Metadata</h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Content Type</p>
                                    <p className="text-white font-bold">{content.contentType}</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">System Status</p>
                                    <p className="text-emerald-400 font-bold flex items-center gap-2">
                                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                        Verified Information
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate(-1)}
                                className="w-full mt-10 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 group"
                            >
                                <span className="text-base group-hover:-translate-x-1 transition-transform">←</span>
                                Knowledge Registry
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default EducationDetail;
