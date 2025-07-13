const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  movieId: String,
  movieTitle: String,
  userEmail: String,
  seats: [String],
  showTime: String,
  posterPath: String,
  lastBooking: {
    totalPrice: Number,
    timestamp: Date,
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
