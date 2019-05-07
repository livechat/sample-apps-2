import React, { Fragment, useState, useEffect } from "react";
import {
  Toast,
  Button,
  Tooltip,
  TooltipContent,
  ModalBase
} from "@livechat/design-system";
import MaterialIcon from "material-icons-react";
import "styled-components/macro";
import Spinner from "../Spinner";
import RatioModal from "./RatioModal";
import ChatingModal from "./ChatingModal";
import WorkingModal from "./WorkingModal";

const ToastStyle = `
  height: 60px;
  cursor: pointer;
  .lc-toast__content {
    height: 100%;
    width: 100%;
    display: grid;
    grid-gap: 20px;
    grid-template: "avatar name info" / 25px auto 40px;
    align-items: center;
  }
  .lc-toast__icon {
    display: none;
  }

  :hover {
    background-color: hsl(0, 0%, 97%);
  }
`;

const AvaratStyle = status => `
  grid-area: avatar;
  width: 30px;
  border-radius: 20px;
  border: ${
    status === "accepting chats"
      ? "solid #4bb678 2px"
      : "solid hsl(0, 0%, 85%) 2px"
  };
`;

const NameStyle = `
  grid-area: name;
  font-size: 16px;
`;

const InfoButtonStyle = `
  grid-area: info;
  justify-self: end;
  width: 20px;
`;

const containerStyle = `
  width: calc(100% - 20px);
  height: auto;
  background-color: white;
  box-shadow: 0 6px 30px -10px rgba(0,0,0,.3);
  display: grid;
  grid-template: "login login login " 30px
                 "line1 line1 line1" 1px 
                 "perm perm perm" 30px 
                 "line2 line2 line2" 1px 
                 "status status status" 30px 
                 "space space space" 20px 
                 "btn1 btn2 btn3" 45px;
  grid-gap: 5px;
  padding: 20px 10px;
  color: hsl(0, 0%, 45%);
`;

const rowStyle = area => `
  grid-area: ${area};
  display: flex;
  align-items: center;
  padding-left: 5px;

  > span {
    margin-left: 10px;
    font-size: 14px;
  }
`;

const buttonStyle = area => `
  grid-area: ${area};
  justify-self: center;
  height: 30px;
  width: 80px;
`;

const lineStyle = area => `
  grid-area: ${area}; 
  height: 1px;
  width: 100%;
  background-color: hsl(0, 0%, 90%);
`;

const spaceStyle = area => `
  grid-area: ${area};
`;

const noResultsStyle = `
  margin: auto;
`;

export default ({ agents = [], data, tabId, searching }) => {
  if (agents.length <= 0 && !searching) {
    return <Spinner marginTop="calc(100% - 120px)" />;
  }

  if (agents.length <= 0 && searching) {
    return <div css={noResultsStyle}>No results</div>;
  }

  const { agentsRatings, agentsAvailability, agentsChattingTime } = data;

  const [modals, setModals] = useState([false, false, false]);
  const [infoTabs, setInfoTabs] = useState(new Array(agents.length));

  const handleModal = i => {
    const newModals = [...modals];
    newModals[i] = !modals[i];
    setModals(newModals);
  };

  const renderChart = (type, agentName) => {
    switch (type) {
      case "Working":
        return <WorkingModal data={agentsAvailability[agentName]} />;
      case "Chating":
        return <ChatingModal data={agentsChattingTime[agentName]} />;
      case "Ratio":
        return <RatioModal data={agentsRatings[agentName]} />;
    }
  };

  useEffect(() => {
    setInfoTabs([...infoTabs].fill(false));
  }, [tabId]);

  const sortedAgents = agents.sort(a =>
    a.status === "accepting chats" ? -1 : 1
  );

  return sortedAgents.map((agent, i) => {
    const { avatar, name, status, login, permission } = agent;
    return (
      <Fragment>
        <Toast
          key={i}
          css={ToastStyle}
          onClick={() => {
            const newInfoTabs = [...infoTabs];
            newInfoTabs[i] = !infoTabs[i];
            setInfoTabs(newInfoTabs);
          }}
        >
          <img src={`https://${avatar}`} css={AvaratStyle(status)} />
          <span css={NameStyle}>{name}</span>
          <span css={InfoButtonStyle}>
            <MaterialIcon icon="information" color="#4384f5" />
          </span>
        </Toast>
        {infoTabs[i] && (
          <div css={containerStyle}>
            <span css={rowStyle("login")}>
              <MaterialIcon icon="account_circle" />
              <span>{login}</span>
            </span>
            <div css={lineStyle("line1")} />
            <span css={rowStyle("perm")}>
              <MaterialIcon icon="vpn_key" />
              <span>{permission}</span>
            </span>
            <div css={lineStyle("line2")} />
            <span css={rowStyle("status")}>
              {status === "accepting chats" ? (
                <MaterialIcon icon="fiber_manual_record" color="#4bb678" />
              ) : (
                <MaterialIcon
                  icon="fiber_manual_record"
                  color="rgba(0, 0, 0, 0.54)"
                />
              )}
              <span>{status}</span>
            </span>

            <div css={spaceStyle("space")} />
            {["Working", "Chating", "Ratio"].map((e, i) => {
              return (
                <div key={i}>
                  <Button
                    css={buttonStyle("btn1")}
                    onClick={() => handleModal(i)}
                  >
                    {e}
                  </Button>
                  {modals[i] && (
                    <ModalBase
                      onClose={() => handleModal(i)}
                      style={{ width: "600px", height: "450px" }}
                    >
                      <div style={{ margin: "auto" }}>
                        {renderChart(e, name)}
                      </div>
                    </ModalBase>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Fragment>
    );
  });
};
