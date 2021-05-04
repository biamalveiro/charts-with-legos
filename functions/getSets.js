const fs = require("fs");

const sendQuery = require("./utils/sendQuery");
const formatResponse = require("./utils/formatResponse");

exports.handler = async (event) => {
  const { theme_id } = JSON.parse(event.body);
  try {
    const res = await sendQuery("/sets", "GET", { theme_id, page_size: 500 });
    const data = res.results;
    return formatResponse(200, data);
  } catch (err) {
    console.log(err);
    return formatResponse(500, {
      err: "Something went wrong fetching colors list",
    });
  }
};
