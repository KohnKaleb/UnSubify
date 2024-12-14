import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
function generateRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const colorArray = [];
for (let i = 0; i < 50; i++) {
  colorArray.push(generateRandomColor());
}

const PieChartComponent = ({ data }) => {
  const COLORS = colorArray;
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
          color: colorArray[dataSet.length - 1],
        }}
      >
        {data.stats ? data.stats.totalEmails + " Subs Found" : "00000"}
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
