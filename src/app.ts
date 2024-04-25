import dotenv from "dotenv";
import express, { Request, Response } from "express";

dotenv.config();

const app = express();
const port: number = process.env.PORT
  ? Number.parseInt(process.env.PORT, 10)
  : 3000;

app.use(express.json());
app.use(express.urlencoded());

app.get("/", (req: Request, res: Response) => {
  res.json({ msg: "Initial Commit" });
});

const start = () => {
  try {
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
