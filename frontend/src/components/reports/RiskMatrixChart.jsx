import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const RiskMatrixChart = ({ riskScore = 34 }) => {
  const riskCategories = [
    { name: 'Regulatory', score: 28 },
    { name: 'Financial Burn', score: 42 },
    { name: 'Supply Chain', score: 35 },
    { name: 'Competition', score: 30 },
    { name: 'Talent Retention', score: 25 }
  ];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={riskCategories} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
          <YAxis stroke="#64748b" fontSize={10} domain={[0, 100]} />
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
          />
          <Bar dataKey="score" radius={[6, 6, 0, 0]}>
            {riskCategories.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.score > 40 ? '#ef4444' : entry.score > 30 ? '#f59e0b' : '#10b981'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
