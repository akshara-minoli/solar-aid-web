import React, { useState, useEffect } from 'react';

const WeatherInsights = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/weather', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();

                if (data.success) {
                    setWeatherData(data.data);
                } else {
                    setError(data.message);
                }
            } catch (err) {
                setError('Failed to load weather insights');
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 animate-pulse">
                <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="h-20 bg-slate-100 rounded-xl"></div>
                    <div className="h-20 bg-slate-100 rounded-xl"></div>
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
        temperature,
        humidity,
        cloudCoverage,
        solarEfficiencyScore,
        installationRecommendation,
        icon,
        condition
    } = weatherData;

    const getEfficiencyColor = (score) => {
        if (score > 70) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
        if (score >= 40) return 'text-orange-600 bg-orange-50 border-orange-100';
        return 'text-red-600 bg-red-50 border-red-100';
    };

    const scoreColorClass = getEfficiencyColor(solarEfficiencyScore);

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            🌤 Weather Insights
                        </h3>
                        <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-slate-600 text-sm font-medium">
                            <span>📍 Colombo</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl">
                                🌡️
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Temp</p>
                                <p className="text-xl font-black text-slate-800">{temperature}°C</p>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl">
                                ☁️
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Clouds</p>
                                <p className="text-xl font-black text-slate-800">{cloudCoverage}%</p>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl">
                                💧
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Humidity</p>
                                <p className="text-xl font-black text-slate-800">{humidity}%</p>
                            </div>
                        </div>

                        <div className={`p-4 rounded-2xl border flex items-center gap-4 ${scoreColorClass}`}>
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl">
                                ☀️
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider opacity-70">Efficiency</p>
                                <p className="text-xl font-black">{solarEfficiencyScore}%</p>
                            </div>
                        </div>
                    </div>

                    <div className={`mt-6 p-4 rounded-xl border flex items-center gap-3 font-bold ${scoreColorClass}`}>
                        <span className="text-xl">📌</span>
                        Recommendation: {installationRecommendation}
                    </div>
                </div>
            </div>

            {/* Smart Feature Banner */}
            {solarEfficiencyScore > 75 && (
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4 rounded-xl text-white font-bold flex items-center gap-3 shadow-lg shadow-emerald-500/20 animate-in slide-in-from-bottom-4 duration-500">
                    <span className="text-2xl font-normal">✨</span>
                    Today is ideal for solar panel installation or testing.
                </div>
            )}

            {solarEfficiencyScore < 40 && (
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 rounded-xl text-white font-bold flex items-center gap-3 shadow-lg shadow-orange-500/20 animate-in slide-in-from-bottom-4 duration-500">
                    <span className="text-2xl font-normal">⚠️</span>
                    High cloud coverage may reduce solar energy production today.
                </div>
            )}
        </div>
    );
};

export default WeatherInsights;
