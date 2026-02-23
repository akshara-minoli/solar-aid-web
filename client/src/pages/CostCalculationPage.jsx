import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import CostCalculation from '../components/CostCalculation';

const CostCalculationPage = () => {
    return (
        <DashboardLayout title="Cost Calculation">
            <div className="space-y-10 animate-in fade-in duration-700">

                {/* Header */}
                <div className="relative overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-3xl shadow-2xl group">
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl group-hover:bg-yellow-500/20 transition-all duration-700"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-6 mb-4">
                            <div className="w-16 h-16 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-center justify-center text-4xl">
                                💰
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-white tracking-tight uppercase">
                                    Cost Calculation
                                </h1>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                                    Solar Investment Analysis · Sri Lanka 2026
                                </p>
                            </div>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-2xl italic font-medium">
                            Estimate your solar installation cost, annual energy savings, and payback period using real-time solar
                            irradiance data from the NREL PVWatts V8 API and Sri Lanka 2026 electricity rates.
                        </p>
                    </div>
                </div>

                {/* Calculator Component */}
                <CostCalculation />

            </div>
        </DashboardLayout>
    );
};

export default CostCalculationPage;
