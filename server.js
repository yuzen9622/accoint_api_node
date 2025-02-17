const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./Router/userRoute");
const accountRoute = require("./Router/accountRoute");
const recordRoute = require("./Router/recordRoute");
const categortyRoute = require("./Router/categoryRoute");
const autoDebitJobs = require("./cron/accountCron");
require("dotenv").config();

const app = express();
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(cors({ origin: "*" }));
app.use("/", (req, res) => {
  return res.status(200).json({ ok: true });
});
app.use("/users", userRoute);
app.use("/accounts", accountRoute);
app.use("/categories", categortyRoute);
app.use("/records", recordRoute);
app.get("/cron/accountCron", autoDebitJobs);

let port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server is listen on port:${port},http://localhost:${port}`);
});
const uri = process.env.MONGOOSE_URI;
mongoose
  .connect(uri, {
    serverApi: { version: "1", strict: true, deprecationErrors: true },
  })
  .then(() => {
    console.log("mongoose connect successful");
  })
  .catch((err) => {
    console.log(err);
  });
