class BookingService {
  createBooking(data) {
    if (data.date < new Date()) {
      throw new Error("Booking date must be in the future");
    }

    const booking = {
      userId: data.userId,
      date: data.date,
      price: data.isPremium ? 80 : 100,
      createdAt: new Date()
    };

    database.bookings.insert(booking);
    sendBookingConfirmation(data.userEmail);
    console.log("Booking created");
  }
}
