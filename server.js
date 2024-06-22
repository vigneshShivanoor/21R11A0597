const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 9876;

let evenNumbers = [];

app.use(bodyParser.json());

app.get("/test/even", (req, res) => {
  res.json({ numbers: evenNumbers });
});

app.post("/test/even", (req, res) => {
  const { numbers } = req.body;
  if (!Array.isArray(numbers)) {
    return res.status(400).json({ error: "Numbers should be an array" });
  }
  evenNumbers.push(...numbers.filter((num) => num % 2 === 0));
  res.json({ message: "Numbers added successfully" });
});

app.listen(port, () => {
  console.log(`Server running on Port: ${port}`);
});
