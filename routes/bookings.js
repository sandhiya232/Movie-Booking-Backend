const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

// POST - Book seats
router.post("/", async (req, res) => {
  const { movieId, userEmail, seats, showTime, movieTitle, posterPath } = req.body;

  try {
    // Check if any of the seats are already booked
    const existingBookings = await Booking.find({ movieId });
    const bookedSeats = existingBookings.flatMap(b => b.seats);
    const alreadyBooked = seats.filter(s => bookedSeats.includes(s));

    if (alreadyBooked.length > 0) {
      return res.status(400).json({
        message: "Some seats already booked",
        alreadyBooked
      });
    }

    // Pricing logic
    const premiumRows = ["A", "B"];
    const seatPrices = seats.map((label) => {
      const row = label.charAt(0);
      return premiumRows.includes(row) ? 200 : 150;
    });
    const totalPrice = seatPrices.reduce((sum, price) => sum + price, 0);

    // Save as a new booking document
    const newBooking = new Booking({
      movieId,
      movieTitle,
      userEmail,
      seats,
      showTime,
      posterPath,
      lastBooking: {
        totalPrice,
        timestamp: new Date(),
      },
    });

    await newBooking.save();

    res.json({
      message: "✅ Booking successful",
      booking: newBooking
    });

  } catch (error) {
    console.error("❌ Booking failed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET - Get booked seats for a movie
router.get("/:movieId", async (req, res) => {
  const { movieId } = req.params;

  try {
    const bookings = await Booking.find({ movieId });
    const bookedSeats = bookings.flatMap((b) => b.seats);
    res.json({ bookedSeats });
  } catch (err) {
    console.error("❌ Error fetching booked seats:", err);
    res.status(500).json({ message: "Error fetching booked seats" });
  }
});

// GET - Get all bookings for a specific user
router.get("/user/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const bookings = await Booking.find({ userEmail: email });
    res.json({ bookings });
  } catch (err) {
    console.error("❌ Error fetching user bookings:", err);
    res.status(500).json({ message: "Error fetching user bookings" });
  }
});

module.exports = router;
