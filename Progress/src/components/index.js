import React, { useState, useEffect } from "react";
import { TabsWrapper, TabsList, Tab } from "@livechat/design-system";
import "styled-components/macro";

import Ratings from "./Ratings";
import Times from "./Times";

import api from "../utils/api";

const mainConatinerStyle = `
  height: 100%;
  display: grid;
  grid-gap: 10px;
  padding: 5px;
  border-radius: 8px;
  max-width: 500px;
`;

const tabStyle = `
  background-color: white;
  border: solid 1px hsl(0, 0%, 90%);
`;

const App = ({ accessToken }) => {
  const [day, setDay] = useState(null);
  const [week, setWeek] = useState(null);
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);

  const [times, setTimes] = useState(null);

  const [time, setTime] = useState("day");
  const [tabId, setTabId] = useState("ratings");

  const [error, setError] = useState(null);

  const fetchDay = () =>
    api
      .fetchRatings("day", accessToken)
      .then(response => setDay(response.data));

  const fetchWeek = () =>
    api
      .fetchRatings("week", accessToken)
      .then(response => setWeek(response.data));

  const fetchMonth = () =>
    api
      .fetchRatings("month", accessToken)
      .then(response => setMonth(response.data));

  const fetchYear = () =>
    api
      .fetchRatings("year", accessToken)
      .then(response => setYear(response.data));

  const fetchTimes = () =>
    api
      .fetchTimes(accessToken)
      .then(response => setTimes(response.data))
      .catch(e => setError(e));

  useEffect(() => {
    fetchDay();
    fetchWeek();
    fetchMonth();
    fetchYear();
    fetchTimes();
  }, []);

  return (
    <div css={mainConatinerStyle}>
      <div css={tabStyle}>
        <TabsWrapper>
          <TabsList>
            <Tab
              onSelect={() => setTabId("ratings")}
              key={"ratings"}
              isSelected={"ratings" === tabId}
            >
              Ratings
            </Tab>
            <Tab
              onSelect={() => setTabId("times")}
              key={"times"}
              isSelected={"times" === tabId}
            >
              Times
            </Tab>
          </TabsList>
        </TabsWrapper>
      </div>
      {tabId === "ratings" && (
        <Ratings
          allRatings={{
            day,
            week,
            month,
            year
          }}
          time={time}
          setTime={setTime}
        />
      )}
      {tabId === "times" && (
        <Times times={times} time={time} setTime={setTime} error={error} />
      )}
    </div>
  );
};

export default App;
