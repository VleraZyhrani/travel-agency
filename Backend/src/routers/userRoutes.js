const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();
const prisma = require("../config/prisma");

// GET all users
router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create user
router.post("/", async (req, res) => {
  try {
    const { fullName, email, passwordHash, role } = req.body;
    const newUser = await prisma.user.create({
      data: { fullName, email, passwordHash, role }
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update user
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, role } = req.body;
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { fullName, email, role }
    });
    res.json({ message: "Përdoruesi u përditësua!", data: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE user
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: "Përdoruesi u fshi me sukses!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;