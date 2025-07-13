const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const bookingRoutes = require("./routes/bookings");


const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/bookings", bookingRoutes);
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log("🚀 Server running on port 5000"));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
