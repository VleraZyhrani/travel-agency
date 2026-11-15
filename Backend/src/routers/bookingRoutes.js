const express = require("express");
const router = express.Router();
const prisma = require("../config/prisma");

// GET all bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: true,
        package: true
      }
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create booking
router.post("/", async (req, res) => {
  try {
    const { userId, packageId, totalPrice, status, numberOfPeople } = req.body;
    const newBooking = await prisma.booking.create({
      data: {
        userId: parseInt(userId),
        packageId: parseInt(packageId),
        totalPrice: parseFloat(totalPrice),
        status: status || "PENDING",
        numberOfPeople: numberOfPeople ? parseInt(numberOfPeople) : undefined
      }
    });
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update booking
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, totalPrice, numberOfPeople } = req.body;
    const updatedBooking = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: {
        status,
        totalPrice: totalPrice ? parseFloat(totalPrice) : undefined,
        numberOfPeople: numberOfPeople ? parseInt(numberOfPeople) : undefined
      }
    });
    res.json({ message: "Rezervimi u përditësua me sukses!", data: updatedBooking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE booking
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.booking.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: "Rezervimi u fshi me sukses!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;