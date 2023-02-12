import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/users.js";
mongoose.set("strictQuery", false);
import questionRoutes from "./routes/Questions.js";
import answerRoutes from "./routes/Answers.js";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});



const app = express();
dotenv.config();
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());


app.use("/user", userRoutes);
app.use("/questions", questionRoutes);
app.use("/answer", answerRoutes);

app.get("/", (req, res) => {
  res.send("Hello StackOverflow");
});

app.post("/chat", (req, res) => {
  const question = req.body.question;
  const openai = new OpenAIApi(configuration);

  openai
    .createCompletion({
      model: "text-davinci-003",
      prompt: question,
      max_tokens: 4000,
      temperature: 0,
    })
    .then((res) => {
      return res?.data?.choices?.[0]?.text;
    }).then(ans=>{
      const arr= ans?.split('\n').filter(value=>value).map(value=>value.trim())
      return arr;
    })
    .then((answer) => {
      res.send({
        answer: answer,
        prompt:question,
      });
    });

});

const PORT = process.env.PORT || 5000;
const DATABASE_URL = process.env.CONNECTION_URL;

mongoose
  .connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  .then(() =>
    app.listen(PORT, () =>
      console.log(
        `Connection Successfull ! Server is Running on PORT : ${PORT}`
      )
    )
  )
  .catch((err) => console.log(err.message));
