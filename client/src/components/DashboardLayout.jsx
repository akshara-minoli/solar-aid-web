import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const DashboardLayout = ({ children, title }) => {
    const [userName, setUserName] = useState('User');
    const [userEmail, setUserEmail] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                setUserName(user.fullName || user.name || user.email || 'User');
                setUserEmail(user.email || '');
            } catch {
                setUserName('User');
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const navigationGroups = [
        {
            group: 'Main',
            items: [
                { id: 'dashboard', label: 'Overview', icon: '📊', to: '/home' },
                { id: 'education', label: 'Learning Hub', icon: '📚', to: '/education' },
                { id: 'household', label: 'My Household', icon: '🏠', to: '/view-household' },
            ]
        },
        {
            group: 'Services',
            items: [
                { id: 'maintenance', label: 'Maintenance', icon: '🛠️', to: '/maintenance' },
                { id: 'consultations', label: 'Consultations', icon: '💬', to: '/consultations' },
            ]
        },
        {
            group: 'Account',
            items: [
                { id: 'profile', label: 'Profile Settings', icon: '👤', to: '/profile' },
                { id: 'feedback', label: 'Feedback', icon: '📝', to: '/home' }, // Stays on home/dashboard for now
            ]
        }
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="flex h-screen bg-[#f8fafc] font-sans text-slate-900 overflow-hidden">

            {/* ── Enhanced Sidebar ── */}
            <aside className="w-72 h-full bg-slate-900 text-white flex flex-col flex-shrink-0 z-50 shadow-2xl overflow-hidden">

                {/* Brand Section */}
                <div className="p-8 pb-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <span className="text-xl">☀️</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-black tracking-tight leading-none text-white">SOLAR AID</h1>
                            <div className="flex items-center gap-1.5 mt-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Platform Active</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Groups */}
                <nav className="flex-1 px-4 space-y-8 overflow-y-auto custom-scrollbar pt-2">
                    {navigationGroups.map((group) => (
                        <div key={group.group}>
                            <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">
                                {group.group}
                            </h3>
                            <div className="space-y-1">
                                {group.items.map((item) => (
                                    <Link
                                        key={item.id}
                                        to={item.to}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 group no-underline ${isActive(item.to)
                                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <span className={`text-lg transition-transform group-hover:scale-110 ${isActive(item.to) ? 'scale-110' : ''}`}>
                                            {item.icon}
                                        </span>
                                        <span>{item.label}</span>
                                        {isActive(item.to) && (
                                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-50" />
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* User Info Bar */}
                <div className="p-4 mt-auto">
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center font-black text-white shadow-inner">
                                {userName.charAt(0).toUpperCase()}
                            </div>
                            <div className="overflow-hidden min-w-0">
                                <p className="text-sm font-bold truncate text-white uppercase tracking-tight">{userName}</p>
                                <p className="text-[10px] text-slate-500 font-medium truncate">{userEmail}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-orange-600 transition-all duration-300 font-bold text-xs"
                        >
                            <span>Sign Out Instance</span>
                            <span>→</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* ── Main Content Area ── */}
            <div className="flex-1 flex flex-col min-h-full overflow-hidden relative">

                {/* Advanced Top Header */}
                <header className="z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 flex-shrink-0 sticky top-0">
                    <div className="px-8 h-20 flex items-center justify-between">
                        {/* Search Bar - Real Project feel */}
                        <div className="hidden md:flex flex-1 max-w-md relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">🔍</span>
                            <input
                                type="text"
                                placeholder="Search guides, status, or help..."
                                className="w-full pl-12 pr-4 py-2.5 bg-slate-100/50 border-transparent focus:bg-white focus:border-emerald-500 rounded-2xl text-sm font-medium transition-all outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Breadcrumb Title for Mobile */}
                        <div className="md:hidden">
                            <h2 className="text-xl font-black tracking-tight text-slate-800">{title}</h2>
                        </div>

                        {/* Top Actions */}
                        <div className="flex items-center gap-2 md:gap-4">
                            {/* Quick Action Button - Real World Feature */}
                            <button
                                onClick={() => navigate('/view-household')}
                                className="hidden lg:flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-md shadow-slate-200"
                            >
                                <span>+ Register Site</span>
                            </button>

                            <div className="hidden lg:block h-6 w-[1px] bg-slate-200 mx-2" />

                            {/* Help Icon */}
                            <button className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 transition-all" title="Help">
                                <span className="text-xl text-slate-400">❓</span>
                            </button>

                            {/* Notifications Bubble */}
                            <div className="relative">
                                <button
                                    onClick={() => navigate('/notifications')}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 transition-all"
                                >
                                    <span className="text-xl text-slate-400">🔔</span>
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                                </button>
                            </div>

                            <div className="h-8 w-[1px] bg-slate-200 mx-2" />

                            {/* User Header Profile */}
                            <div className="flex items-center gap-3 pl-2">
                                <div className="hidden text-right lg:block">
                                    <p className="text-xs font-black text-slate-800 leading-none">{userName}</p>
                                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">Free Tier Member</p>
                                </div>
                                <div
                                    onClick={() => navigate('/profile')}
                                    className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-emerald-500/20 transition-all overflow-hidden"
                                >
                                    <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center text-emerald-700 font-bold">
                                        {userName.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <main className="flex-1 p-8 overflow-y-auto bg-[#f8fafc] scroll-smooth">
                    <div className="max-w-7xl mx-auto">
                        {/* Page Header Snippet (Optional Context) */}
                        <div className="mb-8 animate-in slide-in-from-left duration-500">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h2>
                            <p className="text-slate-500 font-medium mt-1">Environment Monitoring / User Space</p>
                        </div>

                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
