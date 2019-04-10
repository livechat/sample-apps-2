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

const linkStyle = `
  text-decoration: none;
  color: #4384f5;
`;

const contentStyle = `
  margin: 15px auto;
`;

export default ({ tags, update, accessToken }) => {
  const [remove, setRemove] = useState([]);
  const [open, setOpen] = useState(false);
  const [tagToRemove, setTagToRemove] = useState(null);

  const [tag, setTag] = useState([]);

  const onSubmit = e => {
    e.preventDefault();
    api.createTag(tag, accessToken).then(() => {
      update();
      setOpen(false);
    });
  };

  return (
    <div css={containerStyle}>
      <Button primary onClick={() => setOpen(true)}>
        <span css={labelStyle}>Add new tag</span>
        <MaterialIcon icon="create" color="white" />
      </Button>
      {open && (
        <ModalBase onClose={() => setOpen(false)}>
          <div css={contentStyle}>
            <Form
              onSubmit={onSubmit}
              labelText="Create tag"
              helperText={"Fill fields with tag name"}
              formFooter={
                <Button primary submit>
                  Add can
                </Button>
              }
            >
              <FieldGroup>
                <InputField
                  value={tag}
                  onChange={e => setTag(e.target.value)}
                  placeholder="Tag name.."
                  required
                />
              </FieldGroup>
            </Form>
          </div>
        </ModalBase>
      )}
      {tagToRemove && (
        <ActionModal
          onClose={() => setTagToRemove(null)}
          heading="Danger!"
          actions={
            <Fragment>
              <Button
                onClick={() => setTagToRemove(null)}
                style={{ marginRight: "10px" }}
              >
                Wait, go back
              </Button>
              <Button
                onClick={() => {
                  setRemove([...remove, tagToRemove]);
                  api.removeTag(tagToRemove, accessToken).then(update);
                  setTagToRemove(null);
                }}
                destructive
              >
                Yes, delete this tag
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
        {tags &&
          tags.map((tag, i) => {
            const { name } = tag;
            const isRemoving = remove.includes(name);
            return (
              <Toast
                variant={isRemoving ? "warning" : "notification"}
                key={i}
                removable={!isRemoving}
                onClose={() => {
                  setTagToRemove(name);
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
