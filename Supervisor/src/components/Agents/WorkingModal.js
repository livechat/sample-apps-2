import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

import Spinner from "../Spinner";

const data = [
  {
    name: "Mon",
    value: 4000
  },
  {
    name: "Tue",
    value: 3000
  },
  {
    name: "Wed",
    value: 2000
  },
  {
    name: "Thu",
    value: 2780
  },
  {
    name: "Fri",
    value: 1890
  },
  {
    name: "Sat",
    value: 2390
  },
  {
    name: "Sun",
    value: 3490
  }
];

const week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default ({ data d}) => {
  if (!data || Object.keys(data).length === 0) {
    return <Spinner marginTop="calc(100% - 120px)" />;
  }
  console.log(data);

  const chartData = week.map(day => ({
    name: day
  }));
  return (
    <AreaChart
      width={350}
      height={250}
      data={data}
      margin={{
        top: 10,
        right: 30,
        left: 0,
        bottom: 0
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Area
        type="monotone"
        dataKey="value"
        stroke="rgb(67, 132, 245)"
        fill="#dbe5ff"
      />
    </AreaChart>
  );
};
