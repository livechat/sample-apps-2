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

const contentStyle = `
  margin: 15px auto;
`;

export default ({ cans, accessToken, update }) => {
  const [remove, setRemove] = useState([]);
  const [open, setOpen] = useState(false);
  const [canToRemove, setCanToRemove] = useState(null);

  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);

  const onSubmit = e => {
    e.preventDefault();
    api.createCan(content, tags, accessToken).then(() => {
      update();
      setOpen(false);
    });
  };
  return (
    <div css={containerStyle}>
      <Button primary onClick={() => setOpen(true)}>
        <span css={labelStyle}>Add new canned response</span>
        <MaterialIcon icon="create" color="white" />
      </Button>
      {open && (
        <ModalBase onClose={() => setOpen(false)}>
          <div css={contentStyle}>
            <Form
              onSubmit={onSubmit}
              labelText="Create canned response"
              helperText={"Fill fields with content and tags"}
              formFooter={
                <Button primary submit>
                  Add can
                </Button>
              }
            >
              <FieldGroup>
                <InputField
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Content.."
                  required
                />
                <InputField
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  placeholder="Tags.."
                  required
                />
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
              <Button
                onClick={() => setCanToRemove(null)}
                style={{ marginRight: "10px" }}
              >
                Wait, go back
              </Button>
              <Button
                onClick={() => {
                  setRemove([...remove, canToRemove]);
                  api.removeCan(canToRemove, accessToken).then(update);
                  setCanToRemove(null);
                }}
                destructive
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
        {cans &&
          cans.map((can, i) => {
            const { id } = can;
            const isRemoving = remove.includes(id);
            return (
              <Toast
                variant={isRemoving && "warning"}
                key={i}
                removable={!isRemoving}
                onClose={() => {
                  setCanToRemove(id);
                }}
              >
                {can.text}
                {!isRemoving && (
                  <div>
                    {can.tags.map((tag, i) => (
                      <span css={tagStyle} key={i}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </Toast>
            );
          })}
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
