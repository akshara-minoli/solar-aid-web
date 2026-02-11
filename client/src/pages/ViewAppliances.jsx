import { useState } from 'react';
<<<<<<< Updated upstream
import DashboardLayout from '../components/DashboardLayout';
=======
>>>>>>> Stashed changes

const ViewAppliances = () => {
  // Dummy appliances data
  const [appliances] = useState([
    { id: 1, name: 'LED Light Bulb', power: 9, hours: 6, category: 'Lighting' },
    { id: 2, name: 'Ceiling Fan', power: 60, hours: 8, category: 'Comfort' },
    { id: 3, name: 'Television (32")', power: 80, hours: 4, category: 'Entertainment' },
    { id: 4, name: 'Refrigerator', power: 150, hours: 24, category: 'Kitchen' },
    { id: 5, name: 'Washing Machine', power: 500, hours: 1, category: 'Utility' }
  ]);

  const navigateBack = () => {
    window.location.hash = 'dashboard';
  };

  const navigateToAdd = () => {
    window.location.hash = 'add-appliance';
  };

  // Calculate totals
  const totalPower = appliances.reduce((sum, appliance) => sum + appliance.power, 0);
  const totalDailyEnergy = appliances.reduce((sum, appliance) =>
    sum + (appliance.power * appliance.hours / 1000), 0
  );
  const totalMonthlyEnergy = totalDailyEnergy * 30;
  const estimatedMonthlyCost = totalMonthlyEnergy * 8; // ₹8 per kWh

  return (
<<<<<<< Updated upstream
    <DashboardLayout title="My Appliances">
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto space-y-10">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="text-8xl mb-6">⚡</div>
            <h2 className="text-5xl font-black text-slate-800 tracking-tight mb-3">My Appliances</h2>
            <p className="text-slate-500 text-xl">Track your energy consumption and solar needs</p>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg border-2 border-blue-200 p-6 text-center">
              <div className="text-5xl font-black text-blue-700 mb-2">{appliances.length}</div>
              <div className="text-base font-semibold text-blue-600">Total Appliances</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl shadow-lg border-2 border-orange-200 p-6 text-center">
              <div className="text-5xl font-black text-orange-700 mb-2">{totalPower}W</div>
              <div className="text-base font-semibold text-orange-600">Total Power</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl shadow-lg border-2 border-emerald-200 p-6 text-center">
              <div className="text-5xl font-black text-emerald-700 mb-2">{totalDailyEnergy.toFixed(1)} kWh</div>
              <div className="text-base font-semibold text-emerald-600">Daily Energy</div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl shadow-lg border-2 border-red-200 p-6 text-center">
              <div className="text-5xl font-black text-red-700 mb-2">₹{estimatedMonthlyCost.toFixed(0)}</div>
              <div className="text-base font-semibold text-red-600">Monthly Cost</div>
            </div>
          </div>

          {/* Main Content Card */}
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* Header with Add Button */}
            <div className="bg-gradient-to-r from-orange-500 to-yellow-500 px-10 py-8 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">📋</span>
                  <div>
                    <h3 className="text-3xl font-bold">Appliance List</h3>
                    <p className="text-orange-50 text-base">Manage your registered appliances</p>
                  </div>
                </div>
                <button
                  onClick={navigateToAdd}
                  className="bg-white hover:bg-orange-50 text-orange-600 px-8 py-4 rounded-xl transition-all duration-300 font-bold text-lg shadow-lg flex items-center gap-2"
                >
                  <span>➕</span>
                  <span>Add New Appliance</span>
                </button>
              </div>
            </div>

            {appliances.length === 0 ? (
              <div className="p-20 text-center">
                <div className="text-9xl mb-6">⚡</div>
                <h3 className="text-3xl font-bold text-slate-700 mb-4">No appliances added yet</h3>
                <p className="text-slate-500 mb-8 text-lg">Start by adding your first appliance to calculate your solar needs</p>
                <button
                  onClick={navigateToAdd}
                  className="bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white px-10 py-5 rounded-xl transition-all duration-300 font-bold text-lg shadow-lg"
                >
                  Add Your First Appliance
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b-2 border-slate-200">
                    <tr>
                      <th className="px-6 py-5 text-left text-sm font-black text-slate-700 uppercase tracking-wider">
                        Appliance Name
                      </th>
                      <th className="px-6 py-5 text-left text-sm font-black text-slate-700 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-5 text-left text-sm font-black text-slate-700 uppercase tracking-wider">
                        Power (W)
                      </th>
                      <th className="px-6 py-5 text-left text-sm font-black text-slate-700 uppercase tracking-wider">
                        Hours/Day
                      </th>
                      <th className="px-6 py-5 text-left text-sm font-black text-slate-700 uppercase tracking-wider">
                        Daily Energy (kWh)
                      </th>
                      <th className="px-6 py-5 text-left text-sm font-black text-slate-700 uppercase tracking-wider">
                        Monthly Cost (₹)
                      </th>
                      <th className="px-6 py-5 text-left text-sm font-black text-slate-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {appliances.map((appliance) => {
                      const dailyEnergy = (appliance.power * appliance.hours) / 1000;
                      const monthlyCost = dailyEnergy * 30 * 8; // ₹8 per kWh

                      return (
                        <tr key={appliance.id} className="hover:bg-slate-50 transition-colors duration-150">
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="text-base font-bold text-slate-900">
                              {appliance.name}
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span className="inline-flex px-4 py-2 text-sm font-bold rounded-full bg-blue-100 text-blue-800">
                              {appliance.category}
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-base text-slate-900 font-bold">
                            {appliance.power}W
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-base text-slate-900 font-semibold">
                            {appliance.hours}h
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-base font-bold text-emerald-600">
                            {dailyEnergy.toFixed(2)}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-base font-bold text-red-600">
                            ₹{monthlyCost.toFixed(0)}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex space-x-3">
                              <button className="text-orange-600 hover:text-orange-800 font-bold hover:underline transition-colors">
                                Edit
                              </button>
                              <button className="text-red-600 hover:text-red-800 font-bold hover:underline transition-colors">
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-gradient-to-r from-slate-50 to-slate-100 border-t-2 border-slate-300">
                    <tr>
                      <td className="px-6 py-5 text-base font-black text-slate-900" colSpan="2">
                        TOTAL
                      </td>
                      <td className="px-6 py-5 text-base font-black text-orange-600">
                        {totalPower}W
                      </td>
                      <td className="px-6 py-5 text-base font-black text-slate-900">
                        -
                      </td>
                      <td className="px-6 py-5 text-base font-black text-emerald-600">
                        {totalDailyEnergy.toFixed(2)} kWh
                      </td>
                      <td className="px-6 py-5 text-base font-black text-red-600">
                        ₹{estimatedMonthlyCost.toFixed(0)}
                      </td>
                      <td className="px-6 py-5"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>

          {/* Solar Recommendation Card */}
          {appliances.length > 0 && (
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-10 py-8 text-white">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">☀️</span>
                  <div>
                    <h3 className="text-3xl font-bold">Solar Recommendation</h3>
                    <p className="text-emerald-50 text-base">Customized solar setup for your needs</p>
                  </div>
                </div>
              </div>

              <div className="p-10">
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-2xl border-2 border-emerald-200">
                    <h4 className="font-bold text-slate-700 mb-3 text-lg">Recommended Solar Size</h4>
                    <p className="text-4xl font-black text-emerald-700 mb-2">
                      {Math.ceil(totalDailyEnergy * 1.2)} kW
                    </p>
                    <p className="text-sm font-semibold text-emerald-600">20% buffer included</p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-8 rounded-2xl border-2 border-orange-200">
                    <h4 className="font-bold text-slate-700 mb-3 text-lg">Estimated Investment</h4>
                    <p className="text-4xl font-black text-orange-700 mb-2">
                      ₹{Math.ceil(totalDailyEnergy * 1.2 * 50000).toLocaleString()}
                    </p>
                    <p className="text-sm font-semibold text-orange-600">Including installation</p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl border-2 border-blue-200">
                    <h4 className="font-bold text-slate-700 mb-3 text-lg">Monthly Savings</h4>
                    <p className="text-4xl font-black text-blue-700 mb-2">
                      ₹{(estimatedMonthlyCost * 0.8).toFixed(0)}
                    </p>
                    <p className="text-sm font-semibold text-blue-600">80% of current bill</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-5 rounded-xl transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                    <span>📞</span>
                    <span>Get Quote</span>
                  </button>
                  <button className="bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white px-8 py-5 rounded-xl transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                    <span>📋</span>
                    <span>Detailed Report</span>
                  </button>
                  <button className="border-2 border-emerald-500 text-emerald-700 hover:bg-emerald-50 px-8 py-5 rounded-xl transition-all duration-300 font-bold text-lg flex items-center justify-center gap-2">
                    <span>💬</span>
                    <span>Expert Consultation</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
=======
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white p-6 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <button
              onClick={navigateBack}
              className="bg-orange-600 hover:bg-orange-700 p-2 rounded-lg transition duration-200"
            >
              ← Back
            </button>
            <span className="text-3xl">📋</span>
            <h1 className="text-2xl font-bold">My Appliances</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{appliances.length}</div>
            <div className="text-sm text-gray-600">Total Appliances</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{totalPower}W</div>
            <div className="text-sm text-gray-600">Total Power</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{totalDailyEnergy.toFixed(1)} kWh</div>
            <div className="text-sm text-gray-600">Daily Energy</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-red-600">₹{estimatedMonthlyCost.toFixed(0)}</div>
            <div className="text-sm text-gray-600">Monthly Cost</div>
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-green-700">Appliance List</h2>
              <button
                onClick={navigateToAdd}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200 font-semibold"
              >
                ➕ Add New Appliance
              </button>
            </div>
          </div>

          {appliances.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No appliances added yet</h3>
              <p className="text-gray-500 mb-4">Start by adding your first appliance to calculate your solar needs</p>
              <button
                onClick={navigateToAdd}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition duration-200 font-semibold"
              >
                Add Your First Appliance
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Appliance Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Power (W)
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Hours/Day
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Daily Energy (kWh)
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Monthly Cost (₹)
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appliances.map((appliance) => {
                    const dailyEnergy = (appliance.power * appliance.hours) / 1000;
                    const monthlyCost = dailyEnergy * 30 * 8; // ₹8 per kWh

                    return (
                      <tr key={appliance.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-semibold text-gray-900">
                              {appliance.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {appliance.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {appliance.power}W
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {appliance.hours}h
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          {dailyEnergy.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                          ₹{monthlyCost.toFixed(0)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-orange-600 hover:text-orange-900 font-semibold">
                              Edit
                            </button>
                            <button className="text-red-600 hover:text-red-900 font-semibold">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900" colSpan="2">
                      TOTAL
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-orange-600">
                      {totalPower}W
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      -
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-green-600">
                      {totalDailyEnergy.toFixed(2)} kWh
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-red-600">
                      ₹{estimatedMonthlyCost.toFixed(0)}
                    </td>
                    <td className="px-6 py-4"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        {/* Solar Recommendation Card */}
        {appliances.length > 0 && (
          <div className="mt-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl shadow-lg p-6 border border-green-200">
            <h3 className="text-2xl font-bold text-green-700 mb-4">☀️ Solar Recommendation</h3>

            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-1">Recommended Solar Size</h4>
                <p className="text-2xl font-bold text-green-600">
                  {Math.ceil(totalDailyEnergy * 1.2)} kW
                </p>
                <p className="text-sm text-gray-500">20% buffer included</p>
              </div>

              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-1">Estimated Investment</h4>
                <p className="text-2xl font-bold text-orange-600">
                  ₹{Math.ceil(totalDailyEnergy * 1.2 * 50000).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Including installation</p>
              </div>

              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-1">Monthly Savings</h4>
                <p className="text-2xl font-bold text-blue-600">
                  ₹{(estimatedMonthlyCost * 0.8).toFixed(0)}
                </p>
                <p className="text-sm text-gray-500">80% of current bill</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition duration-200 font-semibold">
                📞 Get Quote
              </button>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition duration-200 font-semibold">
                📋 Detailed Report
              </button>
              <button className="border border-green-500 text-green-600 hover:bg-green-50 px-6 py-3 rounded-lg transition duration-200 font-semibold">
                💬 Expert Consultation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
>>>>>>> Stashed changes
  );
};

export default ViewAppliances;