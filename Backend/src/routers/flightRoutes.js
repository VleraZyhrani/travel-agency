
const express = require("express");
const router = express.Router();
const prisma = require("../config/prisma");

router.get("/", async (req, res) => {
  try {
    const flights = await prisma.flight.findMany({
      include: { package: true }
    });
    res.json(flights);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const flight = await prisma.flight.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!flight) {
      return res.status(404).json({ error: "Fluturimi nuk u gjet!" });
    }

    res.json(flight);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      airline,
      flightNumber,
      departureAirport,
      arrivalAirport,
      departureTime,
      arrivalTime,
      packageId
    } = req.body;

    if (!departureTime || !arrivalTime ||
        isNaN(Date.parse(departureTime)) || isNaN(Date.parse(arrivalTime)) ||
        new Date(arrivalTime) <= new Date(departureTime)) {
      return res.status(400).json({ error: "Orari i fluturimit nuk eshte valid!" });
    }

    const newFlight = await prisma.flight.create({
      data: {
        airline,
        flightNumber,
        departureAirport,
        arrivalAirport,
        departureTime: new Date(departureTime),
        arrivalTime: new Date(arrivalTime),
        packageId: parseInt(packageId)
      }
    });

    res.status(201).json(newFlight);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const {
      airline,
      flightNumber,
      departureAirport,
      arrivalAirport,
      departureTime,
      arrivalTime
    } = req.body;

    const updatedFlight = await prisma.flight.update({
      where: { id: parseInt(req.params.id) },
      data: {
        airline,
        flightNumber,
        departureAirport,
        arrivalAirport,
        departureTime: departureTime !== undefined
          ? new Date(departureTime) : undefined,
        arrivalTime: arrivalTime !== undefined
          ? new Date(arrivalTime) : undefined
      }
    });

    res.json({
      message: "Fluturimi u perditesua me sukses!",
      data: updatedFlight
    });
  } catch (error) {
    res.status(error.code === "P2025" ? 404 : 500)
      .json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await prisma.flight.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({ message: "Fluturimi u fshi me sukses!" });
  } catch (error) {
    res.status(error.code === "P2025" ? 404 : 500)
      .json({ error: error.message });
  }
});

module.exports = router;
