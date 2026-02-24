import React from 'react';
import { Link } from 'react-router-dom';

const SuccessStories = () => {
    const stories = [
        {
            name: "Saman Kumara",
            location: "Anuradhapura",
            story: "Before Solar Aid, we relied on expensive kerosene. Now my grandchildren can study until late at night without any smoke. It changed our lives.",
            tag: "Family Success",
            videoUrl: "https://www.youtube.com/embed/nO3W4_u_gqM" // Solar impact story
        },
        {
            name: "Leela Devi",
            location: "Polonnaruwa",
            story: "I was afraid solar would be too technical. The guides here are so simple even I could understand how to maintain my panels.",
            tag: "Easy Learning",
            videoUrl: "https://www.youtube.com/embed/n42Xm1O8WAc" // Solar maintenance basics
        }
    ];

    return (
        <section className="py-24 px-4 md:px-8 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8 text-center lg:text-left">
                    <div className="max-w-2xl space-y-4">
                        <div className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 rounded-full font-bold text-sm tracking-wide uppercase">
                            Real Impact
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                            Stories from our <span className="text-emerald-600">Community</span>
                        </h2>
                        <p className="text-xl text-gray-600 font-medium font-outfit">
                            See how families just like yours are saving money and living better with Solar Aid.
                        </p>
                    </div>
                    <Link
                        to="/signin"
                        className="group flex items-center gap-3 text-orange-500 font-bold text-lg hover:text-orange-600 transition-colors"
                    >
                        Join the Community <span className="w-12 h-12 rounded-full border-2 border-orange-500 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all">→</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {stories.map((story, index) => (
                        <div key={index} className="flex flex-col md:flex-row bg-slate-50 rounded-[3rem] overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-shadow duration-500">
                            <div className="md:w-1/2 relative bg-slate-200 aspect-video md:aspect-auto">
                                {/* Video Placeholder Styling */}
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/10 group cursor-pointer">
                                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl transform transition-transform group-hover:scale-110">
                                        <span className="text-3xl ml-1">▶️</span>
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-md p-3 rounded-2xl">
                                        <p className="text-xs font-bold text-gray-900">Sign in to watch {story.name}'s story</p>
                                    </div>
                                </div>
                            </div>
                            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center space-y-6">
                                <span className="text-emerald-600 font-bold text-sm tracking-widest uppercase">{story.tag}</span>
                                <blockquote className="text-xl text-gray-800 font-medium leading-relaxed italic">
                                    "{story.story}"
                                </blockquote>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-lg">{story.name}</h4>
                                    <p className="text-gray-500 font-medium">{story.location}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-20 bg-emerald-600 rounded-[3.5rem] p-10 md:p-20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl opacity-30" />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-center lg:text-left">
                        <div className="space-y-6">
                            <h3 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                                Interested in making the switch?
                            </h3>
                            <p className="text-emerald-50 text-xl font-medium">
                                Log in now to calculate your savings and see the exact steps for your home.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-end">
                            <Link to="/login" className="px-10 py-5 bg-white text-emerald-600 rounded-2xl font-bold text-xl hover:bg-emerald-50 transition-all hover:-translate-y-1 shadow-xl">
                                Log In & Check Steps
                            </Link>
                            <Link to="/signin" className="px-10 py-5 bg-emerald-700 text-white rounded-2xl border-2 border-emerald-500 font-bold text-xl hover:bg-emerald-800 transition-all hover:-translate-y-1">
                                Create Free Account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SuccessStories;
