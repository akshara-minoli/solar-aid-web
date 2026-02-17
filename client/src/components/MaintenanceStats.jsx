import React from 'react';

const MaintenanceStats = ({ stats }) => {
  const statCards = [
    {
      label: 'Total Schedules',
      value: stats.totalSchedules,
      icon: '📋',
      color: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-600'
    },
    {
      label: 'Completed Services',
      value: stats.completedServices,
      icon: '✅',
      color: 'bg-green-50 border-green-200',
      textColor: 'text-green-600'
    },
    {
      label: 'Upcoming Services',
      value: stats.upcomingServices,
      icon: '📅',
      color: 'bg-orange-50 border-orange-200',
      textColor: 'text-orange-600'
    },
    {
      label: 'Pending Requests',
      value: stats.pendingRequests,
      icon: '⏳',
      color: 'bg-purple-50 border-purple-200',
      textColor: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card, index) => (
        <div
          key={index}
          className={`${card.color} border rounded-lg p-6 transition-all duration-300 hover:shadow-md`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">{card.label}</p>
              <p className={`text-3xl font-bold ${card.textColor} mt-2`}>{card.value}</p>
            </div>
            <span className="text-4xl opacity-50">{card.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MaintenanceStats;
