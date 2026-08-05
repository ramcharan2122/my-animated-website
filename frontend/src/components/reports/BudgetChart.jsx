import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export const BudgetChart = ({ data }) => {
  const COLORS = ['#6366f1', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b'];

  const chartData = data && data.length > 0 ? data : [
    { category: 'Real Estate & Lease', percentage: 35 },
    { category: 'Marketing & Brand CAC', percentage: 25 },
    { category: 'Staffing & Payroll', percentage: 22.5 },
    { category: 'Working Capital Reserve', percentage: 10 },
    { category: 'Legal & Regulatory', percentage: 7.5 }
  ];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={85}
            paddingAngle={5}
            dataKey="percentage"
            nameKey="category"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#030712" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
            itemStyle={{ color: '#38bdf8' }}
          />
          <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
