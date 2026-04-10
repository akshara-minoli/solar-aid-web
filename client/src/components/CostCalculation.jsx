import React, { useState } from 'react';

const PVWATTS_API_KEY = '4R6dg4mvMuuqDvDc1lH3lifxOfCh1J09rwdK2jDw';
const COST_PER_KW = 185000;       // Rs. per kW installed
const SAVINGS_PER_KWH = 67;       // Rs. per kWh (Sri Lanka 2026 avg)

const MODULE_TYPES = [
  { label: 'Standard', value: 0 },
  { label: 'Premium', value: 1 },
];

const defaultForm = {
  systemCapacity: 5,
  moduleType: 0,
  lat: 6.927,
  lon: 79.861,
};

const CostCalculation = () => {
  const [form, setForm] = useState(defaultForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: parseFloat(value) ?? value }));
  };

  const handleCalculate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const params = new URLSearchParams({
        api_key: PVWATTS_API_KEY,
        system_capacity: form.systemCapacity,
        module_type: form.moduleType,
        array_type: 1,   // 1 = Fixed - Roof Mounted (standard for Sri Lanka residential)
        losses: 14,
        tilt: 15,
        azimuth: 180,
        lat: form.lat,
        lon: form.lon,
      });

      const res = await fetch(
        `https://developer.nrel.gov/api/pvwatts/v8.json?${params.toString()}`
      );

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody?.errors?.[0] || `API error: ${res.status}`);
      }

      const data = await res.json();

      if (data.errors && data.errors.length > 0) {
        throw new Error(data.errors.join(', '));
      }

      const acAnnual = data.outputs?.ac_annual;
      if (!acAnnual) throw new Error('No output data received from PVWatts API.');

      const totalCost = form.systemCapacity * COST_PER_KW;
      const annualSavings = acAnnual * SAVINGS_PER_KWH;
      const paybackPeriod = totalCost / annualSavings;

      setResult({
        acAnnual: Math.round(acAnnual),
        totalCost,
        annualSavings: Math.round(annualSavings),
        paybackPeriod: paybackPeriod.toFixed(1),
      });
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const fmt = (n) => n.toLocaleString('en-LK');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Section Header */}
      <div className="flex items-center gap-3">
        <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></span>
        <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
          Solar Investment Calculator — Sri Lanka 2026
        </h2>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        {/* ── Input Form ── */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-center justify-center text-2xl">
                ☀️
              </div>
              <div>
                <h3 className="text-base font-black text-white uppercase tracking-tight">
                  System Parameters
                </h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                  Configure your solar installation
                </p>
              </div>
            </div>

            <form onSubmit={handleCalculate} className="space-y-5">

              {/* System Size */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  System Size (kW)
                </label>
                <input
                  id="systemCapacity"
                  name="systemCapacity"
                  type="number"
                  min="0.5"
                  max="500"
                  step="0.5"
                  value={form.systemCapacity}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-bold placeholder-slate-600 focus:outline-none focus:border-yellow-500/50 focus:bg-white/10 transition-all"
                  placeholder="e.g. 3, 5, 10"
                />
              </div>

              {/* Panel Choice */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Panel Choice
                </label>
                <select
                  id="moduleType"
                  name="moduleType"
                  value={form.moduleType}
                  onChange={handleChange}
                  className="w-full bg-[#0B1120] border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-bold focus:outline-none focus:border-yellow-500/50 transition-all appearance-none cursor-pointer"
                >
                  {MODULE_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Location (Latitude / Longitude)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-500 uppercase tracking-widest">LAT</span>
                    <input
                      id="lat"
                      name="lat"
                      type="number"
                      step="0.001"
                      min="-90"
                      max="90"
                      value={form.lat}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm font-bold focus:outline-none focus:border-yellow-500/50 focus:bg-white/10 transition-all"
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-500 uppercase tracking-widest">LON</span>
                    <input
                      id="lon"
                      name="lon"
                      type="number"
                      step="0.001"
                      min="-180"
                      max="180"
                      value={form.lon}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm font-bold focus:outline-none focus:border-yellow-500/50 focus:bg-white/10 transition-all"
                    />
                  </div>
                </div>
                <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">
                  Default: Colombo, Sri Lanka (6.927, 79.861)
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-yellow-500 hover:bg-yellow-400 disabled:bg-yellow-500/40 text-black font-black py-4 rounded-xl transition-all shadow-2xl shadow-yellow-500/20 uppercase text-xs tracking-[0.2em] group"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                    Fetching Solar Data...
                  </>
                ) : (
                  <>
                    <span className="group-hover:scale-110 transition-transform">⚡</span>
                    Calculate Investment
                  </>
                )}
              </button>
            </form>

            {/* Error Banner */}
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 text-rose-400 text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-top-2 flex items-start gap-3">
                <span className="text-lg flex-shrink-0">⚠️</span>
                <span>API Error: {error}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Result Cards ── */}
        <div className="space-y-5">
          {result ? (
            <>
              <div className="flex items-center gap-3 mb-2">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  Investment Analysis Results
                </h2>
              </div>

              {/* Annual Output */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50 rounded-l-2xl"></div>
                <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">Annual AC Output</p>
                <p className="text-3xl font-black text-white tracking-tight">
                  {fmt(result.acAnnual)}
                  <span className="text-base font-bold text-slate-400 ml-2">kWh/yr</span>
                </p>
                <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest mt-2">
                  Estimated by NREL PVWatts V8 · Colombo Solar Profile
                </p>
              </div>

              {/* Total Cost */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500/50 rounded-l-2xl"></div>
                <p className="text-[9px] font-black text-yellow-400 uppercase tracking-widest mb-1">Total System Cost</p>
                <p className="text-3xl font-black text-white tracking-tight">
                  Rs. {fmt(result.totalCost)}
                </p>
                <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest mt-2">
                  Based on Rs. 185,000 per kW · Panels + Inverter + Mounting
                </p>
              </div>

              {/* Annual Savings */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/50 rounded-l-2xl"></div>
                <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1">Annual Savings</p>
                <p className="text-3xl font-black text-white tracking-tight">
                  Rs. {fmt(result.annualSavings)}
                </p>
                <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest mt-2">
                  At Rs. 67.00 per kWh · Sri Lanka 2026 household rate
                </p>
              </div>

              {/* Payback Period */}
              <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 rounded-l-2xl"></div>
                <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1">Payback Period</p>
                <p className="text-4xl font-black text-emerald-400 tracking-tight">
                  {result.paybackPeriod}
                  <span className="text-xl font-bold text-slate-400 ml-2">years</span>
                </p>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-2">
                  Total Cost ÷ Annual Savings · Sri Lanka 2026 Estimate
                </p>
              </div>
            </>
          ) : (
            /* Empty state */
            <div className="h-full min-h-80 flex flex-col items-center justify-center bg-white/5 border border-white/5 rounded-3xl p-12 text-center">
              <div className="w-20 h-20 bg-yellow-500/10 border border-yellow-500/20 rounded-3xl flex items-center justify-center text-4xl mb-6">
                ☀️
              </div>
              <h3 className="text-base font-black text-white uppercase tracking-tight mb-2">
                No Results Yet
              </h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed max-w-xs">
                Configure your system parameters and click "Calculate Investment" to see
                your solar cost analysis.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Rate Info Footer */}
      <div className="bg-white/5 border border-white/5 rounded-2xl p-5 flex flex-wrap gap-6">
        {[
          { label: 'Cost Rate', value: 'Rs. 185,000 / kW', color: 'text-yellow-400' },
          { label: 'Electricity Rate', value: 'Rs. 67.00 / kWh', color: 'text-emerald-400' },
          { label: 'Data Source', value: 'NREL PVWatts V8', color: 'text-blue-400' },
          { label: 'Reference Year', value: 'Sri Lanka 2026', color: 'text-slate-300' },
        ].map((item) => (
          <div key={item.label}>
            <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{item.label}</p>
            <p className={`text-xs font-black ${item.color} uppercase tracking-wide mt-0.5`}>{item.value}</p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default CostCalculation;
