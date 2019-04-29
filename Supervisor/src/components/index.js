import React, { useState, useEffect, useMemo } from "react";
import {
  TabsWrapper,
  TabsList,
  Tab,
  InputField
} from "@livechat/design-system";
import "styled-components/macro";
import MaterialIcon from "material-icons-react";

import api from "../utils/api";
import Agents from "./Agents/index";

const mainConatinerStyle = `
  height: 100%;
  display: grid;
  grid-template-rows: 50px 40px auto;
  grid-gap: 10px;
  padding: 5px;
  border-radius: 8px;
  max-width: 500px;
`;

const tabsStyle = `
  background-color: white;
  border: solid 1px hsl(0, 0%, 90%);
`;

const searchStyle = `
  width: 100%;
`;

const tabStyle = `
  display: flex;
  align-items: center;
`;

const labelStyle = `
  margin-left: 7px;
`;

const tabs = [
  { title: "All", icon: "supervised_user_circle" },
  { title: "Online", icon: "fiber_manual_record" },
  { title: "Offline", icon: "not_interested" }
];

const App = ({ accessToken }) => {
  const [tabId, setTabId] = useState("All");
  const [agents, setAgents] = useState([]);
  const [agentsRatings, setAgentsRatings] = useState({});
  const [searchValue, setSearchValue] = useState("");

  const fetchAgents = () =>
    api.fetchAgents(accessToken).then(response => setAgents(response.data));

  const fetchAgentsRatings = name =>
    api
      .fetchAgentRatings(name, accessToken)
      .then(response => ({ [name]: response.data }));

  useEffect(() => {
    fetchAgents();
  }, []);

  useEffect(() => {
    if (agents.length > 0) {
      const promises = [];
      agents.forEach(agent => {
        promises.push(fetchAgentsRatings(agent.name));
      });

      Promise.all(promises).then(ratings => {
        const arrayToObject = array =>
          array.reduce((obj, item) => {
            obj[Object.keys(item)[0]] = item[Object.keys(item)[0]];
            return obj;
          }, {});

        const ratingsObject = arrayToObject(ratings);
        setAgentsRatings(ratingsObject);
      });
    }
  }, [agents]);

  const renderTabs = () =>
    tabs.map((tab, i) => {
      const { title, icon } = tab;
      return (
        <Tab
          key={i}
          onSelect={() => setTabId(title)}
          key={title}
          isSelected={title === tabId}
        >
          <div css={tabStyle}>
            <MaterialIcon icon={icon} color={"#4384F5"} />
            <span css={labelStyle}>{title}</span>
          </div>
        </Tab>
      );
    });

  const memoizedTabs = useMemo(() => renderTabs(), [tabId]);

  let filteredAgents = [];

  switch (tabId) {
    case "All":
      filteredAgents = agents;
      break;
    case "Online":
      filteredAgents = agents.filter(e => e.status === "accepting chats");
      break;
    case "Offline":
      filteredAgents = agents.filter(e => e.status !== "accepting chats");
      break;
  }

  if (searchValue) {
    filteredAgents = filteredAgents.filter(e =>
      e.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }

  return (
    <div css={mainConatinerStyle}>
      <div css={tabsStyle}>
        <TabsWrapper>
          <TabsList>{memoizedTabs}</TabsList>
        </TabsWrapper>
      </div>
      <InputField
        id="search"
        value={searchValue}
        placeholder="Search.."
        onChange={e => setSearchValue(e.target.value)}
        style={{ width: "100%", borderColor: "hsl(0, 0%, 85%)" }}
      />
      <Agents
        agents={filteredAgents}
        tabId={tabId}
        agentsRatings={agentsRatings}
      />
    </div>
  );
};

export default App;
