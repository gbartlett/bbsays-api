import express from "express";

require("./settings/initEnv");

const app = express();

app.listen(parseInt(process.env.PORT), process.env.HOST, () => {
  // eslint-disable-next-line no-console
  console.log(`Server Running at ${process.env.HOST}:${process.env.PORT}`);
});
