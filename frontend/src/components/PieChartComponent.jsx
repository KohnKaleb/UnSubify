import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const PieChartComponent = ({ data }) => {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#800080"];
  const sampleData = [
    { name: "Group A", value: 500 },
    { name: "Group B", value: 500 },
  ];
  const dataSet =
    data["pieChart"] !== undefined ? data["pieChart"] : sampleData;
  return (
    <div>
      <h1
        style={{
          marginBottom: "0px",
          textAlign: "center",
          fontFamily: "cursive",
          color: "Blue",
        }}
      >
        Distribution
        {data.stats ? " " + data.stats.totalEmails : ""}
      </h1>
      <PieChart width={400} height={400}>
        <Pie
          data={dataSet}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={150}
          fill="#8884d8"
        >
          {dataSet.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
};

export default PieChartComponent;
