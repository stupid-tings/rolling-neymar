const express = require("express");
const path = require("path");

const app = express();

app.use("/assets", express.static("./assets"));
app.use("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
