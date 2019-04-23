import React, { useState } from "react";
import {
  BarChart,
  LineChart,
  Bar,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  ResponsiveContainer,
  PieChart,
  Pie,
  Sector
} from "recharts";

import { renderCustomizedLabel } from "../../utils/charts";

import { TabsWrapper, TabsList, Tab } from "@livechat/design-system";

import Spinner from "../Spinner";
import "styled-components/macro";

const timeInterval = ["day", "week", "month", "year"];
const COLORS = ["#d64646", "#4bb678"];

export default ({ ratings, time, setTime }) => {
  const [tabId, setTabId] = useState("week");
  if (!ratings) {
    return <Spinner marginTop="calc(100% - 50px)" />;
  }

  const hours = Object.keys(ratings);
  const ratingsTab = Object.values(ratings);
  const data = ratingsTab.map((rating, index) => {
    const { good, bad, chats } = rating;
    return {
      name: hours[index],
      good,
      bad,
      chats
    };
  });
  const allBad = data.reduce((a, b) => a + (b["bad"] || 0), 0);
  const allGood = data.reduce((a, b) => a + (b["good"] || 0), 0);
  const allChats = data.reduce((a, b) => a + (b["chats"] || 0), 0);
  return (
    <>
      <div
        css={`
          background-color: white;
          border: solid 1px hsl(0, 0%, 90%);
          padding-bottom: 40px;
        `}
      >
        <TabsWrapper
          css={`
            overflow-y: scroll;
          `}
        >
          <TabsList>
            {timeInterval.map((e, i) => {
              return (
                <Tab
                  css={`
                    color: 10px;
                  `}
                  onSelect={() => {
                    setTabId(e);
                    setTime(e);
                  }}
                  key={e}
                  isSelected={e === tabId}
                >
                  {e}
                </Tab>
              );
            })}
          </TabsList>
        </TabsWrapper>
        <div>
          <div
            css={`
              display: grid;
              grid-template: "a b" / 2fr 1fr;
              align-items: center;
              justify-items: center;
              border-top: solid 1px hsl(0, 0%, 90%);
            `}
          >
            <div
              style={{
                width: "100%",
                height: 220
              }}
            >
              <ResponsiveContainer>
                <PieChart width={50} height={50}>
                  <Pie
                    data={[
                      { name: "Bad", value: allBad },
                      { name: "Good", value: allGood }
                    ]}
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div
              css={`
                justify-self: start;
                > div {
                  width: 15px;
                  height: 15px;
                  border-radius: 10px;
                  margin: 7px;
                }

                > span {
                  font-size: 13px;
                }
              `}
            >
              <div
                css={`
                  background-color: #4bb678;
                `}
              />
              <span>good</span>
              <div
                css={`
                  background-color: #d64646;
                `}
              />
              <span>bad</span>
            </div>
          </div>

          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart
                data={[
                  { name: "Good", Good: allGood },
                  { name: "Bad", Bad: allBad },
                  { name: "Chats", Chats: allChats }
                ]}
                margin={{ right: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Chats" fill="#4384f5" />
                <Bar dataKey="Bad" fill="#d64646" />
                <Bar dataKey="Good" fill="#4bb678" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={data} margin={{ right: 40 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line dataKey="good" stroke="#4bb678" />
                <Line dataKey="bad" stroke="#d64646" />
              </LineChart>
            </ResponsiveContainer>
          </div> */}
        </div>
      </div>
    </>
  );
};
