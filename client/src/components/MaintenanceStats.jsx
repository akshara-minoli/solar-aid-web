import React from 'react';

const MaintenanceStats = ({ stats }) => {
  const statCards = [
    {
      label: 'Network Schedules',
      value: stats.totalSchedules,
      icon: '📋',
      color: 'bg-blue-500/10 border-blue-500/20',
      textColor: 'text-blue-400'
    },
    {
      label: 'Operational Complete',
      value: stats.completedServices,
      icon: '✅',
      color: 'bg-emerald-500/10 border-emerald-500/20',
      textColor: 'text-emerald-400'
    },
    {
      label: 'Upcoming Ingress',
      value: stats.upcomingServices,
      icon: '📅',
      color: 'bg-indigo-500/10 border-indigo-500/20',
      textColor: 'text-indigo-400'
    },
    {
      label: 'Pending Requests',
      value: stats.pendingRequests,
      icon: '⏳',
      color: 'bg-rose-500/10 border-rose-500/20',
      textColor: 'text-rose-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card, index) => (
        <div
          key={index}
          className={`${card.color} border rounded-2xl p-6 transition-all duration-500 hover:bg-white/5 group relative overflow-hidden`}
        >
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{card.label}</p>
              <p className={`text-3xl font-black ${card.textColor} tracking-tight`}>{card.value}</p>
            </div>
            <span className="text-3xl grayscale group-hover:grayscale-0 transition-all duration-500">{card.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MaintenanceStats;
