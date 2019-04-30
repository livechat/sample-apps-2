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
import "styled-components/macro";

export default ({ data }) => {
  if (!data || Object.keys(data).length === 0) {
    return <Spinner marginTop="calc(100% - 120px)" />;
  }

  const chartData = Object.keys(data).map(e => ({
    name: e.substr(5),
    hours: data[e].hours
  }));

  return (
    <div
      css={`
        display: grid;
        grid-gap: 20px;
        justify-items: center;
      `}
    >
      <span>Agent Working Time</span>
      <AreaChart
        width={350}
        height={250}
        data={chartData}
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
          dataKey="hours"
          stroke="rgb(67, 132, 245)"
          fill="#dbe5ff"
        />
      </AreaChart>
    </div>
  );
};