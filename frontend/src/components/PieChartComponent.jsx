import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const PieChartComponent = ({ data }) => {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  const sampleData = [
    { name: "Group A", value: 500 },
    { name: "Group B", value: 500 },
  ];
  const dataSet = Array.isArray(data) && data.length > 0 ? data : sampleData;
  return (
    <div>
      <PieChart width={400} height={400}>
        <Pie
          data={dataSet}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={150}
          fill="#8884d8"
          label
        >
          {dataSet.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
          {dataSet.map((entry, index) => (
            <text
              key={`label-${index}`}
              x={entry.cx}
              y={entry.cy}
              fill="#000"
              textAnchor="middle"
              dominantBaseline="central"
            >
              {entry.name}
            </text>
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default PieChartComponent;
