import React, { useState, useEffect } from "react";
import { TabsWrapper, TabsList, Tab } from "@livechat/design-system";
import "styled-components/macro";

import Tags from "./Tags";
import Cans from "./Cans";

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
  const [cans, setCans] = useState(null);
  const [tags, setTags] = useState(null);
  const [tabId, setTabId] = useState("tags");

  const items = [{ id: "tags", title: "Tags" }, { id: "cans", title: "Cans" }];

  useEffect(() => {
    updateTags();
    updateCans();
  }, []);

  const updateCans = () =>
    api.fetchCans(accessToken).then(response => setCans(response.data));
  const updateTags = () =>
    api.fetchTags(accessToken).then(response => setTags(response.data));

  return (
    <div css={mainConatinerStyle}>
      <div css={tabStyle}>
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
      </div>
      {tabId === "tags" && (
        <Tags tags={tags} update={updateTags} accessToken={accessToken} />
      )}
      {tabId === "cans" && (
        <Cans cans={cans} update={updateCans} accessToken={accessToken} />
      )}
    </div>
  );
};

export default App;
