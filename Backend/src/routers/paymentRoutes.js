
const express = require("express");
const router = express.Router();
const prisma = require("../config/prisma");

router.get("/", async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      include: { booking: true }
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!payment) {
      return res.status(404).json({ error: "Pagesa nuk u gjet!" });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { bookingId, amount, method, status } = req.body;

    if (amount == null || !Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ error: "Shuma duhet te jete pozitive!" });
    }

    const newPayment = await prisma.payment.create({
      data: {
        bookingId: parseInt(bookingId),
        amount: parseFloat(amount),
        method,
        status: status || "PENDING"
      }
    });

    res.status(201).json(newPayment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { amount, method, status } = req.body;

    if (amount !== undefined &&
        (amount == null || !Number.isFinite(Number(amount)) || Number(amount) <= 0)) {
      return res.status(400).json({ error: "Shuma duhet te jete pozitive!" });
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: parseInt(req.params.id) },
      data: {
        amount: amount !== undefined ? parseFloat(amount) : undefined,
        method,
        status
      }
    });

    res.json({
      message: "Pagesa u perditesua me sukses!",
      data: updatedPayment
    });
  } catch (error) {
    res.status(error.code === "P2025" ? 404 : 500)
      .json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await prisma.payment.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({ message: "Pagesa u fshi me sukses!" });
  } catch (error) {
    res.status(error.code === "P2025" ? 404 : 500)
      .json({ error: error.message });
  }
});

module.exports = router;
