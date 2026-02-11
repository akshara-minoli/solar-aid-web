import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const SolarReports = () => {
    const [householdData, setHouseholdData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Try to fetch household data for calculations
        const fetchHouseholdData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/users/household', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (data.success && data.household) {
                    setHouseholdData(data.household);
                }
            } catch (error) {
                console.log('Using default values for demo');
                // Set default demo data
                setHouseholdData({
                    roofArea: 1500,
                    members: 4,
                    houseType: 'house',
                    district: 'Sample District'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchHouseholdData();
    }, []);

    const calculateSolarMetrics = (roofArea) => {
        const capacity = roofArea * 0.004; // 4W per sqft
        const cost = capacity * 150000; // Rs. 150,000 per kW
        const monthlySavings = capacity * 1200; // Rs. 1,200 per kW per month
        const annualProduction = capacity * 1200; // 1200 kWh per kW per year
        const carbonOffset = capacity * 1.2; // 1.2 tons CO2 per kW per year

        return { capacity, cost, monthlySavings, annualProduction, carbonOffset };
    };

    const roofArea = householdData?.roofArea || 1500;
    const metrics = calculateSolarMetrics(roofArea);

    if (loading) {
        return (
            <DashboardLayout title="Solar Reports">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="text-4xl mb-4">⏳</div>
                        <p className="text-slate-600">Loading solar reports...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title="Solar Reports">
            <div className="space-y-8 animate-in fade-in duration-700">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">📊</div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Your Solar Energy Reports</h1>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Comprehensive analytics and projections for your solar journey. Track savings, 
                        energy production, and environmental impact.
                    </p>
                </div>

                {/* Key Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200 text-center">
                        <div className="text-3xl mb-3">☀️</div>
                        <h3 className="font-bold text-yellow-800 mb-2 text-sm">Solar Capacity</h3>
                        <p className="text-2xl font-bold text-yellow-700">{metrics.capacity.toFixed(1)} kW</p>
                        <p className="text-xs text-yellow-600 mt-1">Recommended system size</p>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-xl border border-emerald-200 text-center">
                        <div className="text-3xl mb-3">💰</div>
                        <h3 className="font-bold text-emerald-800 mb-2 text-sm">Monthly Savings</h3>
                        <p className="text-2xl font-bold text-emerald-700">Rs. {metrics.monthlySavings.toFixed(0)}</p>
                        <p className="text-xs text-emerald-600 mt-1">On electricity bills</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 text-center">
                        <div className="text-3xl mb-3">⚡</div>
                        <h3 className="font-bold text-blue-800 mb-2 text-sm">Annual Production</h3>
                        <p className="text-2xl font-bold text-blue-700">{metrics.annualProduction.toFixed(0)} kWh</p>
                        <p className="text-xs text-blue-600 mt-1">Clean energy generated</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-xl border border-green-200 text-center">
                        <div className="text-3xl mb-3">🌱</div>
                        <h3 className="font-bold text-green-800 mb-2 text-sm">Carbon Offset</h3>
                        <p className="text-2xl font-bold text-green-700">{metrics.carbonOffset.toFixed(1)} tons</p>
                        <p className="text-xs text-green-600 mt-1">CO₂ reduced annually</p>
                    </div>
                </div>

                {/* Detailed Reports */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Financial Report */}
                    <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
                        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <span className="text-2xl">💵</span>
                            Financial Analysis
                        </h2>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-slate-100">
                                <span className="text-slate-600">Initial Investment</span>
                                <span className="font-bold text-slate-800 text-lg">Rs. {metrics.cost.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-slate-100">
                                <span className="text-slate-600">Monthly Savings</span>
                                <span className="font-bold text-emerald-600 text-lg">Rs. {metrics.monthlySavings.toFixed(0)}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-slate-100">
                                <span className="text-slate-600">Annual Savings</span>
                                <span className="font-bold text-emerald-600 text-lg">Rs. {(metrics.monthlySavings * 12).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-slate-100">
                                <span className="text-slate-600">Payback Period</span>
                                <span className="font-bold text-orange-600 text-lg">{(metrics.cost / (metrics.monthlySavings * 12)).toFixed(1)} years</span>
                            </div>
                            <div className="flex justify-between items-center py-3">
                                <span className="text-slate-600">25-Year Savings</span>
                                <span className="font-bold text-green-600 text-lg">Rs. {((metrics.monthlySavings * 12 * 25) - metrics.cost).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Environmental Impact */}
                    <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
                        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <span className="text-2xl">🌍</span>
                            Environmental Impact
                        </h2>
                        
                        <div className="space-y-6">
                            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                                <div className="text-3xl mb-2">🌳</div>
                                <p className="text-lg font-bold text-green-700">{Math.floor(metrics.carbonOffset * 3)} Trees</p>
                                <p className="text-sm text-green-600">Equivalent trees planted annually</p>
                            </div>
                            
                            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="text-3xl mb-2">🚗</div>
                                <p className="text-lg font-bold text-blue-700">{Math.floor(metrics.carbonOffset * 2.5)}km</p>
                                <p className="text-sm text-blue-600">Car emissions avoided monthly</p>
                            </div>
                            
                            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                                <div className="text-3xl mb-2">🏠</div>
                                <p className="text-lg font-bold text-purple-700">{(metrics.annualProduction / 1000).toFixed(1)} MWh</p>
                                <p className="text-sm text-purple-600">Clean energy for your home</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Monthly Breakdown Chart Placeholder */}
                <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <span className="text-2xl">📈</span>
                        Projected Monthly Performance
                    </h2>
                    
                    <div className="grid grid-cols-12 gap-2 mb-4">
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => {
                            const monthlyGeneration = metrics.annualProduction * (0.07 + (Math.sin(index * Math.PI / 6) * 0.03));
                            const barHeight = (monthlyGeneration / (metrics.annualProduction / 12)) * 100;
                            
                            return (
                                <div key={month} className="text-center">
                                    <div className="h-32 bg-slate-100 rounded-t flex items-end justify-center mb-2 relative">
                                        <div 
                                            className="bg-gradient-to-t from-yellow-500 to-orange-400 w-full rounded-t transition-all duration-1000"
                                            style={{ height: `${Math.min(barHeight, 100)}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-slate-600 font-medium">{month}</p>
                                    <p className="text-xs text-slate-500">{monthlyGeneration.toFixed(0)} kWh</p>
                                </div>
                            );
                        })}
                    </div>
                    
                    <div className="text-center text-sm text-slate-600">
                        <p>Estimated monthly solar energy generation based on seasonal patterns</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="text-center space-y-4">
                    <h3 className="text-lg font-bold text-slate-800">Ready to Go Solar?</h3>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button 
                            onClick={() => window.location.hash = 'add-household'}
                            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                            📝 Update Household Info
                        </button>
                        <button className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg">
                            📞 Request Quote
                        </button>
                        <button className="px-6 py-3 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-semibold rounded-xl transition-all duration-300">
                            💬 Talk to Expert
                        </button>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
};

export default SolarReports;