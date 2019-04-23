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
  const [ratings, setRatings] = useState(null);
  const [times, setTimes] = useState(null);

  const [time, setTime] = useState("week");
  const [tabId, setTabId] = useState("ratings");

  const [error, setError] = useState(null);

  const fetchRatings = timeInterval =>
    api
      .fetchRatings(timeInterval, accessToken)
      .then(response => setRatings(response.data))
      .catch(e => console.log(e));

  const fetchTimes = () =>
    api
      .fetchTimes(accessToken)
      .then(response => setTimes(response.data))
      .catch(e => setError(e));

  useEffect(() => {
    fetchRatings(time);
    fetchTimes();
  }, [time]);

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
        <Ratings ratings={ratings} time={time} setTime={setTime} />
      )}
      {tabId === "times" && (
        <Times times={times} time={time} setTime={setTime} error={error} />
      )}
    </div>
  );
};

export default App;
