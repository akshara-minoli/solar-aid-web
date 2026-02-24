import DashboardLayout from '../components/DashboardLayout';
import ConsultationCard from '../components/ConsultationCard';
import AssistanceCard from '../components/AssistanceCard';
import WeatherInsights from '../components/WeatherInsights';
import EducationHub from '../components/EducationHub';
import UserNotifications from '../components/UserNotifications';
import SubmitFeedback from '../components/SubmitFeedback';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
    const navigate = useNavigate();

    // Get user name from localStorage
    const userData = localStorage.getItem('user');
    let userName = 'User';
    try {
        if (userData) {
            const user = JSON.parse(userData);
            userName = user.fullName || user.name || 'User';
        }
    } catch (e) {
        userName = 'User';
    }

    const navigateTo = (page) => {
        if (page === 'view-household') navigate('/view-household');
        else if (page === 'consultations') navigate('/consultations');
        else if (page === 'maintenance') navigate('/maintenance');
        else navigate('/home');
    };

    return (
        <DashboardLayout title="Dashboard Overview">
            <div className="space-y-8 animate-in fade-in duration-700 pb-12">

                {/* 1. Welcome & Hero Section */}
                <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-900 p-8 md:p-12 shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="text-center md:text-left space-y-4">
                            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                                Ayubowan, <span className="text-emerald-400">{userName.split(' ')[0]}!</span>
                            </h1>
                            <p className="text-slate-400 text-lg max-w-md font-medium">
                                Your solar journey is looking bright. Manage everything for your smart home in one place.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => navigateTo('view-household')}
                                className="px-6 py-3 bg-white text-slate-900 rounded-2xl font-bold hover:bg-slate-100 transition-all active:scale-95"
                            >
                                🏠 My Home Profile
                            </button>
                            <button
                                onClick={() => navigateTo('maintenance')}
                                className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
                            >
                                🛠️ Request Service
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2. Main Dashboard Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT COLUMN: Main Operations */}
                    <div className="lg:col-span-8 space-y-10">

                        {/* Quick Actions Grid */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Quick Actions</h2>
                                <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-full uppercase tracking-widest">Control Center</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <button
                                    onClick={() => navigateTo('view-household')}
                                    className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 text-left"
                                >
                                    <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 group-hover:bg-orange-100 transition-all duration-300">
                                        🏘️
                                    </div>
                                    <h3 className="font-bold text-slate-800 mb-1 leading-tight">Home Data</h3>
                                    <p className="text-xs text-slate-500 font-medium">Manage panel counts & usage</p>
                                </button>

                                <button
                                    onClick={() => navigateTo('consultations')}
                                    className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 text-left"
                                >
                                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-300">
                                        📅
                                    </div>
                                    <h3 className="font-bold text-slate-800 mb-1 leading-tight">Meeting Logs</h3>
                                    <p className="text-xs text-slate-500 font-medium">History of expert calls</p>
                                </button>

                                <button
                                    onClick={() => navigateTo('maintenance')}
                                    className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 text-left"
                                >
                                    <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 group-hover:bg-purple-100 transition-all duration-300">
                                        ⚙️
                                    </div>
                                    <h3 className="font-bold text-slate-800 mb-1 leading-tight">Maintenance</h3>
                                    <p className="text-xs text-slate-500 font-medium">Check system health</p>
                                </button>
                            </div>
                        </section>

                        {/* Consultation & Assistance Section */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Personalized Support</h2>
                                <span className="px-3 py-1 bg-blue-50 text-blue-500 text-xs font-bold rounded-full uppercase tracking-widest">Get Help</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                                    <ConsultationCard />
                                </div>
                                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                                    <AssistanceCard />
                                </div>
                            </div>
                        </section>

                        {/* Education Hub (Formerly hidden) */}
                        <section className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-200 shadow-inner">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Learning Hub</h2>
                                <span className="text-sm font-bold text-emerald-600">Explore Guides →</span>
                            </div>
                            <div className="bg-white rounded-[2rem] p-8 shadow-sm">
                                <EducationHub />
                            </div>
                        </section>

                        {/* Feedback Section (Moved to Bottom of Main Column) */}
                        <section className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                            <h2 className="text-2xl font-black text-slate-800 mb-6">Help Us Improve</h2>
                            <SubmitFeedback />
                        </section>
                    </div>

                    {/* RIGHT COLUMN: Context & Updates */}
                    <div className="lg:col-span-4 space-y-10">

                        {/* Weather - Very important context */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-800 mb-4 px-2">Weather Context</h2>
                            <WeatherInsights />
                        </section>

                        {/* Recent Notifications Feed */}
                        <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-800 mb-6">Recent Alerts</h2>
                            <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                <UserNotifications />
                            </div>
                        </section>

                        {/* Tips Card */}
                        <div className="bg-orange-500 rounded-[2rem] p-8 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 scale-150 rotate-12 group-hover:scale-125 transition-transform duration-500">
                                <span className="text-6xl">💡</span>
                            </div>
                            <h4 className="text-xl font-bold mb-2">Pro Tip</h4>
                            <p className="text-sm text-white/90 font-medium">
                                Regularly cleaning your solar panels can increase efficiency by up to 15%.
                                Check your maintenance schedule for the best time!
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
};

export default UserDashboard;
