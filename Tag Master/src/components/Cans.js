import React, { useState, Fragment, useEffect } from "react";
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
  grid-template-rows: 70px auto 38px; 
  grid-gap: 15px;
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

const formContainer = `
  width: 189px;
  display: grid;
  grid-gap: 5px;
  grid-template:
    "content content" 38px
    "input btn" 38px
    "tags tags" auto
    / 100px 80px;
`;

const contentInputStyle = `
  margin: 0;
  grid-area: content;
`;

const tagInputStyle = `
  grid-area: input;
  > div > input {
    width: 100px !important;
  }
`;

const tagButtonStyle = `
  grid-area: btn;
  height: 36px;
  width: 50px !important;
`;

const tagsContainerStyle = `
  grid-area: tags;
  font-size: 15px;
  display: flex;
  flex-wrap: wrap;

  > span {
  margin: 5px;
  }
`;

const tagElementStyle = `
  display: flex;
  align-items: center;
`;

const deleteIconStyle = `
  cursor: pointer;
  :hover > i {
    color: #d64546;
  }
`;

const EditModal = ({
  can = { tags: [], text: "" },
  setOpen,
  update,
  setCan,
  accessToken
}) => {
  const [tags, setTags] = useState([...can.tags]);
  const [content, setContent] = useState(can.text);
  const [currentTag, setCurrentTag] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = e => {
    e.preventDefault();
    setLoading(true);
    const apiRequest = can.id
      ? api.updateCan(can.id, content, tags, accessToken)
      : api.createCan(content, tags, accessToken);
    apiRequest.then(update).then(() => {
      resetState();
      setOpen(false);
    });
  };

  const resetState = () => {
    setTags([]);
    setContent("");
    setCurrentTag("");
    setCan(undefined);
  };

  return (
    <ModalBase
      onClose={() => {
        setOpen(false);
        resetState();
      }}
    >
      <div css={contentStyle}>
        <Form
          css={formStyle}
          onSubmit={onSubmit}
          labelText={can ? "Update canned response" : "Create canned response"}
          helperText={"Fill fields with content and tags"}
          formFooter={
            <Button primary submit loading={loading}>
              {can ? "Update can" : "Add can"}
            </Button>
          }
        >
          <FieldGroup>
            <div css={formContainer}>
              <InputField
                id={"content"}
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Content.."
                required
                css={contentInputStyle}
              />
              <InputField
                id={"tag"}
                onChange={e => setCurrentTag(e.target.value)}
                placeholder="Tag.."
                value={currentTag}
                css={tagInputStyle}
              />
              <Button
                primary
                onClick={() => {
                  if (currentTag) {
                    setTags([...tags, currentTag]);
                  }
                  setCurrentTag("");
                }}
                css={tagButtonStyle}
              >
                Add
              </Button>
              <div css={tagsContainerStyle}>
                {tags.map((tag, i) => {
                  return (
                    <span key={i} css={tagElementStyle}>
                      #{tag}
                      <span
                        css={deleteIconStyle}
                        onClick={() => {
                          setTags([...tags].filter(element => element !== tag));
                        }}
                      >
                        <MaterialIcon icon="delete_forever" />
                      </span>
                    </span>
                  );
                })}
              </div>
            </div>
          </FieldGroup>
        </Form>
      </div>
    </ModalBase>
  );
};

export default ({ cans, accessToken, update }) => {
  const [remove, setRemove] = useState([]);
  const [open, setOpen] = useState(false);

  const [canToRemove, setCanToRemove] = useState(null);
  const [loading, setLoading] = useState(false);

  const [updateCan, setUpdateCan] = useState(undefined);

  return (
    <div css={containerStyle}>
      <Button primary onClick={() => setOpen(true)}>
        <span css={labelStyle}>Add new canned response</span>
        <MaterialIcon icon="create" color="white" />
      </Button>
      {open && (
        <EditModal
          can={updateCan}
          setOpen={setOpen}
          update={update}
          accessToken={accessToken}
          setCan={setUpdateCan}
        />
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
                    setOpen(true);
                    setUpdateCan(can);
                  }}
                >
                  {can.text}
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
          rel="noopener noreferrer"
          target="_blank"
          css={linkStyle}
        >
          How to use canned response?
        </a>
      </span>
    </div>
  );
};
