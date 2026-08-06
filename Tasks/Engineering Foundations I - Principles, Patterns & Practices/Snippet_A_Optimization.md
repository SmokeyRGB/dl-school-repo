## Snippet_A.js — Clean Code Analysis & Optimized Implementation

**Original file left untouched.** The optimized version is now in `Tasks/Engineering Foundations I - Principles, Patterns & Practices/Snippet_A_Optimized.js`.

### Violations Found in the Original

| # | Clean Code Principle | Issue in Snippet_A.js |
|---|---------------------|----------------------|
| 1 | **Single Responsibility Principle** | `createBooking` validates, builds, persists, emails, *and* logs — 5 responsibilities in one method. |
| 2 | **No Magic Numbers** | Prices `80` / `100` appear inline with no explanation or central definition. |
| 3 | **Dependency Injection** | `database` and `sendBookingConfirmation` are globals → impossible to unit test or mock. |
| 4 | **Fail-Fast Validation** | Only the date is checked; missing `userId` / `userEmail` / invalid date types pass through silently. |
| 5 | **Meaningful Names** | Parameter `data` is a generic catch-all; `createBooking` implies only creation, yet it also persists and notifies. |
| 6 | **No Side Effects in Business Logic** | `console.log` is embedded directly in the service. |
| 7 | **Typed Errors** | Generic `Error` makes it hard for callers to handle validation errors distinctly. |
| 8 | **Open/Closed Principle** | Pricing logic is hardcoded; adding a tier (e.g., VIP) requires editing the service. |

### Steps Taken

1. **Extracted constants** (`PRICING`, `ERROR_MESSAGES`) — dead center for magic numbers/strings, frozen to prevent mutation.
2. **Created a typed domain error** (`BookingValidationError`) — callers can now catch validation failures specifically.
3. **Promoted `Booking` to a first-class domain entity** — encapsulates its own creation.
4. **Isolated validation into `BookingValidator`** — fail-fast checks for `userId`, `userEmail`, date type, *and* future-date, each with a descriptive message.
5. **Extracted `PricingStrategy`** — extensible pricing without touching the service (Open/Closed).
6. **Introduced `BookingRepository`** — persistence abstraction over `database` (Dependency Inversion).
7. **Introduced `NotificationService`** — email delivery injected as a function, mockable in tests.
8. **Refactored `BookingService` to orchestration-only** — injects repository + notification + logger, delegates each concern, and contains no side effects of its own.
9. **Documented a composition-root example** — shows how to wire everything together.
10. **Verified the behavior** with a runnable test:
    - ✅ Premium booking persisted with price `80`, email sent, structured log emitted.
    - ✅ Past date raises `BookingValidationError: Booking date must be in the future`.

### Key Benefits of the Optimized Version

- **Testable** — every dependency is injectable (mock DB, fake email sender, spy logger).
- **Extensible** — new pricing tiers or validations require no changes to `BookingService`.
- **Self-documenting** — named constants, typed errors, and single-purpose classes make intent explicit.
- **Fail-fast** — invalid input is rejected at the boundary before any side effects occur.