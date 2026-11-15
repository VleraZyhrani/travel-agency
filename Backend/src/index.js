
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const userRoutes = require("./routers/userRoutes");
const destinationRoutes = require("./routers/destinationRoutes");
const packageRoutes = require("./routers/packageRoutes");
const bookingRoutes = require("./routers/bookingRoutes");
const reviewRoutes = require("./routers/reviewRoutes");
const paymentRoutes = require("./routers/paymentRoutes");
const hotelRoutes = require("./routers/hotelRoutes");
const flightRoutes = require("./routers/flightRoutes");
const categoryRoutes = require("./routers/categoryRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Travel Agency API is running with modular routes!" });
});

app.use("/users", userRoutes);
app.use("/destinations", destinationRoutes);
app.use("/packages", packageRoutes);
app.use("/bookings", bookingRoutes);
app.use("/reviews", reviewRoutes);
app.use("/payments", paymentRoutes);
app.use("/hotels", hotelRoutes);
app.use("/flights", flightRoutes);
app.use("/categories", categoryRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
