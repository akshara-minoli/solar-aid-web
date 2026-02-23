import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const DashboardLayout = ({ children, title }) => {
    const [userName, setUserName] = useState('User');
    const [currentHash, setCurrentHash] = useState(window.location.hash);

    useEffect(() => {
        // Watch for hash changes globally
        const handleHashChange = () => {
            setCurrentHash(window.location.hash);
        };
        window.addEventListener('hashchange', handleHashChange);

        // Fetch user info
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                setUserName(user.fullName || user.name || user.email || 'User');
            } catch {
                setUserName('User');
            }
        }

        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const menuItems = [
        { id: 'dashboard', label: 'Overview', icon: '📊', to: '/home' },
        { id: 'view-household', label: 'Household Profile', icon: '🏠', to: '/view-household' },
        { id: 'maintenance', label: 'Maintenance / Service', icon: '🛠️', to: '/maintenance' },
        { id: 'profile', label: 'My Profile', icon: '👤', to: '/profile' },
    ];

    const activeId = currentHash.substring(1) || 'dashboard';

    return (
        /* h-screen + overflow-hidden on the root ensures no double scrollbars */
        <div className="flex h-screen bg-[#0B1120] font-sans text-slate-200 overflow-hidden">
            <aside className="w-72 h-full bg-[#060B14] text-slate-400 flex flex-col flex-shrink-0 z-50 shadow-2xl relative border-r border-white/5">

                {/* Brand/Logo */}
                <div className="px-8 py-8 flex items-center gap-4 flex-shrink-0 border-b border-white/5">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <span className="text-white font-bold text-lg">SA</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-black tracking-tight leading-none text-white uppercase">SOLAR AID</h1>
                        <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mt-1">Smart Energy</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                    {menuItems.map((item) => {
                        return (
                            <Link
                                key={item.id}
                                to={item.to}
                                className="flex items-center gap-4 px-5 py-3.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/5 border border-transparent transition-all duration-200 group relative focus:outline-none select-none no-underline"
                            >
                                <span className="text-xl opacity-70 group-hover:opacity-100 transition-opacity">{item.icon}</span>
                                <span className="tracking-wide">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Card */}
                <div
                    onClick={() => navigate('/profile')}
                    className="m-4 p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/5 flex-shrink-0 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-lg shadow-inner flex-shrink-0">
                            {userName.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden flex-1 text-left">
                            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest leading-none mb-1">User Account</p>
                            <p className="text-sm font-bold text-white truncate">{userName}</p>
                        </div>
                    </div>
                </div>

                {/* Sign Out Button - 10% Accent */}
                <div className="px-4 pb-4 flex-shrink-0">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-rose-500/10 hover:border-rose-500/20 transition-all duration-300 font-semibold text-sm cursor-pointer group"
                    >
                        <span className="group-hover:-translate-x-1 transition-transform">🚪</span>
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* ── Main Content Area - 60% Neutral ── */}
            <div className="flex-1 flex flex-col min-h-full overflow-hidden relative" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #172554 0%, #0B1120 70%)' }}>
                <header className="z-40 bg-white/5 backdrop-blur-md border-b border-white/5 shadow-lg flex-shrink-0">
                    <div className="px-10 py-6 flex items-center justify-between">
                        <div className="text-left">
                            <h2 className="text-2xl font-bold text-white tracking-wide">{title}</h2>
                            <p className="text-sm text-slate-400 mt-1">Manage your solar energy journey</p>
                        </div>
                    </div>
                </header>
                <main className="flex-1 p-6 overflow-y-auto relative scroll-smooth">
                    <div className="max-w-7xl mx-auto text-slate-200">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
