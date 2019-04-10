import React, { useState, useEffect, Fragment } from "react";
import { TabsWrapper, TabsList, Tab } from "@livechat/design-system";
import "styled-components/macro";

import Tags from "./Tags";
import Cans from "./Cans";

import api from "../utils/api";

const App = ({ accessToken }) => {
  const [groups, setGroups] = useState(null);
  const [cans, setCans] = useState(null);
  const [tags, setTags] = useState(null);
  const [tabId, setTabId] = useState("tags");
  const [update, setUpdate] = useState(false);

  const items = [{ id: "tags", title: "Tags" }, { id: "cans", title: "Cans" }];

  useEffect(() => {
    api.fetchGroups(accessToken).then(response => setGroups(response.data));
    api.fetchCans(accessToken).then(response => setCans(response.data));
    api.fetchTags(accessToken).then(response => setTags(response.data));
  }, []);

  return (
    <div
      css={`
        display: grid;
        grid-gap: 10px;
      `}
    >
      <TabsWrapper>
        <TabsList>
          {items.map(({ id, count, title }) => (
            <Tab
              onSelect={() => setTabId(id)}
              key={id}
              isSelected={id === tabId}
            >
              {title}
            </Tab>
          ))}
        </TabsList>
      </TabsWrapper>
      {tabId === "tags" && (
        <Tags tags={tags} setUpdate={setUpdate} accessToken={accessToken} />
      )}
      {tabId === "cans" && (
        <Cans cans={cans} setUpdate={setUpdate} accessToken={accessToken} />
      )}
    </div>
  );
};

export default App;
