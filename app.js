const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Helloo from server");
});

app.get("/hello", (req, res) => {
  res.send("This another hello from hello path");
});
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
