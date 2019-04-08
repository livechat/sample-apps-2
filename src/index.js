import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import { accountsSdk } from "@livechat/accounts-sdk";
import "@livechat/design-system/dist/design-system.css";
import config from "./utils/config";
import App from "./components";

const AppWithAuth = () => {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const { client_id } = config;
    accountsSdk.init({
      client_id,
      onIdentityFetched: (error, data) => {
        const { access_token } = data;
        setAccessToken(access_token);
      }
    });
  });

  if (!accessToken) {
    return <b>Loading...</b>;
  }

  return <App accessToken={accessToken} />;
};

ReactDOM.render(<AppWithAuth />, document.getElementById("root"));
