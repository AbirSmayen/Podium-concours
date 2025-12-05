import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'from-blue-500 to-blue-600' }) => {
  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Gradient overlay on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
      
      {/* Animated border gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl blur-xl`}></div>
      
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-4 rounded-xl bg-gradient-to-br ${color} shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
        </div>
        <h3 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">{title}</h3>
        <p className={`text-4xl font-bold bg-gradient-to-br ${color} bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300`}>
          {value}
        </p>
      </div>
    </div>
  );
};

export default StatCard;

