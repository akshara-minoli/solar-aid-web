import React from 'react';

const SolarProductionReport = ({ reportData, loading = false, error = null }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start">
          <svg className="w-6 h-6 text-red-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-red-800 font-semibold mb-1">Error Calculating Solar Production</h3>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return null;
  }

  const { production, financial, environmental, system, household } = reportData;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">☀️ Solar Production Report</h2>
        <p className="text-yellow-50">
          {household?.houseName || 'Your Household'} - {household?.district}
        </p>
        <p className="text-sm text-yellow-50 mt-1">
          System Size: {system?.size} kW | Roof Area: {household?.roofArea} m²
        </p>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Annual Production */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 text-sm font-semibold uppercase">Annual Production</h3>
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <p className="text-4xl font-bold text-gray-800">
            {production?.annualProductionKWh?.toLocaleString()}
          </p>
          <p className="text-gray-600 mt-1">kWh/year</p>
          <p className="text-sm text-gray-500 mt-2">
            Avg: {production?.averageMonthlyKWh?.toLocaleString()} kWh/month
          </p>
        </div>

        {/* Annual Savings */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 text-sm font-semibold uppercase">Annual Savings</h3>
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-4xl font-bold text-gray-800">
            Rs {financial?.annualSavingsLKR?.toLocaleString()}
          </p>
          <p className="text-gray-600 mt-1">per year</p>
          <p className="text-sm text-gray-500 mt-2">
            Rs {financial?.monthlySavingsLKR?.toLocaleString()}/month @ Rs {financial?.electricityRate}/kWh
          </p>
        </div>

        {/* Carbon Offset */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-emerald-500">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 text-sm font-semibold uppercase">Carbon Offset</h3>
            <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-4xl font-bold text-gray-800">
            {environmental?.carbonOffsetTons}
          </p>
          <p className="text-gray-600 mt-1">tons CO₂/year</p>
          <p className="text-sm text-gray-500 mt-2">
            ≈ {environmental?.equivalentTreesPlanted} trees planted
          </p>
        </div>
      </div>

      {/* Monthly Production Chart */}
      {production?.monthlyProductionKWh && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Monthly Production Estimate</h3>
          <div className="grid grid-cols-12 gap-2">
            {production.monthlyProductionKWh.map((value, index) => {
              const maxValue = Math.max(...production.monthlyProductionKWh);
              const heightPercent = (value / maxValue) * 100;
              const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              
              return (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-full h-32 flex items-end">
                    <div 
                      className="w-full bg-gradient-to-t from-yellow-500 to-orange-400 rounded-t transition-all hover:from-yellow-600 hover:to-orange-500"
                      style={{ height: `${heightPercent}%` }}
                      title={`${months[index]}: ${value.toLocaleString()} kWh`}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 mt-2">{months[index]}</span>
                  <span className="text-xs font-semibold text-gray-800">{Math.round(value)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* System Details */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">System Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">System Capacity</p>
            <p className="text-lg font-semibold text-gray-800">{system?.size} kW</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Capacity Factor</p>
            <p className="text-lg font-semibold text-gray-800">{(production?.capacityFactor * 100)?.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Panel Tilt Angle</p>
            <p className="text-lg font-semibold text-gray-800">{system?.tilt}°</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Azimuth Angle</p>
            <p className="text-lg font-semibold text-gray-800">{system?.azimuth}°</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Location</p>
            <p className="text-lg font-semibold text-gray-800">
              {system?.location?.lat?.toFixed(4)}, {system?.location?.lon?.toFixed(4)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">District</p>
            <p className="text-lg font-semibold text-gray-800 capitalize">{system?.location?.district}</p>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">About This Report</p>
            <p>
              This estimate is based on NREL PVWatts data and typical system parameters. 
              Actual production may vary based on weather conditions, system maintenance, 
              shading, and equipment performance. For precise calculations and system design, 
              please consult with a certified solar installer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolarProductionReport;
