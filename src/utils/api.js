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
      Authorization: "Bearer " + accessToken
    },
    data
  }).catch(function(error) {
    console.error(error);
  });

const api = {
  fetchGroups: accessToken => createApiRequest(GET, "/groups", accessToken),
  fetchCans: accessToken => createApiRequest(GET, "/cans", accessToken),
  fetchTags: accessToken => createApiRequest(GET, "/tags", accessToken),
  removeTag: (name, group, accessToken) =>
    createApiRequest(DELETE, "/tags", accessToken, {
      tag: name,
      group: group
    })
};

export default api;
