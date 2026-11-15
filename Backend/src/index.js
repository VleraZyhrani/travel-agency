require("dotenv").config();
const express = require("express");
const cors = require("cors");

const userRoutes = require("./routers/userRoutes");
const destinationRoutes = require("./routers/destinationRoutes");
const packageRoutes = require("./routers/packageRoutes");
const bookingRoutes = require("./routers/bookingRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Travel Agency API is running with modular routes!" });
});

// Lidhja e rrugëve
app.use("/users", userRoutes);
app.use("/destinations", destinationRoutes);
app.use("/packages", packageRoutes);
app.use("/bookings", bookingRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});