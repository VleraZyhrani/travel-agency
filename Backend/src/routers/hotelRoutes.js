
const express = require("express");
const router = express.Router();
const prisma = require("../config/prisma");

router.get("/", async (req, res) => {
  try {
    const hotels = await prisma.hotel.findMany({
      include: { package: true }
    });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const hotel = await prisma.hotel.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!hotel) {
      return res.status(404).json({ error: "Hoteli nuk u gjet!" });
    }

    res.json(hotel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, city, address, nightlyPrice, availableRooms, packageId } = req.body;

    const newHotel = await prisma.hotel.create({
      data: {
        name,
        city,
        address,
        nightlyPrice: parseFloat(nightlyPrice),
        availableRooms: parseInt(availableRooms),
        packageId: parseInt(packageId)
      }
    });

    res.status(201).json(newHotel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, city, address, nightlyPrice, availableRooms } = req.body;

    const updatedHotel = await prisma.hotel.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name,
        city,
        address,
        nightlyPrice: nightlyPrice !== undefined
          ? parseFloat(nightlyPrice) : undefined,
        availableRooms: availableRooms !== undefined
          ? parseInt(availableRooms) : undefined
      }
    });

    res.json({
      message: "Hoteli u perditesua me sukses!",
      data: updatedHotel
    });
  } catch (error) {
    res.status(error.code === "P2025" ? 404 : 500)
      .json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await prisma.hotel.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({ message: "Hoteli u fshi me sukses!" });
  } catch (error) {
    res.status(error.code === "P2025" ? 404 : 500)
      .json({ error: error.message });
  }
});

module.exports = router;
