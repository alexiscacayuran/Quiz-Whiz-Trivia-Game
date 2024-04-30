import express from "express";
import axios from "axios";
import he from "he";

const app = express();
const port = 3000;
const API_URL = "https://opentdb.com/";

app.use(express.static("public"));

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
        difficulty: "easy",
        type: "multiple",
      },
    });

    const results = response.data.results;
    console.log(results);
    for (var i = 0; i < 10; i++) {
      results[i].category = he.decode(results[i].category);
      results[i].question = he.decode(results[i].question);
      results[i].correct_answer = he.decode(results[i].correct_answer);

      results[i].choices = [...results[i].incorrect_answers];
      results[i].choices.push(results[i].correct_answer);
      results[i].choices = results[i].choices.map((element) => {
        return he.decode(element);
      });

      shuffle(results[i].choices);
    }

    res.render("quick.ejs", { content: results });
  } catch (error) {
    console.log("Error: ", error.message);
  }
}),
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
