const NodeGeocoder = require("node-geocoder");
require("dotenv").config({ path: "./configs/config.env" });
const options = {
  provider: "mapquest",
  // Optional depending on the providers
  httpAdapter: "https",
  apiKey: process.env.MAPQUEST_API,
  formatter: null, // 'gpx', 'string', ...
};

module.exports = NodeGeocoder(options);
