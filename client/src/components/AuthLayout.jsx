import React from 'react';
import { Link } from 'react-router-dom';

/**
 * AuthLayout - Reusable wrapper for Login, Signup, and Forgot Password pages.
 * Provides the consistent "Solar Aid" premium dashboard aesthetic.
 */
const AuthLayout = ({ children, title, subtitle, showBrand = true, split = false, sideContent = null }) => {
    return (
        <div className="min-h-screen bg-[#0B1120] flex items-center justify-center p-6 relative overflow-hidden"
            style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #172554 0%, #0B1120 70%)' }}>

            {/* Background Decorative Glows */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] translate-y-1/2 pointer-events-none" />

            <div className={`${split ? 'max-w-6xl' : 'max-w-md'} w-full relative z-10 transition-all duration-500`}>
                <div className={`flex flex-col ${split ? 'lg:flex-row' : ''} gap-12 lg:gap-20 items-center`}>

                    {/* Left Column (Marketing/Side Content) */}
                    {split && sideContent && (
                        <div className="flex-1 text-center lg:text-left animate-fade-in-left space-y-8">
                            {sideContent}
                        </div>
                    )}

                    {/* Right Column (Auth Card) */}
                    <div className={`${split ? 'w-full lg:max-w-md' : 'w-full'} flex flex-col items-center lg:items-stretch`}>
                        {/* Brand Header (Only centered if not split, or if specified) */}
                        {showBrand && (
                            <div className={`mb-10 animate-fade-in ${split ? 'self-center lg:self-start' : 'flex flex-col items-center'}`}>
                                <Link to="/" className="flex items-center gap-3 group">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                                        <span className="text-white font-black text-xl">SA</span>
                                    </div>
                                    <div className="text-left">
                                        <h1 className="text-2xl font-black text-white tracking-tighter leading-none">SOLAR AID</h1>
                                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mt-1">Sustainability Protocol</p>
                                    </div>
                                </Link>
                            </div>
                        )}

                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-2xl relative overflow-hidden w-full">
                            {/* Top accent line */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-400 to-blue-600"></div>

                            {(!split || title) && (
                                <div className="mb-8 text-center">
                                    <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">{title}</h2>
                                    {subtitle && <p className="text-slate-400 text-sm font-medium">{subtitle}</p>}
                                </div>
                            )}

                            {children}
                        </div>

                        {/* Return Home Link */}
                        <div className="mt-8 text-center lg:text-left">
                            <Link to="/" className="text-slate-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors inline-flex items-center gap-2">
                                <span className="text-sm">←</span> Return to Homepage
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
