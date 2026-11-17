require("dotenv").config();

const mongoose = require("mongoose");
const app = require("./app");

const port = Number(process.env.PORT) || 3000;
const jwtSecret = process.env.JWT_SECRET;

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI must be set in the environment");
}

if (
  !jwtSecret ||
  jwtSecret.length < 32 ||
  jwtSecret.toLowerCase().startsWith("replace")
) {
  throw new Error(
    "JWT_SECRET must be a random secret of at least 32 characters"
  );
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Database connected");
    app.listen(port, () => {
      console.log(`Auth API listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Could not connect to MongoDB:", err.message);
    process.exitCode = 1;
  });
