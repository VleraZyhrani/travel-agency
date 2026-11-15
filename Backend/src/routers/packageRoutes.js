const express = require("express");
const router = express.Router();
const prisma = require("../config/prisma");

// GET all packages
router.get("/", async (req, res) => {
  try {
    const packages = await prisma.package.findMany({
      include: { destination: true }
    });
    res.json(packages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create package
router.post("/", async (req, res) => {
  try {
    const { title, description, price, durationDays, availableSeats, destinationId } = req.body;
    const newPackage = await prisma.package.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        durationDays: durationDays ? parseInt(durationDays) : undefined,
        availableSeats: availableSeats ? parseInt(availableSeats) : undefined,
        destinationId: parseInt(destinationId)
      }
    });
    res.status(201).json(newPackage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update package
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, durationDays, availableSeats } = req.body;
    const updatedPackage = await prisma.package.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        price: price ? parseFloat(price) : undefined,
        durationDays: durationDays ? parseInt(durationDays) : undefined,
        availableSeats: availableSeats ? parseInt(availableSeats) : undefined
      }
    });
    res.json({ message: "Paketa u përditësua me sukses!", data: updatedPackage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE package
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.package.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: "Paketa u fshi me sukses!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;