import React from "react";
import { Button, Toast } from "@livechat/design-system";
import MaterialIcon from "material-icons-react";
import "styled-components/macro";

const containerStyle = `
  display: grid;
  grid-gap: 10px;
`;

const labelStyle = `
  margin-right: 10px;
`;

const tagContainerStyle = `
  display: grid;
  grid-gap: 10px;
  overflow: hidden;
  overflow-y: scroll;
`;

const helpStyle = `
  width: 100%;
  font-size: 15px;
  text-align: center;
  font-family: "Lucida Sans", sans-serif;
`;

const tagStyle = `
  color: gray;
  font-size: 10px;
  margin-left: 5px;
`;

const linkStyle = `
  text-decoration: none;
  color: #4384f5;
`;

export default ({ cans, setUpdate }) => {
  return (
    <div css={containerStyle}>
      <Button primary>
        <span css={labelStyle}>Add new canned response</span>
        <MaterialIcon icon="create" color="white" />
      </Button>
      <div css={tagContainerStyle}>
        {cans &&
          cans.map((can, i) => (
            <Toast removable key={i}>
              {can.text}
              <div>
                {can.tags.map((tag, i) => (
                  <span css={tagStyle} key={i}>
                    #{tag}
                  </span>
                ))}
              </div>
            </Toast>
          ))}
      </div>
      <span css={helpStyle}>
        <a
          href="https://www.livechatinc.com/kb/canned-responses/"
          target="_blank"
          css={linkStyle}
        >
          How to use canned response?
        </a>
      </span>
    </div>
  );
};
