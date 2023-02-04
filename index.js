import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/users.js";
mongoose.set("strictQuery", false);
import questionRoutes from './routes/Questions.js';
import answerRoutes from './routes/Answers.js';
import dotenv from 'dotenv';

dotenv.config({path:'./config.env'});


const app = express();
dotenv.config();
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());


app.use("/user", userRoutes);
app.use('/questions',questionRoutes);
app.use('/answer',answerRoutes)


app.get("/", (req, res) => {
  res.send("Hello StackOverflow");
});


const PORT = process.env.PORT || 5000;
const DATABASE_URL = process.env.CONNECTION_URL


mongoose
  .connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  .then(() =>
    app.listen(PORT, () =>
      console.log(
        `Connection Successfull ! Server is Running on PORT : ${PORT}`
      )
    )
  )
  .catch((err) => console.log(err.message));


  