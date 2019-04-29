import React, { useState } from "react";
import { TabsWrapper, TabsList, Tab, Toast } from "@livechat/design-system";

import Spinner from "../Spinner";
import "styled-components/macro";

const timeInterval = ["day", "week", "month", "year"];

export default ({ ratings, time, setTime, times, error }) => {
  const [tabId, setTabId] = useState("week");

  if (error) {
    return <Toast variant="error">Section only for enterprise clients.</Toast>;
  }

  if (!ratings) {
    return <Spinner marginTop="calc(100% - 50px)" />;
  }

  return (
    <>
      <div
        css={`
          background-color: white;
          border: solid 1px hsl(0, 0%, 90%);
          padding-bottom: 20px;
        `}
      >
        <TabsWrapper
          css={`
            width: 200px !important;
          `}
        >
          <TabsList>
            {timeInterval.map((e, i) => {
              return (
                <Tab
                  key={i}
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
      </div>
    </>
  );
};
