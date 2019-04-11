import React, { useState, Fragment } from "react";
import {
  Button,
  Toast,
  ModalBase,
  Form,
  FieldGroup,
  InputField,
  ActionModal
} from "@livechat/design-system";
import MaterialIcon from "material-icons-react";
import Spinner from "./Spinner";
import ChipInput from "material-ui-chip-input";

import "styled-components/macro";
import api from "../utils/api";

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
  margin: 10px 0;
  font-size: 15px;
  text-align: center;
  font-family: "Lucida Sans", sans-serif;
`;

const tagStyle = `
  color: gray;
  font-size: 12px;
  margin-left: 5px;
`;

const linkStyle = `
  text-decoration: none;
  color: #4384f5;
`;

const contentStyle = `
  margin: 15px auto;
`;

const toastStyle = `
  box-shadow: none;
  border: solid 1px hsl(0, 0%, 90%);
`;

const formStyle = `
  display: grid;
  grid-template-rows: 100px 130px 70px; 
  justify-items: center;
`;

const titleStyle = `
  cursor: pointer;
  :hover {
    color: #4384f5;
  }
`;

const buttonStyle = `
  margin-right: 10px 
`;

export default ({ cans, accessToken, update }) => {
  const [remove, setRemove] = useState([]);
  const [open, setOpen] = useState([false, null]);
  const [canToRemove, setCanToRemove] = useState(null);
  const [loading, setLoading] = useState(false);

  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");

  const onSubmit = e => {
    e.preventDefault();
    setLoading(true);
    const apiRequest = open[1]
      ? api.updateCan(open[1].id, content, tags, accessToken)
      : api.createCan(content, tags, accessToken);
    apiRequest.then(update).then(() => {
      setOpen([false]);
      setLoading(false);
      setContent("");
      setTags("");
    });
  };

  return (
    <div css={containerStyle}>
      <Button primary onClick={() => setOpen([true])}>
        <span css={labelStyle}>Add new canned response</span>
        <MaterialIcon icon="create" color="white" />
      </Button>
      {open[0] && (
        <ModalBase
          onClose={() => {
            setOpen([false]);
            setTags([]);
            setContent("");
          }}
        >
          <div css={contentStyle}>
            <Form
              css={formStyle}
              onSubmit={onSubmit}
              labelText={
                open[1] ? "Update canned response" : "Create canned response"
              }
              helperText={"Fill fields with content and tags"}
              formFooter={
                <Button primary submit loading={loading}>
                  {open[1] ? "Update can" : "Add can"}
                </Button>
              }
            >
              <FieldGroup>
                <InputField
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Content.."
                  required
                  css={`
                    margin: 0;
                  `}
                />
                <div
                  css={`
                    width: 189px;
                    display: grid;
                    grid-gap: 5px;
                    grid-template: "input btn" / 100px 80px;
                  `}
                >
                  <InputField
                    description={tags.length > 0 && "#" + tags.join(" #")}
                    onChange={e => setCurrentTag(e.target.value)}
                    placeholder="Tags.."
                    value={currentTag}
                    css={`
                      grid-area: input;
                      > div > input {
                        width: 100px !important;
                      }
                    `}
                  />
                  <Button
                    primary
                    onClick={() => {
                      setCurrentTag("");
                      setTags([...tags, currentTag]);
                    }}
                    css={`
                      grid-area: btn;
                      height: 36px;
                      width: 50px !important;
                    `}
                  >
                    Add tag
                  </Button>
                </div>
              </FieldGroup>
            </Form>
          </div>
        </ModalBase>
      )}
      {canToRemove && (
        <ActionModal
          onClose={() => setCanToRemove(null)}
          heading="Danger!"
          actions={
            <Fragment>
              <Button onClick={() => setCanToRemove(null)} css={buttonStyle}>
                Wait, go back
              </Button>
              <Button
                onClick={() => {
                  setRemove([...remove, canToRemove]);
                  setLoading(true);
                  api
                    .removeCan(canToRemove, accessToken)
                    .then(() => update())
                    .then(() => {
                      setCanToRemove(null);
                      setLoading(false);
                    });
                }}
                destructive
                loading={loading}
              >
                Yes, delete this can
              </Button>
            </Fragment>
          }
        >
          <div>
            You’re about to do something that cannot be undone. Are you sure you
            want to continue?
          </div>
        </ActionModal>
      )}
      <div css={tagContainerStyle}>
        {cans ? (
          cans.map((can, i) => {
            const { id } = can;
            return (
              <Toast
                css={toastStyle}
                key={i}
                removable
                onClose={() => {
                  setCanToRemove(id);
                }}
              >
                <span
                  css={titleStyle}
                  onClick={() => {
                    setOpen([true, can]);
                    setTags(can.tags);
                    setContent(can.text);
                  }}
                >
                  {can.text}{" "}
                  <MaterialIcon
                    icon="create"
                    color="hsl(0, 0%, 60%)"
                    size={15}
                  />
                </span>
                <div>
                  {can.tags.map((tag, i) => (
                    <span css={tagStyle} key={i}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </Toast>
            );
          })
        ) : (
          <Spinner marginTop="100px" />
        )}
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
