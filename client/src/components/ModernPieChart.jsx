import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

// Asegúrate que esta línea esté AL PRINCIPIO o AL FINAL
const ModernPieChart = ({ data, title, colors }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimated(true), 100);
  }, []);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const total = data.reduce((sum, d) => sum + d.value, 0);
      const percentage = ((payload[0].value / total) * 100).toFixed(1);
      
      return (
        <div className="bg-white rounded-2xl shadow-2xl p-4 border border-gray-100 min-w-[150px]">
          <p className="text-[#967292] font-black text-xs uppercase tracking-wider mb-1">
            {payload[0].name}
          </p>
          <p className="text-2xl font-black text-gray-800">
            {payload[0].value} becas
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {percentage}% del total
          </p>
        </div>
      );
    }
    return null;
  };

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div>
      <h3 className="text-[#967292] font-black uppercase italic tracking-widest text-[11px] mb-6">
        {title}
      </h3>
      
      <div className="relative">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={animated ? 90 : 0}
              paddingAngle={3}
              dataKey="value"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              animationBegin={0}
              animationDuration={1000}
              animationEasing="ease-out"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]}
                  stroke="white"
                  strokeWidth={2}
                  style={{
                    cursor: 'pointer',
                    opacity: activeIndex === index ? 1 : 0.8,
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Texto central */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
            Total
          </p>
          <p className="text-2xl font-black text-[#967292]">
            {total}
          </p>
        </div>
      </div>
      
      {/* Leyenda simple */}
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span className="text-xs font-bold text-gray-700">{item.name}</span>
            <span className="text-xs text-gray-400">({item.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ✅ EXPORTACIÓN CORRECTA - Asegúrate que esta línea esté al final
export default ModernPieChart;