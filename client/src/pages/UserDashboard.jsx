<<<<<<< Updated upstream
import DashboardLayout from '../components/DashboardLayout';
import ConsultationCard from '../components/ConsultationCard';
import AssistanceCard from '../components/AssistanceCard';

const UserDashboard = () => {
    const navigateTo = (page) => {
        window.location.hash = page;
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

    return (
        <DashboardLayout title="Dashboard">
            <div className="space-y-12 animate-in fade-in duration-700">

                {/* Welcome Banner - 30% Primary Color */}
                <div className="relative overflow-hidden bg-emerald-600 p-6 shadow-lg">
                    <div className="relative z-10">
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Welcome back, {userName.split(' ')[0]}!</h1>
                        <p className="text-white/90 text-sm leading-relaxed">
                            Keep your home energy-efficient. Monitor your solar potential and optimize savings with ease.
                        </p>
                    </div>
                </div>

                {/* Quick Actions - 60% Neutral + 10% Accent */}
                <div>
                    <h2 className="text-xl font-bold text-slate-800 mb-6">Quick Actions</h2>
                    <div className="max-w-md">
                        <button
                            onClick={() => navigateTo('add-household')}
                            className="group bg-white hover:bg-slate-50 rounded-xl p-6 border border-slate-200 transition-all duration-300 cursor-pointer text-left shadow-sm hover:shadow-md"
                        >
                            <div className="flex items-center justify-center w-14 h-14 bg-orange-500 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-3xl">🏠</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-2">Update Household</h3>
                            <p className="text-slate-600 text-sm">Manage your home configuration</p>
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

                {/* Main Features Grid - 60% Neutral + 30% Primary */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-800">My Solar Journey</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            {
                                title: 'Household Profile',
                                desc: 'Configure your house structural details and roof area for high-precision solar mapping.',
                                icon: '🏠',
                                route: 'view-household',
                                cta: 'View Profile'
                            },
                            {
                                title: 'Solar Reports',
                                desc: 'Get a 12-month projection of savings, ROI, and carbon offset statistics.',
                                icon: '📊',
                                route: 'reports',
                                cta: 'View Insights'
                            }
                        ].map((item, i) => (
                            <div key={i} className="group bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300 flex flex-col h-full">
                                <div className="h-28 bg-emerald-600 flex items-center justify-center relative overflow-hidden">
                                    <span className="text-5xl group-hover:scale-110 transition-transform duration-300 filter drop-shadow-lg">{item.icon}</span>
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
                                </div>
                                <div className="p-5 flex flex-col flex-grow">
                                    <h4 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h4>
                                    <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-grow">{item.desc}</p>
                                    <button
                                        onClick={() => navigateTo(item.route)}
                                        className="w-full py-2.5 rounded-lg bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 hover:shadow-md transition-all duration-300 cursor-pointer"
                                    >
                                        {item.cta}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </DashboardLayout>
=======
import { useState, useEffect } from 'react';

const UserDashboard = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Get user from local storage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            // If no user, redirect to login
            window.location.hash = 'login';
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.hash = 'home';
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white p-6 shadow-lg">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <span className="text-3xl">☀️</span>
                        <h1 className="text-2xl font-bold">Solar Aid Dashboard</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="hidden md:inline">Welcome, {user.fullName || 'User'}</span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-semibold transition duration-200"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto p-6">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">My Overview</h2>
                    <p className="text-gray-600">Manage your household solar journey from here.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* Household Card */}
                    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden cursor-pointer" onClick={() => window.location.hash = 'view-household'}>
                        <div className="p-6">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-2xl mb-4">
                                🏠
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Household Profile</h3>
                            <p className="text-gray-500 mb-4">View and update your house details, roof area, and location.</p>
                            <span className="text-orange-600 font-semibold flex items-center">
                                View Details →
                            </span>
                        </div>
                    </div>

                    {/* Appliances Card */}
                    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden cursor-pointer" onClick={() => window.location.hash = 'view-appliances'}>
                        <div className="p-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl mb-4">
                                ⚡
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">My Appliances</h3>
                            <p className="text-gray-500 mb-4">Manage your appliances to calculate accurate power consumption.</p>
                            <span className="text-blue-600 font-semibold flex items-center">
                                Manage Appliances →
                            </span>
                        </div>
                    </div>

                    {/* Reports Card */}
                    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden cursor-pointer">
                        <div className="p-6">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl mb-4">
                                📊
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Solar Reports</h3>
                            <p className="text-gray-500 mb-4">View your estimated savings, solar potential, and cost breakdown.</p>
                            <span className="text-green-600 font-semibold flex items-center">
                                View Reports →
                            </span>
                        </div>
                    </div>

                </div>

                {/* Quick Actions */}
                <div className="mt-10">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => window.location.hash = 'add-appliance'}
                            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition duration-200 shadow-md font-semibold"
                        >
                            <span>➕</span>
                            <span>Add New Appliance</span>
                        </button>
                        <button
                            onClick={() => window.location.hash = 'add-household'}
                            className="flex items-center justify-center space-x-2 bg-white border-2 border-orange-500 text-orange-600 px-6 py-3 rounded-lg hover:bg-orange-50 transition duration-200 font-semibold"
                        >
                            <span>✏️</span>
                            <span>Update Household Info</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
>>>>>>> Stashed changes
    );
};

export default UserDashboard;
