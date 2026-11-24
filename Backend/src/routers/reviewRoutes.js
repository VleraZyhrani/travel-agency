
const { verifyToken } = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();
const prisma = require("../config/prisma");

router.get("/", async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      include: { user: true, destination: true, package: true }
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const review = await prisma.review.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!review) {
      return res.status(404).json({ error: "Vleresimi nuk u gjet!" });
    }

    res.json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", verifyToken, async (req, res) => {
  try {
    const { userId, destinationId, packageId, rating, comment } = req.body;

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating duhet te jete 1-5!" });
    }

    if ((destinationId == null) === (packageId == null)) {
      return res.status(400).json({
        error: "Zgjedh vetem destinationId ose packageId!"
      });
    }

    const newReview = await prisma.review.create({
      data: {
        userId: parseInt(userId),
        destinationId: destinationId == null ? null : parseInt(destinationId),
        packageId: packageId == null ? null : parseInt(packageId),
        rating,
        comment
      }
    });

    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (rating !== undefined &&
        (!Number.isInteger(rating) || rating < 1 || rating > 5)) {
      return res.status(400).json({ error: "Rating duhet te jete 1-5!" });
    }

    const updatedReview = await prisma.review.update({
      where: { id: parseInt(req.params.id) },
      data: { rating, comment }
    });

    res.json({
      message: "Vleresimi u perditesua me sukses!",
      data: updatedReview
    });
  } catch (error) {
    res.status(error.code === "P2025" ? 404 : 500)
      .json({ error: error.message });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await prisma.review.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({ message: "Vleresimi u fshi me sukses!" });
  } catch (error) {
    res.status(error.code === "P2025" ? 404 : 500)
      .json({ error: error.message });
  }
});

module.exports = router;
