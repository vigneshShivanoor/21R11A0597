const axios = require("axios");

const token = "your-token-here"; // Replace with your actual token
const API_URL = "http://localhost:9876/test/even";

axios
  .get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error(error);
  });

  