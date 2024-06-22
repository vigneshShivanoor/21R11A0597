const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = 9876;

const WINDOW_SIZE = 10;
const QUALIFIED_IDS = new Set(["p", "f", "e", "r"]);
let numbersWindow = [];

const THIRD_PARTY_API_URL = "http://20.244.56.144/test";
const API_KEY = process.env.API_KEY; // Ensure you have set this in your .env file

const fetchNumbers = async (idType) => {
  const urlMap = {
    p: "primes",
    f: "fibo",
    e: "even",
    r: `https://api.random.org/json-rpc/4/invoke`,
  };

  try {
    if (idType === "r") {
      const response = await axios.post(
        urlMap[idType],
        {
          jsonrpc: "2.0",
          method: "generateIntegers",
          params: {
            apiKey: API_KEY,
            n: 10, // Number of random integers to generate
            min: 1, // Minimum value of the random integers
            max: 100, // Maximum value of the random integers
            replacement: true,
          },
          id: 42,
        },
        { timeout: 500 }
      );
      return response.data.result.random.data;
    } else {
      const response = await axios.get(
        `${THIRD_PARTY_API_URL}/${urlMap[idType]}`,
        {
          headers: { Authorization: `Bearer ${API_KEY}` },
          timeout: 500,
        }
      );
      return response.data.numbers || [];
    }
  } catch (error) {
    console.error("Error fetching numbers:", error.message);
    return [];
  }
};

const calculateAverage = (numbers) => {
  if (!numbers.length) return 0;
  return numbers.reduce((acc, num) => acc + num, 0) / numbers.length;
};

app.get("/numbers/:idType", async (req, res) => {
  const { idType } = req.params;
  if (!QUALIFIED_IDS.has(idType)) {
    return res.status(400).json({ error: "Invalid ID type" });
  }

  const prevWindowState = [...numbersWindow];
  const fetchedNumbers = await fetchNumbers(idType);
  const uniqueFetchedNumbers = [...new Set(fetchedNumbers)];

  numbersWindow.push(...uniqueFetchedNumbers);
  if (numbersWindow.length > WINDOW_SIZE) {
    numbersWindow = numbersWindow.slice(-WINDOW_SIZE);
  }

  const average = calculateAverage(numbersWindow);

  res.json({
    windowPrevState: prevWindowState,
    windowCurrState: numbersWindow,
    numbers: uniqueFetchedNumbers,
    avg: average.toFixed(2),
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
