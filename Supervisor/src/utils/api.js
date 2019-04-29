import config from "./config";
import axios from "axios";

const GET = "GET";
const POST = "post";
const PUT = "put";
const DELETE = "delete";

const { server_url } = config;

const createApiRequest = (method, route, accessToken, data) =>
  axios({
    method,
    url: server_url + route,
    headers: {
      Authorization: "Bearer " + accessToken,
      "X-API-Version": "2"
    },
    data
  }).catch(function(error) {
    console.error(error);
  });

const api = {
  fetchAgents: accessToken => createApiRequest(GET, "/agents", accessToken),
  fetchAgentRatings: (name, accessToken) =>
    createApiRequest(GET, "/ratings/week", accessToken, { Agent: name })
};

export default api;

// axios.get(Config.server_url + "/ratings/week", {
//   headers: {
//     Authorization: "Bearer " + accessToken,
//     "X-API-Version": "2",
//     Agent: agentName
//   }
// });
