import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://opentdb.com/";

function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}

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

    const results = response.data.results;
    for (let i = 0; i < 10; i++) {
      results[i].answers = [...results[i].incorrect_answers];
      results[i].answers.push(results[i].correct_answer);
      shuffle(results[i].answers);
    }
    console.log(results);
    res.render("quick.ejs");
  } catch (error) {
    console.log("Error: ", error.message);
  }
}),
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
