import React, { useState, useEffect } from "react";

import api from "../utils/api";

const App = ({ accessToken }) => {
  const [groups, setGroups] = useState(null);
  const [cans, setCans] = useState(null);

  useEffect(() => {
    api.fetchGroups(accessToken).then(response => setGroups(response.data));
  }, []);

  console.log(groups);
  return <div />;
};

export default App;
