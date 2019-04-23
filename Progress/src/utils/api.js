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
  fetchRatings: (interval, accessToken) =>
    createApiRequest(GET, `/ratings/${interval}`, accessToken),
  fetchTimes: accessToken => createApiRequest(GET, `/responses`, accessToken)
};

export default api;
