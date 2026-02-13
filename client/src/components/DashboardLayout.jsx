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
        navigate('/login');
    };

    const menuItems = [
        { id: 'dashboard', label: 'Overview', icon: '📊', to: '/home' },
        { id: 'view-household', label: 'Household Profile', icon: '🏠', to: '/view-household' },
        { id: 'profile', label: 'My Profile', icon: '👤', to: '/profile' },
    ];

    const activeId = currentHash.substring(1) || 'dashboard';

    return (
        /* h-screen + overflow-hidden on the root ensures no double scrollbars */
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">

            {/* ── Sidebar - 30% Primary Color ── */}
            <aside className="w-72 h-full bg-emerald-600 text-white flex flex-col flex-shrink-0 z-50 shadow-xl relative" style={{ backgroundColor: '#059669' }}>

                {/* Brand/Logo */}
                <div className="px-8 py-8 flex items-center gap-4 flex-shrink-0 border-b border-white/10">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md">
                        <span className="text-2xl">☀️</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tight leading-none text-white">SOLAR AID</h1>
                        <p className="text-[10px] text-white/70 font-semibold uppercase tracking-wider mt-0.5">Smart Energy</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                    {menuItems.map((item) => {
                        return (
                            <Link
                                key={item.id}
                                to={item.to}
                                className="flex items-center gap-4 px-5 py-4 rounded-xl text-sm font-semibold group relative focus:outline-none select-none no-underline"
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className="tracking-wide">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Card */}
                <div
                    onClick={() => navigate('/profile')}
                    className="m-4 p-6 rounded-2xl bg-emerald-700 backdrop-blur-md border border-white/10 flex-shrink-0 hover:bg-emerald-700/80 transition-all duration-300 cursor-pointer"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-white text-emerald-600 flex items-center justify-center font-bold text-lg shadow-md flex-shrink-0">
                            {userName.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden flex-1">
                            <p className="text-[10px] font-semibold text-white/60 uppercase tracking-wider leading-none mb-1">Logged In</p>
                            <p className="text-sm font-bold text-white truncate">{userName}</p>
                        </div>
                    </div>
                </div>

                {/* Sign Out Button - 10% Accent */}
                <div className="px-4 pb-4 flex-shrink-0">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-orange-500 hover:border-orange-500 transition-all duration-300 font-semibold text-sm cursor-pointer group"
                    >
                        <span className="group-hover:-translate-x-1 transition-transform">←</span>
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* ── Main Content Area - 60% Neutral ── */}
            <div className="flex-1 flex flex-col min-h-full overflow-hidden relative bg-slate-50">

                {/* Top Header */}
                <header className="z-40 bg-white border-b border-slate-200 shadow-sm flex-shrink-0">
                    <div className="px-10 py-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
                            <p className="text-sm text-slate-500 mt-1">Manage your solar energy journey</p>
                        </div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <main className="flex-1 p-6 overflow-y-auto relative scroll-smooth">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
