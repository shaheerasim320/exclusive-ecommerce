import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const data = [
  { date: "12 Aug", revenue: 8000, orders: 4000 },
  { date: "13 Aug", revenue: 10000, orders: 5000 },
  { date: "14 Aug", revenue: 12000, orders: 6000 },
  { date: "15 Aug", revenue: 14000, orders: 7000 },
  { date: "16 Aug", revenue: 16000, orders: 8000 },
  { date: "17 Aug", revenue: 14521, orders: 7500 }, // Peak revenue on 17 Aug
  { date: "18 Aug", revenue: 13000, orders: 7000 },
  { date: "19 Aug", revenue: 12500, orders: 6500 },
];

const RevenueAnalytics = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-[585px]">
      <h2 className="text-lg font-semibold">Revenue Analytics</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" stroke="#ff7300" strokeWidth={2} />
          <Line type="monotone" dataKey="orders" stroke="#ffb800" strokeWidth={2} strokeDasharray="5 5" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueAnalytics;
