import React from 'react';
import { Link } from 'react-router-dom';

const EducationPreview = () => {
    const learningPaths = [
        {
            title: 'Solar for Beginners',
            icon: '🌱',
            image: '/src/assets/photo/lesson_thumb.png',
            snippet: 'Sunlight is the world\'s most abundant energy source. Learn how a simple panel can transform your daily life by providing free power from the sky.',
            items: ['What is Solar Energy?', 'How Panels Catch Sunlight', 'Safety for Children & Pets'],
            color: 'from-orange-400 to-orange-500'
        },
        {
            title: 'Installation Guide',
            icon: '🛠️',
            image: '/src/assets/photo/hero_solar.png',
            snippet: 'Setting up your solar system doesn\'t have to be hard. We show you the best spots on your roof and how to connect wires safely.',
            items: ['Choosing the Sunniest Spot', 'Mounting Panels Safely', 'Battery Connection Basics'],
            color: 'from-blue-400 to-blue-500'
        },
        {
            title: 'Maintenance Tips',
            icon: '🧼',
            image: '/src/assets/photo/maintenance_thumb.png',
            snippet: 'A little care goes a long way. Learn how to keep your panels clean and your batteries healthy for years of trouble-free power.',
            items: ['Cleaning Dust & Leaves', 'Checking Your Battery', 'Wiring Safety Checks'],
            color: 'from-emerald-400 to-emerald-500'
        }
    ];

    return (
        <section className="py-24 px-4 md:px-8 bg-slate-50" id="learn">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                        Ready to <span className="text-orange-500">Master</span> Your Home Solar?
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">
                        We've broken down complex solar technology into simple, easy-to-follow lessons for everyone.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-32">
                        <div className="space-y-4">
                            <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-sm border border-orange-100 hover:shadow-md transition-shadow cursor-default">
                                <div className="text-3xl bg-orange-100 w-12 h-12 flex items-center justify-center rounded-xl">📱</div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Watch & Learn</h4>
                                    <p className="text-gray-600 text-sm">Over 50 short video lessons translated into local languages.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-sm border border-blue-100 hover:shadow-md transition-shadow cursor-default">
                                <div className="text-3xl bg-blue-100 w-12 h-12 flex items-center justify-center rounded-xl">🗣️</div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Local Mentors</h4>
                                    <p className="text-gray-600 text-sm">Ask questions in our community forum and get answers fast.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-sm border border-emerald-100 hover:shadow-md transition-shadow cursor-default">
                                <div className="text-3xl bg-emerald-100 w-12 h-12 flex items-center justify-center rounded-xl">📜</div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Earn Certificates</h4>
                                    <p className="text-gray-600 text-sm">Get recognized as a community solar leader after finishing.</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Link
                                to="/signin"
                                className="w-full inline-flex items-center justify-center gap-2 px-8 py-5 bg-orange-500 text-white rounded-2xl font-bold text-lg hover:bg-orange-600 transition-all hover:shadow-xl hover:-translate-y-1 shadow-lg shadow-orange-500/20"
                            >
                                Unlock All Lessons Now <span>🔓</span>
                            </Link>
                        </div>
                    </div>

                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {learningPaths.map((path, index) => (
                            <div
                                key={index}
                                className="group bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img src={path.image} alt={path.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm">
                                        <span className="text-xl">{path.icon}</span>
                                        <span className="font-bold text-gray-900 text-sm">{path.title}</span>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <div className="bg-white/20 backdrop-blur-md rounded-full p-4 scale-75 group-hover:scale-100 transition-transform duration-500">
                                            <span className="text-white text-3xl">▶️</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 flex-1 flex flex-col">
                                    <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">"{path.snippet}"</p>

                                    <ul className="space-y-3 mb-8">
                                        {path.items.map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-gray-800 font-semibold text-sm">
                                                <span className="w-2 h-2 rounded-full bg-orange-500" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="mt-auto">
                                        <Link
                                            to="/login"
                                            className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-2xl text-gray-400 group-hover:text-orange-500 group-hover:bg-orange-50 transition-colors font-bold text-sm"
                                        >
                                            <span>🔒 Start this Guide</span>
                                            <span>→</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Video Special Card */}
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 flex flex-col justify-center items-center text-center space-y-6 md:col-span-2 lg:col-span-1 shadow-xl">
                            <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center animate-pulse">
                                <span className="text-4xl text-white">📽️</span>
                            </div>
                            <h4 className="text-white font-bold text-xl">New Video Available:</h4>
                            <p className="text-slate-400 text-sm">"How our community is changing with Solar Energy" - Watch real stories from rural families.</p>
                            <Link to="/login" className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-colors">
                                Sign in to Watch Full Story
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EducationPreview;
