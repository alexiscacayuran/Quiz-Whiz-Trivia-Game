import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://opentdb.com/";

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/quick", async (req, res) => {
  try {
    const response = await axios.get(API_URL + "api.php", {
      params: {
        amount: 10,
        type: "multiple",
      },
    });
    console.log(response.data);
    res.render("quick.ejs");
  } catch (error) {
    console.log("Error: ", error.message);
  }
}),
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
