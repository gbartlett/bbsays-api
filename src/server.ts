require("./settings/initEnv");
import express from "express";
import { DB } from "./db/client";

const app = express();

app.get("/healthcheck", async (req, res) => {
  try {
    await DB.query("SELECT 1 + 1", []);
    return res.json({ ok: true });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(500).send();
  }
});

app.listen(parseInt(process.env.PORT), process.env.HOST, () => {
  // eslint-disable-next-line no-console
  console.log(`Server Running at ${process.env.HOST}:${process.env.PORT}`);
});
