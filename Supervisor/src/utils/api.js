import config from "./config";
import axios from "axios";

const GET = "GET";
const { server_url } = config;

const createApiRequest = (method, route, accessToken, name) =>
  axios({
    method,
    url: server_url + route,
    headers: {
      Authorization: "Bearer " + accessToken,
      DateInterval: 1,
      Agent: name,
      "X-API-Version": "2"
    }
  }).catch(function(error) {
    console.error(error);
  });

const api = {
  fetchAgents: accessToken => createApiRequest(GET, "/agents", accessToken),
  fetchAgentRatings: (name, accessToken) =>
    createApiRequest(GET, "/ratings/week", accessToken, name),
  fetchAgentAvailability: (name, accessToken) =>
    createApiRequest(GET, "/availability", accessToken, name),
  fetchChattingTime: (name, accessToken) =>
    createApiRequest(GET, "/chatting", accessToken, name)
};

export default api;
