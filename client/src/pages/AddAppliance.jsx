import { useState } from 'react';
<<<<<<< Updated upstream
import DashboardLayout from '../components/DashboardLayout';
=======
>>>>>>> Stashed changes

const AddAppliance = () => {
  const [formData, setFormData] = useState({
    applianceName: '',
    powerRating: '',
    usageHours: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // UI only - no actual submission
    alert('Appliance added successfully! (UI Demo)');
    console.log('Appliance Data:', formData);
    // Reset form
    setFormData({
      applianceName: '',
      powerRating: '',
      usageHours: ''
    });
  };

  const navigateBack = () => {
    window.location.hash = 'dashboard';
  };

  // Common appliances with typical power ratings
  const commonAppliances = [
    { name: 'LED Light Bulb', power: '9' },
    { name: 'Ceiling Fan', power: '60' },
    { name: 'Television (32")', power: '80' },
    { name: 'Refrigerator', power: '150' },
    { name: 'Washing Machine', power: '500' },
    { name: 'Water Heater', power: '2000' },
    { name: 'Air Conditioner', power: '1500' },
    { name: 'Microwave', power: '800' }
  ];

  const selectAppliance = (appliance) => {
    setFormData({
      ...formData,
      applianceName: appliance.name,
      powerRating: appliance.power
    });
  };

  return (
<<<<<<< Updated upstream
    <DashboardLayout title="Add Appliance">
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-5xl space-y-10">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="text-8xl mb-6">⚡</div>
            <h2 className="text-5xl font-black text-slate-800 tracking-tight mb-3">Add Your Appliance</h2>
            <p className="text-slate-500 text-xl">Help us calculate your power needs accurately</p>
          </div>

          <div className="grid lg:grid-cols-[1fr,400px] gap-8">
            
            {/* Form Card */}
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
              {/* Info Banner */}
              <div className="bg-gradient-to-r from-orange-500 to-yellow-500 px-10 py-8 text-white">
                <div className="flex items-start gap-4">
                  <span className="text-3xl flex-shrink-0">💡</span>
                  <div>
                    <p className="font-bold mb-2 text-lg">Power Usage Tracking</p>
                    <p className="text-base text-orange-50">
                      Enter your appliance details to calculate daily energy consumption and optimize your solar setup.
                    </p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-10 space-y-8">
                {/* Appliance Name */}
                <div>
                  <label className="block text-base font-bold text-slate-700 mb-3">
                    Appliance Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="applianceName"
                    value={formData.applianceName}
                    onChange={handleInputChange}
                    placeholder="Enter appliance name (e.g., LED Light)"
                    required
                    className="w-full bg-white border-2 border-slate-200 rounded-xl px-6 py-5 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all text-slate-700 font-medium text-lg placeholder:text-slate-400"
                  />
                </div>

                {/* Power Rating */}
                <div>
                  <label className="block text-base font-bold text-slate-700 mb-3">
                    Power Rating (Watts) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="powerRating"
                    value={formData.powerRating}
                    onChange={handleInputChange}
                    placeholder="Enter power consumption in watts"
                    required
                    min="1"
                    max="5000"
                    className="w-full bg-white border-2 border-slate-200 rounded-xl px-6 py-5 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all text-slate-700 font-medium text-lg placeholder:text-slate-400"
                  />
                  <p className="text-sm text-slate-500 mt-2 ml-1">
                    💡 Check the label on your appliance or manual
                  </p>
                </div>

                {/* Usage Hours */}
                <div>
                  <label className="block text-base font-bold text-slate-700 mb-3">
                    Daily Usage Hours <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="usageHours"
                    value={formData.usageHours}
                    onChange={handleInputChange}
                    placeholder="How many hours per day?"
                    required
                    min="0.5"
                    max="24"
                    step="0.5"
                    className="w-full bg-white border-2 border-slate-200 rounded-xl px-6 py-5 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all text-slate-700 font-medium text-lg placeholder:text-slate-400"
                  />
                  <p className="text-sm text-slate-500 mt-2 ml-1">
                    ⏰ Average hours you use this appliance daily
                  </p>
                </div>

                {/* Power Calculation Preview */}
                {formData.powerRating && formData.usageHours && (
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border-2 border-blue-200">
                    <h4 className="font-bold text-blue-800 mb-3 text-lg">📊 Energy Consumption</h4>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-blue-700">
                        {(formData.powerRating * formData.usageHours / 1000).toFixed(2)} kWh
                        <span className="text-base font-normal text-blue-600 ml-2">per day</span>
                      </p>
                      <p className="text-lg text-blue-600">
                        Monthly: {((formData.powerRating * formData.usageHours * 30) / 1000).toFixed(2)} kWh
                      </p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white font-bold text-lg py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <span>Add Appliance</span>
                    <span className="text-2xl">✓</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Common Appliances Quick Select */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8">
                <h3 className="text-xl font-bold text-slate-800 mb-3">Quick Select</h3>
                <p className="text-slate-600 mb-6 text-sm">Click any appliance to auto-fill:</p>

                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {commonAppliances.map((appliance, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => selectAppliance(appliance)}
                      className="w-full text-left p-4 bg-slate-50 hover:bg-orange-50 border-2 border-slate-100 hover:border-orange-300 rounded-xl transition-all duration-200"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-700">{appliance.name}</span>
                        <span className="text-sm font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-lg">
                          {appliance.power}W
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Help Information */}
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-3xl border-2 border-yellow-200 p-8">
                <h4 className="font-bold text-yellow-800 mb-4 text-lg flex items-center gap-2">
                  <span className="text-2xl">💡</span>
                  Tips for Accuracy
                </h4>
                <ul className="text-sm text-yellow-700 space-y-2.5">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 flex-shrink-0">•</span>
                    <span>Check appliance labels for exact wattage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 flex-shrink-0">•</span>
                    <span>Consider seasonal usage variations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 flex-shrink-0">•</span>
                    <span>Include all appliances for solar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 flex-shrink-0">•</span>
                    <span>Old appliances may consume more</span>
                  </li>
                </ul>
              </div>

              {/* View Appliances Button */}
              <button
                onClick={() => window.location.hash = 'view-appliances'}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-5 rounded-xl transition-all duration-300 font-bold text-base shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <span>📋</span>
                <span>View All My Appliances</span>
              </button>
            </div>
          </div>
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
            <span className="text-3xl">⚡</span>
            <h1 className="text-2xl font-bold">Add Appliance</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Add Appliance Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-green-700 mb-2">Add Your Appliance</h2>
              <p className="text-gray-600">Help us calculate your power needs accurately</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Appliance Name */}
              <div>
                <label className="block text-sm font-bold text-green-700 mb-2">
                  Appliance Name *
                </label>
                <input
                  type="text"
                  name="applianceName"
                  value={formData.applianceName}
                  onChange={handleInputChange}
                  placeholder="Enter appliance name (e.g., LED Light)"
                  required
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition duration-200"
                />
              </div>

              {/* Power Rating */}
              <div>
                <label className="block text-sm font-bold text-green-700 mb-2">
                  Power Rating (Watts) *
                </label>
                <input
                  type="number"
                  name="powerRating"
                  value={formData.powerRating}
                  onChange={handleInputChange}
                  placeholder="Enter power consumption in watts"
                  required
                  min="1"
                  max="5000"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition duration-200"
                />
                <p className="text-sm text-gray-500 mt-1">
                  💡 Check the label on your appliance or manual
                </p>
              </div>

              {/* Usage Hours */}
              <div>
                <label className="block text-sm font-bold text-green-700 mb-2">
                  Daily Usage Hours *
                </label>
                <input
                  type="number"
                  name="usageHours"
                  value={formData.usageHours}
                  onChange={handleInputChange}
                  placeholder="How many hours per day?"
                  required
                  min="0.5"
                  max="24"
                  step="0.5"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition duration-200"
                />
                <p className="text-sm text-gray-500 mt-1">
                  ⏰ Average hours you use this appliance daily
                </p>
              </div>

              {/* Power Calculation Preview */}
              {formData.powerRating && formData.usageHours && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-bold text-blue-800 mb-2">📊 Daily Energy Consumption:</h4>
                  <p className="text-lg font-semibold text-blue-700">
                    {(formData.powerRating * formData.usageHours / 1000).toFixed(2)} kWh per day
                  </p>
                  <p className="text-sm text-blue-600">
                    Monthly: {((formData.powerRating * formData.usageHours * 30) / 1000).toFixed(2)} kWh
                  </p>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={navigateBack}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg transition duration-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-6 rounded-lg transition duration-200 font-semibold shadow-lg"
                >
                  Add Appliance
                </button>
              </div>
            </form>
          </div>

          {/* Common Appliances Quick Select */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-green-700 mb-4">Quick Select Common Appliances</h3>
            <p className="text-gray-600 mb-4">Click on any appliance to auto-fill the form:</p>

            <div className="space-y-2">
              {commonAppliances.map((appliance, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => selectAppliance(appliance)}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-orange-50 border hover:border-orange-300 rounded-lg transition duration-200"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-800">{appliance.name}</span>
                    <span className="text-sm font-semibold text-orange-600">{appliance.power}W</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Help Information */}
            <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-bold text-yellow-800 mb-2">💡 Tips for Accurate Information:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Check appliance labels for exact wattage</li>
                <li>• Consider seasonal usage variations</li>
                <li>• Include all appliances you plan to run on solar</li>
                <li>• Old appliances may consume more power</li>
              </ul>
            </div>

            {/* View Appliances Button */}
            <button
              onClick={() => window.location.hash = 'view-appliances'}
              className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg transition duration-200 font-semibold"
            >
              📋 View All My Appliances
            </button>
          </div>
        </div>
      </div>
    </div>
>>>>>>> Stashed changes
  );
};

export default AddAppliance;