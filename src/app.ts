import express, { Application } from "express";

const app: Application = express();
const port: number = 3001;

app.use(express.json());
app.use(express.urlencoded());

app.get("/", (req, res) => {
  res.json({ msg: "Initial Commit" });
});

const start = async () => {
  try {
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
