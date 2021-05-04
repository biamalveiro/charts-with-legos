const axios = require("axios");
require("dotenv").config();

const API = "https://rebrickable.com/api/v3/lego";

module.exports = async (endpoint, method, params = {}) => {
  console.log(params);
  const { data, errors } = await axios({
    url: `${API}${endpoint}`,
    method: method,
    headers: {
      Authorization: `key ${process.env.REACT_APP_REBRICKABLE_KEY}`,
    },
    params: params,
  });

  if (errors) {
    console.error(errors);
    throw new Error("Something went wrong when fetching data");
  }
  return data;
};
