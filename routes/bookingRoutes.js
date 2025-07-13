// routes/bookingRoutes.js
const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

// ✅ GET /api/bookings/:movieId – Get booked seats for a movie
router.get("/:movieId", async (req, res) => {
  try {
    const bookings = await Booking.find({ movieId: req.params.movieId });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error });
  }
});

// ✅ POST /api/bookings – Create a new booking
router.post("/", async (req, res) => {
  const { movieId, userEmail, seats } = req.body;

  if (!movieId || !userEmail || !seats || !seats.length) {
    return res.status(400).json({ message: "Missing booking details" });
  }

  try {
    // Check if any of the selected seats are already booked
    const existing = await Booking.find({ movieId });
    const alreadyBooked = existing.flatMap((b) => b.seats);
    const conflict = seats.filter((seat) => alreadyBooked.includes(seat));

    if (conflict.length > 0) {
      return res
        .status(409)
        .json({ message: "Some seats already booked", conflict });
    }

    const newBooking = new Booking({ movieId, userEmail, seats });
    await newBooking.save();
    res.status(201).json({ message: "Booking successful", booking: newBooking });
  } catch (error) {
    res.status(500).json({ message: "Error saving booking", error });
  }
});

module.exports = router;
