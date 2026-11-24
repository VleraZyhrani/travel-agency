const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();
const prisma = require("../config/prisma");

// GET all destinations
router.get("/", async (req, res) => {
  try {
    const destinations = await prisma.destination.findMany({
      include: { packages: true }
    });
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create destination
router.post("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, country, description, imageUrl } = req.body;
    const newDestination = await prisma.destination.create({
      data: { name, country, description, imageUrl }
    });
    res.status(201).json(newDestination);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update destination
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, country, description, imageUrl } = req.body;
    const updatedDestination = await prisma.destination.update({
      where: { id: parseInt(id) },
      data: { name, country, description, imageUrl }
    });
    res.json({ message: "Destinacioni u përditësua me sukses!", data: updatedDestination });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE destination
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.destination.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: "Destinacioni u fshi me sukses!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;