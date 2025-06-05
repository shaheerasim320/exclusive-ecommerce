import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LabelList } from "recharts";

const data = [
  { name: "Electronics", value: 1200000 },
  { name: "Fashion", value: 950000 },
  { name: "Home & Kitchen", value: 750000 },
  { name: "Beauty & Personal Care", value: 500000 },
];

const COLORS = ["#FF8042", "#FFBB28", "#FF7300", "#FFD700"]; // Colors for each category

const TopCategories = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-[380px]">
      <h2 className="text-lg font-semibold">Top Categories</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            labelLine={false} // Remove label lines
            label={({ name }) => name} // Display category name directly
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopCategories;
