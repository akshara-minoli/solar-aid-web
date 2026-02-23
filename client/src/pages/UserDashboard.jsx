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
    const [activeTab, setActiveTab] = useState('overview');
    const [latestConsult, setLatestConsult] = useState(null);
    const [householdCount, setHouseholdCount] = useState(0);
    const [pendingServices, setPendingServices] = useState(0);

    const navigateTo = (page) => {
        if (page === 'view-household') navigate('/view-household');
        else if (page === 'consultations') navigate('/consultations');
        else if (page === 'maintenance') navigate('/maintenance');
        else navigate('/home');
    };

    // Fetch dashboard telemetry
    useEffect(() => {
        const fetchTelemetry = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const headers = { 'Authorization': `Bearer ${token}` };

                // Fetch Consultations
                const consultRes = await fetch('/api/consultations', { headers });
                const consultData = await consultRes.json();
                if (consultData.success && consultData.data && consultData.data.length > 0) {
                    setLatestConsult(consultData.data[0]);
                }

                // Fetch Households
                const householdRes = await fetch('/api/households', { headers });
                const householdData = await householdRes.json();
                if (householdData.success) {
                    setHouseholdCount(householdData.data.length);
                }

                // Fetch Service Requests
                const serviceRes = await fetch('/api/assistances', { headers });
                const serviceData = await serviceRes.json();
                if (serviceData.success) {
                    const pending = serviceData.data.filter(r => r.status === 'Pending').length;
                    setPendingServices(pending);
                }

            } catch (err) {
                console.error('Telemetry sync error:', err);
            }
        };
        fetchTelemetry();
    }, []);

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
                <div className="relative overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-2xl group">
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700"></div>
                    <div className="relative z-10 text-left">
                        <h1 className="text-2xl md:text-4xl font-bold text-white mb-3 tracking-tight">Welcome back, {userName.split(' ')[0]}!</h1>
                        <p className="text-slate-400 text-base leading-relaxed max-w-2xl">
                            Keep your home energy-efficient and optimize usage with ease. Your solar journey is looking bright.
                        </p>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white/5 backdrop-blur-md border border-white/5 p-1.5 rounded-2xl inline-flex max-sm:flex">
                    <div className="flex overflow-x-auto no-scrollbar gap-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 text-sm whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <span className="text-base">{tab.icon}</span>
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
                                <h2 className="text-[10px] font-black text-slate-500 mb-4 flex items-center gap-2 uppercase tracking-[0.2em]">
                                    <span className="text-blue-400">⚡</span> Quick Actions
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    <button
                                        onClick={() => navigateTo('view-household')}
                                        className="group bg-white/5 backdrop-blur-md border border-white/5 hover:bg-white/10 rounded-2xl p-6 transition-all duration-300 cursor-pointer text-left shadow-lg hover:border-white/10"
                                    >
                                        <div className="flex items-center justify-center w-12 h-12 bg-orange-500/20 text-orange-400 border border-orange-500/20 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                            <span className="text-2xl">🏠</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-1 tracking-tight">Household Profile</h3>
                                        <p className="text-slate-400 text-sm">
                                            {householdCount > 0
                                                ? `${householdCount} Verified Unit${householdCount > 1 ? 's' : ''}`
                                                : 'Manage your home configuration'}
                                        </p>
                                    </button>

                                    <button
                                        onClick={() => navigateTo('consultations')}
                                        className="group bg-white/5 backdrop-blur-md border border-white/5 hover:bg-white/10 rounded-2xl p-6 transition-all duration-300 cursor-pointer text-left shadow-lg hover:border-white/10"
                                    >
                                        <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                            <span className="text-2xl">🩺</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-1 tracking-tight">My Consultations</h3>
                                        <p className="text-slate-400 text-sm">
                                            {latestConsult
                                                ? `Status: ${latestConsult.status}`
                                                : 'View & manage your requests'}
                                        </p>
                                    </button>

                                    <button
                                        onClick={() => navigateTo('maintenance')}
                                        className="group bg-white/5 backdrop-blur-md border border-white/5 hover:bg-white/10 rounded-2xl p-6 transition-all duration-300 cursor-pointer text-left shadow-lg hover:border-white/10"
                                    >
                                        <div className="flex items-center justify-center w-12 h-12 bg-purple-500/20 text-purple-400 border border-purple-500/20 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                            <span className="text-2xl">🔧</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-1 tracking-tight">Service Hub</h3>
                                        <p className="text-slate-400 text-sm">
                                            {pendingServices > 0
                                                ? `${pendingServices} Active Alert${pendingServices > 1 ? 's' : ''}`
                                                : 'Request & track schedules'}
                                        </p>
                                    </button>
                                </div>
                            </div>

                            {/* Strategic Support Section */}
                            <div>
                                <h2 className="text-[10px] font-black text-slate-500 mb-4 flex items-center gap-2 uppercase tracking-[0.2em]">
                                    <span className="text-indigo-400">🤝</span> Get Help
                                </h2>
                                <div className="grid grid-cols-1 gap-8 items-start">
                                    <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl p-0 overflow-hidden shadow-xl">
                                        <ConsultationCard />
                                    </div>
                                </div>
                            </div>

                            {/* Weather Insights */}
                            <WeatherInsights />
                        </div>
                    )}

                    {/* Education Tab */}
                    {activeTab === 'education' && (
                        <div className="animate-in fade-in duration-300">
                            <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-2xl">
                                <EducationHub />
                            </div>
                        </div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <div className="animate-in fade-in duration-300">
                            <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-2xl text-slate-200">
                                <UserNotifications />
                            </div>
                        </div>
                    )}

                    {/* Feedback Tab */}
                    {activeTab === 'feedback' && (
                        <div className="animate-in fade-in duration-300">
                            <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-2xl">
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
