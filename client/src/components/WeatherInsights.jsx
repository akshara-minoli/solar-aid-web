import React, { useState, useEffect } from 'react';

const WeatherInsights = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserDataAndWeather = async () => {
            try {
                const token = localStorage.getItem('token');

                // 1. Fetch household data to get district
                const householdResponse = await fetch('/api/households', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const householdData = await householdResponse.json();

                let userDistrict = 'Colombo'; // Default
                if (householdData.success && householdData.households && householdData.households.length > 0) {
                    userDistrict = householdData.households[0].district || 'Colombo';
                }

                // 2. Fetch weather for that district
                const weatherResponse = await fetch(`/api/weather?city=${userDistrict}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const weatherData = await weatherResponse.json();

                if (weatherData.success) {
                    setWeatherData(weatherData.data);
                } else {
                    setError(weatherData.message);
                }
            } catch (err) {
                console.error('Weather Component Error:', err);
                setError('Failed to load personalized weather insights');
            } finally {
                setLoading(false);
            }
        };

        fetchUserDataAndWeather();
    }, []);

    if (loading) {
        return (
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/5 animate-pulse">
                <div className="h-6 bg-white/10 rounded w-1/3 mb-4"></div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="h-20 bg-white/5 rounded-xl"></div>
                    <div className="h-20 bg-white/5 rounded-xl"></div>
                    <div className="h-20 bg-white/5 rounded-xl"></div>
                    <div className="h-20 bg-white/5 rounded-xl"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-red-600">
                <p className="flex items-center gap-2 font-semibold">
                    <span>⚠️</span> {error}
                </p>
            </div>
        );
    }

    if (!weatherData) return null;

    const {
        city,
        temperature,
        humidity,
        cloudCoverage,
        solarEfficiencyScore,
        installationRecommendation,
        icon,
        condition
    } = weatherData;

    const getEfficiencyColor = (score) => {
        if (score > 70) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
        if (score >= 40) return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
        return 'text-red-400 bg-red-500/10 border-red-500/20';
    };

    const scoreColorClass = getEfficiencyColor(solarEfficiencyScore);

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="bg-white/5 backdrop-blur-md rounded-3xl overflow-hidden border border-white/5 shadow-2xl relative group">
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all duration-700"></div>
                <div className="p-8 text-left relative z-10">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-tight">
                            <span className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">🌤</span>
                            Weather Insight
                        </h3>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-slate-400 text-[10px] font-black uppercase tracking-widest">
                            <span className="text-blue-400">📍</span> Sensor Location: {city}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="p-6 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-5 group/item hover:bg-white/10 transition-all duration-500">
                            <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-2xl group-hover/item:scale-110 transition-transform">
                                🌡️
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Temperature</p>
                                <p className="text-2xl font-black text-white">{temperature}°C</p>
                            </div>
                        </div>

                        <div className="p-6 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-5 group/item hover:bg-white/10 transition-all duration-500">
                            <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-2xl group-hover/item:scale-110 transition-transform">
                                ☁️
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Cloud Coverage</p>
                                <p className="text-2xl font-black text-white">{cloudCoverage}%</p>
                            </div>
                        </div>

                        <div className="p-6 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-5 group/item hover:bg-white/10 transition-all duration-500">
                            <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center text-2xl group-hover/item:scale-110 transition-transform">
                                💧
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Humidity</p>
                                <p className="text-2xl font-black text-white">{humidity}%</p>
                            </div>
                        </div>

                        <div className={`p-6 rounded-2xl border flex items-center gap-5 group/item transition-all duration-500 ${scoreColorClass.replace('bg-', 'bg-opacity-20 bg-')}`}>
                            <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center text-2xl group-hover/item:scale-110 transition-transform">
                                ☀️
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Solar Efficacy</p>
                                <p className="text-2xl font-black">{solarEfficiencyScore}%</p>
                            </div>
                        </div>
                    </div>

                    <div className={`mt-8 p-6 rounded-2xl border flex items-center gap-5 transition-all duration-500 overflow-hidden relative ${scoreColorClass}`}>
                        <div className="absolute inset-0 bg-white/5 blur-xl"></div>
                        <span className="text-3xl relative z-10">📌</span>
                        <div className="text-left relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Strategic Recommendation</p>
                            <p className="text-sm font-bold tracking-tight italic">"{installationRecommendation}"</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Smart Feature Banner */}
            {solarEfficiencyScore > 75 && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl text-emerald-400 font-bold flex items-center gap-4 animate-in slide-in-from-bottom-4 duration-700">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-xl">✨</div>
                    <p className="text-xs uppercase tracking-widest font-black">Optimal Conditions Detected: Ideal parameters for array deployment.</p>
                </div>
            )}

            {solarEfficiencyScore < 40 && (
                <div className="bg-rose-500/10 border border-rose-500/20 p-5 rounded-2xl text-rose-400 font-bold flex items-center gap-4 animate-in slide-in-from-bottom-4 duration-700">
                    <div className="w-10 h-10 bg-rose-500/20 rounded-xl flex items-center justify-center text-xl">⚠️</div>
                    <p className="text-xs uppercase tracking-widest font-black">Signal Attenuation: High cloud density impacting photovoltaic output.</p>
                </div>
            )}
        </div>
    );
};

export default WeatherInsights;
