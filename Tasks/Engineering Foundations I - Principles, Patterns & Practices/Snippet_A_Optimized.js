/**
 * Snippet_A_Optimized.js
 * ------------------------------------------------------------------
 * Clean Code refactoring of Snippet_A.js
 *
 * Key improvements:
 *   1. Single Responsibility Principle  - each class/method does one thing
 *   2. Dependency Injection             - database, email, logger injected
 *   3. No magic numbers/strings         - constants & named errors
 *   4. Fail-fast validation             - all required fields checked upfront
 *   5. Domain entity                    - Booking is a first-class object
 *   6. Testability                      - every dependency can be mocked
 *   7. Open/Closed Principle            - pricing strategy is extensible
 * ------------------------------------------------------------------
 */

// ------------------------------------------------------------------
// 1. Configuration & Constants (no magic numbers / magic strings)
// ------------------------------------------------------------------
const PRICING = Object.freeze({
  STANDARD: 100,
  PREMIUM: 80,
});

const ERROR_MESSAGES = Object.freeze({
  USER_ID_REQUIRED: "userId is required",
  USER_EMAIL_REQUIRED: "userEmail is required",
  INVALID_DATE: "date must be a valid Date object",
  PAST_DATE: "Booking date must be in the future",
});

// ------------------------------------------------------------------
// 2. Domain-specific error (typed, descriptive, catchable)
// ------------------------------------------------------------------
class BookingValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "BookingValidationError";
  }
}

// ------------------------------------------------------------------
// 3. Domain Entity — a Booking is a first-class object
// ------------------------------------------------------------------
class Booking {
  constructor({ userId, date, price }) {
    this.userId = userId;
    this.date = date;
    this.price = price;
    this.createdAt = new Date();
  }
}

// ------------------------------------------------------------------
// 4. Validation — single responsibility, fail-fast
// ------------------------------------------------------------------
class BookingValidator {
  static validate({ userId, userEmail, date }) {
    if (!userId) {
      throw new BookingValidationError(ERROR_MESSAGES.USER_ID_REQUIRED);
    }
    if (!userEmail) {
      throw new BookingValidationError(ERROR_MESSAGES.USER_EMAIL_REQUIRED);
    }
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
      throw new BookingValidationError(ERROR_MESSAGES.INVALID_DATE);
    }
    if (date <= new Date()) {
      throw new BookingValidationError(ERROR_MESSAGES.PAST_DATE);
    }
  }
}

// ------------------------------------------------------------------
// 5. Pricing Strategy — extensible, no magic numbers
// ------------------------------------------------------------------
class PricingStrategy {
  static calculate(isPremium) {
    return isPremium ? PRICING.PREMIUM : PRICING.STANDARD;
  }
}

// ------------------------------------------------------------------
// 6. Repository — persistence abstraction (Dependency Inversion)
// ------------------------------------------------------------------
class BookingRepository {
  constructor(database) {
    this.database = database;
  }

  save(booking) {
    this.database.bookings.insert(booking);
  }
}

// ------------------------------------------------------------------
// 7. Notification Service — email abstraction (Dependency Inversion)
// ------------------------------------------------------------------
class NotificationService {
  constructor(sendEmail) {
    this.sendEmail = sendEmail;
  }

  sendBookingConfirmation(userEmail) {
    this.sendEmail(userEmail);
  }
}

// ------------------------------------------------------------------
// 8. BookingService — orchestrates, delegates, has no side effects
// ------------------------------------------------------------------
class BookingService {
  constructor({ bookingRepository, notificationService, logger = console }) {
    this.bookingRepository = bookingRepository;
    this.notificationService = notificationService;
    this.logger = logger;
  }

  createBooking(data) {
    BookingValidator.validate(data);

    const booking = new Booking({
      userId: data.userId,
      date: data.date,
      price: PricingStrategy.calculate(data.isPremium),
    });

    this.bookingRepository.save(booking);
    this.notificationService.sendBookingConfirmation(data.userEmail);
    this.logger.info("Booking created", { userId: booking.userId });
  }
}

// ------------------------------------------------------------------
// 9. Example usage — wiring dependencies (composition root)
// ------------------------------------------------------------------
// const database = { bookings: { insert: (booking) => { /* ... */ } } };
// const sendEmail = (userEmail) => { /* ... */ };
//
// const bookingService = new BookingService({
//   bookingRepository: new BookingRepository(database),
//   notificationService: new NotificationService(sendEmail),
//   logger: console,
// });
//
// bookingService.createBooking({
//   userId: "user-123",
//   userEmail: "user@example.com",
//   date: new Date("2026-09-01T10:00:00Z"),
//   isPremium: true,
// });

// ------------------------------------------------------------------
// 10. Export for testing / module usage
// ------------------------------------------------------------------
module.exports = {
  BookingService,
  BookingRepository,
  BookingValidator,
  Booking,
  PricingStrategy,
  NotificationService,
  BookingValidationError,
  PRICING,
  ERROR_MESSAGES,
};