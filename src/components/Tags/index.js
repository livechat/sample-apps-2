import React from "react";
import { Button, Toast } from "@livechat/design-system";
import MaterialIcon from "material-icons-react";

import "styled-components/macro";
import api from "../../utils/api";

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

const linkStyle = `
  text-decoration: none;
  color: #4384f5;
`;

export default ({ tags, setUpdate, accessToken }) => {
  return (
    <div css={containerStyle}>
      <Button primary>
        <span css={labelStyle}>Add new tag</span>
        <MaterialIcon icon="create" color="white" />
      </Button>
      <div css={tagContainerStyle}>
        {tags &&
          tags.map((tag, i) => {
            const { name, group } = tag;
            return (
              <Toast
                key={i}
                removable
                onClose={() => {
                  api
                    .removeTag(name, group, accessToken)
                    .then(() => setUpdate(true));
                }}
              >
                #{name}
              </Toast>
            );
          })}
      </div>
      <span css={helpStyle}>
        <a
          href="https://www.livechatinc.com/kb/tagging-chats-and-tickets/"
          target="_blank"
          css={linkStyle}
        >
          How to use tags?
        </a>
      </span>
    </div>
  );
};
