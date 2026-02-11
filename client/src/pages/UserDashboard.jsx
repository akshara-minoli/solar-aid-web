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
                                route: 'add-household',
                                cta: 'Register Household'
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
    );
};

export default UserDashboard;
