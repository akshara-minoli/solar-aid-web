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
        <DashboardLayout title={content.category}>
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                {content.category}
                            </span>
                            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                {content.difficulty}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                            {content.title}
                        </h1>
                        <div className="flex items-center gap-6 text-emerald-50 text-sm">
                            <span className="flex items-center gap-1.5">
                                📅 {new Date(content.createdAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1.5">
                                👁️ {content.views} Views
                            </span>
                            <span className="flex items-center gap-1.5">
                                ❤️ {content.likes} Likes
                            </span>
                        </div>
                    </div>

                    <div className="p-8">
                        <p className="text-slate-600 text-lg leading-relaxed italic border-l-4 border-emerald-500 pl-6 mb-8">
                            "{content.description}"
                        </p>

                        <div className="prose prose-emerald max-w-none">
                            <div
                                className="text-slate-800 text-lg leading-relaxed whitespace-pre-wrap"
                                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                            >
                                {content.content}
                            </div>
                        </div>

                        {content.videoUrl && (
                            <div className="mt-12">
                                <h2 className="text-xl font-bold text-slate-800 mb-4">🎥 Related Video</h2>
                                <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={content.videoUrl.replace('watch?v=', 'embed/')}
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-slate-50 p-6 border-t border-slate-200 flex justify-between items-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-medium"
                        >
                            &larr; Back to Learning Hub
                        </button>
                        <div className="flex gap-4">
                            <span className="text-slate-500 text-sm">Content Type: <strong>{content.contentType}</strong></span>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default EducationDetail;
