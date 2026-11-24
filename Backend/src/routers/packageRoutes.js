const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();
const prisma = require("../config/prisma");

router.get("/", async (req, res) => {
  try {
    const packages = await prisma.package.findMany({
      include: {
        destination: true,
        category: true
      }
    });

    res.json(packages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "ID nuk eshte valide!" });
    }

    const packageData = await prisma.package.findUnique({
      where: { id },
      include: {
        destination: true,
        category: true
      }
    });

    if (!packageData) {
      return res.status(404).json({ error: "Paketa nuk u gjet!" });
    }

    res.json(packageData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      durationDays,
      availableSeats,
      destinationId,
      categoryId,
      startDate,
      endDate
    } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ error: "Titulli eshte i detyrueshem!" });
    }

    if (price == null || !Number.isFinite(Number(price)) || Number(price) < 0) {
      return res.status(400).json({ error: "Cmimi nuk eshte valid!" });
    }

    if (!Number.isInteger(Number(destinationId)) || Number(destinationId) <= 0) {
      return res.status(400).json({ error: "Destination ID nuk eshte valide!" });
    }

    if (
      !startDate ||
      !endDate ||
      isNaN(Date.parse(startDate)) ||
      isNaN(Date.parse(endDate)) ||
      new Date(endDate) <= new Date(startDate)
    ) {
      return res.status(400).json({ error: "Datat e udhetimit nuk jane valide!" });
    }

    if (
      availableSeats == null ||
      !Number.isInteger(Number(availableSeats)) ||
      Number(availableSeats) < 0
    ) {
      return res.status(400).json({ error: "Numri i vendeve nuk eshte valid!" });
    }

    if (
      categoryId != null &&
      (!Number.isInteger(Number(categoryId)) || Number(categoryId) <= 0)
    ) {
      return res.status(400).json({ error: "Category ID nuk eshte valide!" });
    }

    if (
      durationDays != null &&
      (!Number.isInteger(Number(durationDays)) || Number(durationDays) <= 0)
    ) {
      return res.status(400).json({ error: "Kohezgjatja nuk eshte valide!" });
    }

    const newPackage = await prisma.package.create({
      data: {
        title: title.trim(),
        description,
        price: Number(price),
        durationDays: durationDays == null ? undefined : Number(durationDays),
        availableSeats: Number(availableSeats),
        destinationId: Number(destinationId),
        categoryId: categoryId == null ? undefined : Number(categoryId),
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      }
    });

    res.status(201).json(newPackage);
  } catch (error) {
    res.status(error.code === "P2003" ? 400 : 500)
      .json({ error: error.message });
  }
});

router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const {
      title,
      description,
      price,
      durationDays,
      availableSeats,
      destinationId,
      categoryId,
      startDate,
      endDate
    } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "ID nuk eshte valide!" });
    }

    const existingPackage = await prisma.package.findUnique({
      where: { id }
    });

    if (!existingPackage) {
      return res.status(404).json({ error: "Paketa nuk u gjet!" });
    }

    if (title !== undefined && (typeof title !== "string" || !title.trim())) {
      return res.status(400).json({ error: "Titulli nuk eshte valid!" });
    }

    if (price !== undefined &&
        (price == null || !Number.isFinite(Number(price)) || Number(price) < 0)) {
      return res.status(400).json({ error: "Cmimi nuk eshte valid!" });
    }

    if (availableSeats !== undefined &&
        (availableSeats == null ||
         !Number.isInteger(Number(availableSeats)) ||
         Number(availableSeats) < 0)) {
      return res.status(400).json({ error: "Numri i vendeve nuk eshte valid!" });
    }

    if (durationDays !== undefined && durationDays !== null &&
        (!Number.isInteger(Number(durationDays)) || Number(durationDays) <= 0)) {
      return res.status(400).json({ error: "Kohezgjatja nuk eshte valide!" });
    }

    if (destinationId !== undefined &&
        (!Number.isInteger(Number(destinationId)) || Number(destinationId) <= 0)) {
      return res.status(400).json({ error: "Destination ID nuk eshte valide!" });
    }

    if (categoryId !== undefined && categoryId !== null &&
        (!Number.isInteger(Number(categoryId)) || Number(categoryId) <= 0)) {
      return res.status(400).json({ error: "Category ID nuk eshte valide!" });
    }

    if (
      (startDate !== undefined && (!startDate || isNaN(Date.parse(startDate)))) ||
      (endDate !== undefined && (!endDate || isNaN(Date.parse(endDate))))
    ) {
      return res.status(400).json({ error: "Datat nuk jane valide!" });
    }

    const newStartDate = startDate !== undefined
      ? new Date(startDate)
      : existingPackage.startDate;

    const newEndDate = endDate !== undefined
      ? new Date(endDate)
      : existingPackage.endDate;

    if (newEndDate <= newStartDate) {
      return res.status(400).json({
        error: "Data e perfundimit duhet te jete pas dates se fillimit!"
      });
    }

    const updatedPackage = await prisma.package.update({
      where: { id },
      data: {
        title: title !== undefined ? title.trim() : undefined,
        description,
        price: price !== undefined ? Number(price) : undefined,
        durationDays: durationDays === null
          ? null
          : durationDays !== undefined
            ? Number(durationDays)
            : undefined,
        availableSeats: availableSeats !== undefined
          ? Number(availableSeats)
          : undefined,
        destinationId: destinationId !== undefined
          ? Number(destinationId)
          : undefined,
        categoryId: categoryId === null
          ? null
          : categoryId !== undefined
            ? Number(categoryId)
            : undefined,
        startDate: startDate !== undefined ? new Date(startDate) : undefined,
        endDate: endDate !== undefined ? new Date(endDate) : undefined
      }
    });

    res.json({
      message: "Paketa u perditesua me sukses!",
      data: updatedPackage
    });
  } catch (error) {
    res.status(error.code === "P2025" ? 404 : error.code === "P2003" ? 400 : 500)
      .json({ error: error.message });
  }
});

router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "ID nuk eshte valide!" });
    }

    await prisma.package.delete({
      where: { id }
    });

    res.json({ message: "Paketa u fshi me sukses!" });
  } catch (error) {
    res.status(error.code === "P2025" ? 404 : error.code === "P2003" ? 409 : 500)
      .json({ error: error.message });
  }
});

module.exports = router;
