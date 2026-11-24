const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();
const prisma = require("../config/prisma");

router.get("/", async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: { packages: true }
    });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { packages: true }
    });

    if (!category) {
      return res.status(404).json({ error: "Kategoria nuk u gjet!" });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ error: "Emri i kategorise eshte i detyrueshem!" });
    }

    const newCategory = await prisma.category.create({
      data: { name: name.trim(), description }
    });

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(error.code === "P2002" ? 409 : 500)
      .json({ error: error.message });
  }
});

router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, description } = req.body;

    if (name !== undefined &&
        (typeof name !== "string" || !name.trim())) {
      return res.status(400).json({ error: "Emri i kategorise nuk eshte valid!" });
    }

    const updatedCategory = await prisma.category.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name: name !== undefined ? name.trim() : undefined,
        description
      }
    });

    res.json({
      message: "Kategoria u perditesua me sukses!",
      data: updatedCategory
    });
  } catch (error) {
    res.status(error.code === "P2025" ? 404 : error.code === "P2002" ? 409 : 500)
      .json({ error: error.message });
  }
});

router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    await prisma.category.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({ message: "Kategoria u fshi me sukses!" });
  } catch (error) {
    const status = error.code === "P2025" ? 404 : error.code === "P2003" ? 409 : 500;
    res.status(status).json({ error: error.message });
  }
});

module.exports = router;
