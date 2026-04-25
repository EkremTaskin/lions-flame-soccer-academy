export const PROGRAMS = [
  { name: 'One-on-One', prices: { 45: 25, 90: 45 } },
  { name: 'Small Group', prices: { 45: 15, 90: 25 } },
  { name: 'Large Group', prices: { 45: 10, 90: 20 } },
];

export const ACTIVE_BOOKING_WINDOW_MINUTES = 15;

export const BOOKING_STATUSES = {
  pending: 'pending',
  paymentSubmitted: 'payment_submitted',
  confirmed: 'confirmed',
  paid: 'paid',
  cancelled: 'cancelled',
  expired: 'expired',
};

export const BOOKING_STATUS_LABELS = {
  [BOOKING_STATUSES.pending]: 'Pending Payment',
  [BOOKING_STATUSES.paymentSubmitted]: 'Payment Submitted',
  [BOOKING_STATUSES.confirmed]: 'Confirmed',
  [BOOKING_STATUSES.paid]: 'Confirmed',
  [BOOKING_STATUSES.cancelled]: 'Cancelled',
  [BOOKING_STATUSES.expired]: 'Cancelled',
};

export function getBookingStatusLabel(status) {
  return BOOKING_STATUS_LABELS[status] ?? 'Pending Payment';
}

export function getProgramByName(programName) {
  return PROGRAMS.find((program) => program.name === programName) ?? null;
}

export function getDurationMinutes(duration) {
  const parsedDuration = Number(duration);

  if (![45, 90].includes(parsedDuration)) {
    throw new Error('Unsupported duration selected.');
  }

  return parsedDuration;
}

export function getBookingPrice(programName, duration) {
  const program = getProgramByName(programName);
  const durationMinutes = getDurationMinutes(duration);

  if (!program) {
    throw new Error('Unsupported program selected.');
  }

  return program.prices[durationMinutes];
}

export function parseTimeLabel(timeLabel) {
  const match = /^(\d{1,2}):(\d{2})\s(AM|PM)$/.exec(timeLabel);

  if (!match) {
    throw new Error('Invalid time format.');
  }

  let hour = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3];

  if (hour === 12) {
    hour = 0;
  }

  if (meridiem === 'PM') {
    hour += 12;
  }

  return (hour * 60) + minutes;
}

export function formatTimeLabel(totalMinutes) {
  const normalizedMinutes = ((totalMinutes % 1440) + 1440) % 1440;
  let hour = Math.floor(normalizedMinutes / 60);
  const minutes = normalizedMinutes % 60;
  const meridiem = hour >= 12 ? 'PM' : 'AM';

  hour %= 12;
  if (hour === 0) {
    hour = 12;
  }

  return `${hour}:${String(minutes).padStart(2, '0')} ${meridiem}`;
}

export function getDailySlotBounds(dateStr) {
  const date = new Date(`${dateStr}T00:00:00`);
  const day = date.getDay();
  const isWeekend = day === 0 || day === 6;

  return {
    startHour: isWeekend ? 9 : 17,
    endHour: 21,
  };
}

export function generateDailySlots(dateStr) {
  const { startHour, endHour } = getDailySlotBounds(dateStr);
  const slots = [];

  for (let hour = startHour; hour < endHour; hour += 1) {
    slots.push(formatTimeLabel(hour * 60));
    slots.push(formatTimeLabel((hour * 60) + 30));
  }

  return slots;
}

export function bookingOverlaps(startA, endA, startB, endB) {
  return startA < endB && startB < endA;
}

export function isBookingBlocking(booking, nowIso = new Date().toISOString()) {
  if (!booking) {
    return false;
  }

  if (booking.status === BOOKING_STATUSES.paid || booking.status === BOOKING_STATUSES.confirmed) {
    return true;
  }

  if (booking.status !== BOOKING_STATUSES.pending) {
    return false;
  }

  return Boolean(booking.expiresAt && booking.expiresAt > nowIso);
}

export function getAvailableSlots(dateStr, duration, bookings = [], nowIso = new Date().toISOString()) {
  const durationMinutes = getDurationMinutes(duration);
  const { endHour } = getDailySlotBounds(dateStr);
  const allSlots = generateDailySlots(dateStr);
  const lastPossibleStart = (endHour * 60) - durationMinutes;

  return allSlots.filter((slot) => {
    const slotStart = parseTimeLabel(slot);
    const slotEnd = slotStart + durationMinutes;

    if (slotStart > lastPossibleStart) {
      return false;
    }

    return bookings
      .filter((booking) => booking?.date === dateStr)
      .filter((booking) => isBookingBlocking(booking, nowIso))
      .every((booking) => !bookingOverlaps(slotStart, slotEnd, booking.startMinutes, booking.endMinutes));
  });
}

export function buildBookingRecord({ program, duration, date, time, amount, userId, userEmail, status, expiresAt, stripeSessionId }) {
  const durationMinutes = getDurationMinutes(duration);
  const startMinutes = parseTimeLabel(time);

  return {
    program,
    duration: durationMinutes,
    date,
    time,
    amount,
    userId,
    userEmail,
    startMinutes,
    endMinutes: startMinutes + durationMinutes,
    status,
    paymentStatus: [BOOKING_STATUSES.paid, BOOKING_STATUSES.confirmed].includes(status) ? 'paid' : 'unpaid',
    expiresAt: expiresAt ?? null,
    stripeSessionId: stripeSessionId ?? null,
    createdAt: new Date().toISOString(),
  };
}
