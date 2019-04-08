import config from "./config";
import axios from "axios";

const GET = "GET";
const POST = "post";
const PUT = "put";
const DELETE = "delete";

const { server_url } = config;

const createApiRequest = (method, route, accessToken) =>
  axios({
    method,
    url: server_url + route,
    headers: {
      Authorization: "Bearer " + accessToken
    }
  })
    .then(response => response)
    .catch(function(error) {
      console.error(error);
    });

const api = {
  fetchGroups: accessToken => createApiRequest(GET, "/groups", accessToken)
};

export default api;
