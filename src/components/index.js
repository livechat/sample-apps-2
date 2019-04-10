import React, { useState, useEffect } from "react";
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

  const makeUpdate = () => {
    setUpdate(!update);
  };

  useEffect(() => {
    // api.fetchGroups(accessToken).then(response => setGroups(response.data));
    api.fetchCans(accessToken).then(response => setCans(response.data));
    api.fetchTags(accessToken).then(response => setTags(response.data));
  }, [update]);

  console.log(accessToken);

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
        <Tags tags={tags} update={makeUpdate} accessToken={accessToken} />
      )}
      {tabId === "cans" && (
        <Cans cans={cans} update={makeUpdate} accessToken={accessToken} />
      )}
    </div>
  );
};

export default App;
