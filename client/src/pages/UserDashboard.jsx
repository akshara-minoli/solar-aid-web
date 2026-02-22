import DashboardLayout from '../components/DashboardLayout';
import ConsultationCard from '../components/ConsultationCard';
import AssistanceCard from '../components/AssistanceCard';
import WeatherInsights from '../components/WeatherInsights';
import EducationHub from '../components/EducationHub';
import UserNotifications from '../components/UserNotifications';
import SubmitFeedback from '../components/SubmitFeedback';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    
    const navigateTo = (page) => {
        if (page === 'view-household') navigate('/view-household');
        else if (page === 'consultations') navigate('/consultations');
        else if (page === 'maintenance') navigate('/maintenance');
        else navigate('/home');
    };

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

    const tabs = [
        { id: 'overview', label: 'Overview', icon: '📊' },
        { id: 'education', label: 'Learn', icon: '📚' },
        { id: 'notifications', label: 'Updates', icon: '🔔' },
        { id: 'feedback', label: 'Feedback', icon: '💬' }
    ];

    return (
        <DashboardLayout title="Dashboard">
            <div className="space-y-6 animate-in fade-in duration-700">

                {/* Welcome Banner */}
                <div className="relative overflow-hidden bg-emerald-600 p-6 shadow-lg">
                    <div className="relative z-10">
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Welcome back, {userName.split(' ')[0]}!</h1>
                        <p className="text-white/90 text-sm leading-relaxed">
                            Keep your home energy-efficient and optimize usage with ease.
                        </p>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <div className="flex overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-4 font-medium transition-all flex items-center gap-2 border-b-2 ${
                                    activeTab === tab.id
                                        ? 'border-emerald-600 text-emerald-600 bg-emerald-50'
                                        : 'border-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                                }`}
                            >
                                <span>{tab.icon}</span>
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div>
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="space-y-8 animate-in fade-in duration-300">
                            {/* Quick Actions */}
                            <div>
                                <h2 className="text-xl font-bold text-slate-800 mb-6">Quick Actions</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <button
                                        onClick={() => navigateTo('view-household')}
                                        className="group bg-white hover:bg-slate-50 rounded-xl p-6 border border-slate-200 transition-all duration-300 cursor-pointer text-left shadow-sm hover:shadow-md"
                                    >
                                        <div className="flex items-center justify-center w-14 h-14 bg-orange-500 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                            <span className="text-3xl">🏠</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-2">Household Profile</h3>
                                        <p className="text-slate-600 text-sm">Manage your home configuration</p>
                                    </button>

                                    <button
                                        onClick={() => navigateTo('consultations')}
                                        className="group bg-white hover:bg-slate-50 rounded-xl p-6 border border-slate-200 transition-all duration-300 cursor-pointer text-left shadow-sm hover:shadow-md"
                                    >
                                        <div className="flex items-center justify-center w-14 h-14 bg-blue-600 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                            <span className="text-3xl">💬</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-2">My Consultations</h3>
                                        <p className="text-slate-600 text-sm">View & manage your requests</p>
                                    </button>

                                    <button
                                        onClick={() => navigateTo('maintenance')}
                                        className="group bg-white hover:bg-slate-50 rounded-xl p-6 border border-slate-200 transition-all duration-300 cursor-pointer text-left shadow-sm hover:shadow-md"
                                    >
                                        <div className="flex items-center justify-center w-14 h-14 bg-purple-600 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                            <span className="text-3xl">🔧</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-2">Maintenance & Service</h3>
                                        <p className="text-slate-600 text-sm">Request service & track schedules</p>
                                    </button>
                                </div>
                            </div>

                            {/* Consultation & Assistance Cards */}
                            <div>
                                <h2 className="text-xl font-bold text-slate-800 mb-6">Get Help</h2>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <ConsultationCard />
                                    <AssistanceCard />
                                </div>
                            </div>

                            {/* Weather Insights */}
                            <WeatherInsights />
                        </div>
                    )}

                    {/* Education Tab */}
                    {activeTab === 'education' && (
                        <div className="animate-in fade-in duration-300">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <EducationHub />
                            </div>
                        </div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <div className="animate-in fade-in duration-300">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <UserNotifications />
                            </div>
                        </div>
                    )}

                    {/* Feedback Tab */}
                    {activeTab === 'feedback' && (
                        <div className="animate-in fade-in duration-300">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <SubmitFeedback />
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </DashboardLayout>
    );
};

export default UserDashboard;
