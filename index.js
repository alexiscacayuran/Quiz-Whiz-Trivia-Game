import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import he from "he";

const app = express();
const port = 3000;
const API_URL = "https://opentdb.com/";
//const __amount = 5;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

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

app.get("/create", (req, res) => {
  const __code = req.query.code;
  console.log(__code);
  if (__code) {
    res.render("create.ejs", { code: __code });
  } else res.render("create.ejs");
});

app.post("/play", async (req, res) => {
  //console.log(req.body);

  const amount = "10";
  const type = "multiple";
  const difficulty = req.body.difficulty;
  var category = "";

  if (req.body.category) {
    category = req.body.category;
  }

  try {
    const response = await axios.get(API_URL + "api.php", {
      params: {
        amount: amount,
        difficulty: difficulty,
        type: type,
        category: category,
      },
    });

    const results = response.data.results;
    const code = response.data.response_code;

    console.log(code);

    if (code === 0) {
      for (var i = 0; i < amount; i++) {
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

      res.render("play.ejs", {
        content: results,
        difficulty: difficulty,
        category: category,
      });
    } else {
      //redirect to create route with context, add api response code
      res.redirect(`/create?code=` + code);
    }
  } catch (error) {
    if (error.response && error.response.status === 429) {
      // Redirect the user to a specific route if they encounter a 429 error
      return res.redirect(`/create?code=5`); // Replace '/error429' with the route you want to redirect to
    } else {
      // Handle other errors
      console.error("An error occurred:", error);
      return res.status(500).send("An error occurred. Please try again later.");
    }
    console.log("Error: ", error.message);
  }
}),
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
