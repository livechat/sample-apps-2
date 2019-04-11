import React, { useState, useEffect, Fragment } from "react";
import ReactDOM from "react-dom";
import { createGlobalStyle } from "styled-components";

import { accountsSdk } from "@livechat/accounts-sdk";
import "@livechat/design-system/dist/design-system.css";
import config from "./utils/config";
import App from "./components";
import Spinner from "./components/Spinner";

const GlobalStyle = createGlobalStyle`
  ::-webkit-scrollbar {
      display: none;
  }
`;

const AppWithAuth = () => {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const { client_id } = config;
    accountsSdk.init({
      client_id,
      onIdentityFetched: (error, data) => {
        if (data && data.access_token) {
          const { access_token } = data;
          setAccessToken(access_token);
        } else {
          window.location.href = `https://accounts.livechatinc.com/?response_type=token&client_id=${config.client_id}&redirect_uri=${
            window.location.href
            }`;
        }
      }
    });
  });

  if (!accessToken) {
    return <Spinner marginTop="calc(100% - 50px)" />;
  }

  return (
    <Fragment>
      <GlobalStyle />
      <App accessToken={accessToken} />
    </Fragment>
  );
};

ReactDOM.render(<AppWithAuth />, document.getElementById("root"));
