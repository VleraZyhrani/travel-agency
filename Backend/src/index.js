// src/index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Rruga bazë
app.get("/", (req, res) => {
  res.json({ message: "Travel Agency API is running with full CRUD!" });
});

// ==========================================
// 1. USERS (Përdoruesit)
// ==========================================

// Lexo të gjithë përdoruesit
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Gabim gjatë leximit të përdoruesve: " + error.message });
  }
});

// Shto përdorues të ri
app.post("/users", async (req, res) => {
  try {
    const { fullName, email, passwordHash, role } = req.body;
    const newUser = await prisma.user.create({
      data: { fullName, email, passwordHash, role: role || "CLIENT" }
    });
    res.status(201).json({ message: "Përdoruesi u krijua!", data: newUser });
  } catch (error) {
    res.status(500).json({ error: "Gabim: " + error.message });
  }
});


// ==========================================
// 2. DESTINATIONS (Destinacionet)
// ==========================================

// Lexo të gjitha destinacionet
app.get("/destinations", async (req, res) => {
  try {
    const destinations = await prisma.destination.findMany({
      include: { packages: true }
    });
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ error: "Gabim: " + error.message });
  }
});

// Shto destinacion të ri
app.post("/destinations", async (req, res) => {
  try {
    const { name, country, description, imageUrl } = req.body;
    const newDestination = await prisma.destination.create({
      data: { name, country, description, imageUrl }
    });
    res.status(201).json({ message: "Destinacioni u shtua!", data: newDestination });
  } catch (error) {
    res.status(500).json({ error: "Gabim: " + error.message });
  }
});


// ==========================================
// 3. PACKAGES (Paketat Turistike)
// ==========================================

// Lexo të gjitha paketat
app.get("/packages", async (req, res) => {
  try {
    const packages = await prisma.package.findMany({
      include: { destination: true }
    });
    res.json(packages);
  } catch (error) {
    res.status(500).json({ error: "Gabim: " + error.message });
  }
});

// Shto paketë të re
app.post("/packages", async (req, res) => {
  try {
    const { title, price, startDate, endDate, availableSeats, destinationId } = req.body;
    const newPackage = await prisma.package.create({
      data: {
        title,
        price: parseFloat(price),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        availableSeats: parseInt(availableSeats),
        destinationId: parseInt(destinationId)
      }
    });
    res.status(201).json({ message: "Paketa u shtua!", data: newPackage });
  } catch (error) {
    res.status(500).json({ error: "Gabim: " + error.message });
  }
});


// ==========================================
// 4. BOOKINGS (Rezervimet)
// ==========================================

// Lexo të gjitha rezervimet
app.get("/bookings", async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: { user: true, package: true }
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Gabim: " + error.message });
  }
});

// Krijo një rezervim të ri
app.post("/bookings", async (req, res) => {
  try {
    const { userId, packageId, totalPrice, status } = req.body;
    const newBooking = await prisma.booking.create({
      data: {
        userId: parseInt(userId),
        packageId: parseInt(packageId),
        totalPrice: parseFloat(totalPrice),
        status: status || "PENDING"
      }
    });
    res.status(201).json({ message: "Rezervimi u krye me sukses!", data: newBooking });
  } catch (error) {
    res.status(500).json({ error: "Gabim: " + error.message });
  }
});


// Ndezja e Serverit
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});