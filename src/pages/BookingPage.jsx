/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import {
  createPaymentLinkBooking,
  fetchAvailableSlots,
} from '../utils/bookingApi';
import { BOOKING_STATUSES, getBookingPrice, getProgramByName, PROGRAMS } from '../../shared/bookingConfig';
import './BookingPage.css';

const BookingPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialProgram = queryParams.get('program') || '';
  const checkoutStatus = queryParams.get('checkout');
  const initialDate = queryParams.get('date') || '';
  const initialTime = queryParams.get('time') || '';
  const initialDuration = queryParams.get('duration') || '45';

  const { currentUser } = useAuth();

  const [selectedProgram, setSelectedProgram] = useState(initialProgram);
  const [selectedDuration, setSelectedDuration] = useState(initialDuration);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedTime, setSelectedTime] = useState(initialTime);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [step, setStep] = useState(selectedProgram ? 1 : 0);
  const [customerDetails, setCustomerDetails] = useState({
    playerName: '',
    playerAge: '',
    parentName: '',
    parentPhone: '',
    notes: '',
  });

  const currentProgramData = getProgramByName(selectedProgram);
  const totalPrice = currentProgramData ? getBookingPrice(selectedProgram, selectedDuration) : 0;

  useEffect(() => {
    if (!selectedDate) {
      setAvailableSlots([]);
      return;
    }

    let isMounted = true;

    const run = async () => {
      setIsLoadingSlots(true);

      try {
        const slots = await fetchAvailableSlots(selectedDate, selectedDuration);

        if (!isMounted) {
          return;
        }

        setAvailableSlots(slots);
        if (slots.length === 0) {
          toast.info('No available slots found for the selected date.');
        }
      } catch (error) {
        console.error('Error fetching slots:', error);
        if (isMounted) {
          toast.error('An error occurred while loading slots.');
        }
      } finally {
        if (isMounted) {
          setIsLoadingSlots(false);
        }
      }
    };

    run();

    return () => {
      isMounted = false;
    };
  }, [selectedDate, selectedDuration]);

  useEffect(() => {
    if (checkoutStatus === 'cancel') {
      toast.info('Checkout cancelled. Your slot was not confirmed.');
      setStep(2);
      return;
    }

    if (checkoutStatus !== 'success') {
      return;
    }

    const bookingId = window.localStorage.getItem('pendingPaymentLinkBookingId');
    const storedBooking = window.localStorage.getItem('pendingPaymentLinkBooking');
    if (storedBooking) {
      try {
        const booking = JSON.parse(storedBooking);
        setSelectedProgram(booking.program || '');
        setSelectedDuration(booking.duration || '45');
        setSelectedDate(booking.date || '');
        setSelectedTime(booking.time || '');
      } catch (error) {
        console.error('Could not restore checkout booking details:', error);
      }
    }

    if (bookingId && db) {
      updateDoc(doc(db, 'bookings', bookingId), {
        status: BOOKING_STATUSES.paymentSubmitted,
        paymentStatus: 'submitted',
        paymentSubmittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }).catch((error) => {
        console.error('Could not update booking status after payment redirect:', error);
      });
      window.localStorage.removeItem('pendingPaymentLinkBookingId');
      window.localStorage.removeItem('pendingPaymentLinkBooking');
    }

    setStep(3);
    toast.success('Payment submitted. We will confirm your booking after review.');
  }, [checkoutStatus]);

  const handleDateChange = async (event) => {
    const date = event.target.value;
    setSelectedDate(date);
    setSelectedTime('');
    setAvailableSlots([]);
  };

  const handleCustomerDetailsChange = (event) => {
    const { name, value } = event.target;
    setCustomerDetails((currentDetails) => ({
      ...currentDetails,
      [name]: value,
    }));
  };

  const handlePaymentSubmit = async (event) => {
    event.preventDefault();
    setIsSubmittingBooking(true);

    try {
      const paymentLinkBooking = await createPaymentLinkBooking({
        program: selectedProgram,
        duration: selectedDuration,
        date: selectedDate,
        time: selectedTime,
        user: currentUser,
        customerDetails,
      });

      window.localStorage.setItem('pendingPaymentLinkBookingId', paymentLinkBooking.bookingId);
      window.localStorage.setItem(
        'pendingPaymentLinkBooking',
        JSON.stringify({
          program: paymentLinkBooking.program,
          duration: paymentLinkBooking.duration,
          date: selectedDate,
          time: selectedTime,
        }),
      );
      window.location.assign(paymentLinkBooking.url);
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.message || 'Checkout could not be started. Please try again.');
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="booking-page">
        <div className="container booking-container">
          {step === 3 ? (
            <div className="booking-success text-center">
              <div className="success-icon">*</div>
              <h1 className="text-primary">Payment Submitted!</h1>
              <p>
                We received your payment flow for the{' '}
                <strong>{selectedProgram}</strong> session.
              </p>
              <div className="confirmation-details">
                <p>
                  <strong>Program:</strong> {selectedProgram} ({selectedDuration} Min)
                </p>
                <p>
                  <strong>Date:</strong> {selectedDate}
                </p>
                <p>
                  <strong>Time:</strong> {selectedTime}
                </p>
                <p>
                  <strong>Paid:</strong> ${totalPrice}.00
                </p>
              </div>
              <Link to="/" className="btn-primary mt-4 inline-block">
                Return Home
              </Link>
            </div>
          ) : (
            <>
              <div className="booking-header">
                <h1 className="text-secondary">Join The Pride</h1>
                <p>Secure your spot in our elite training sessions.</p>
              </div>

              <div className="booking-grid">
                {step === 0 && (
                  <div className="booking-step active">
                    <div className="step-header">
                      <span className="step-num">!</span>
                      <h2>Choose Your Program</h2>
                    </div>
                    <div className="program-select-grid">
                      {PROGRAMS.map((program) => (
                        <button
                          key={program.name}
                          className={`program-select-btn ${selectedProgram === program.name ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedProgram(program.name);
                            setStep(1);
                          }}
                        >
                          {program.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className={`booking-step ${step === 1 ? 'active' : step < 1 ? 'disabled' : ''} reveal`}>
                  <div className="step-header">
                    <span className="step-num">1</span>
                    <h2>Select Duration & Time</h2>
                  </div>

                  {selectedProgram && (
                    <div className="selected-tag">
                      Currently Selecting: <strong>{selectedProgram}</strong>
                      <button onClick={() => setStep(0)} className="change-btn">
                        Change
                      </button>
                    </div>
                  )}

                  <div className="form-group">
                    <label>Session Duration</label>
                    <div className="duration-select">
                      <button
                        className={`duration-btn ${selectedDuration === '45' ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedDuration('45');
                          setSelectedTime('');
                        }}
                      >
                        45 Minutes (${currentProgramData?.prices[45]})
                      </button>
                      <button
                        className={`duration-btn ${selectedDuration === '90' ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedDuration('90');
                          setSelectedTime('');
                        }}
                      >
                        90 Minutes (${currentProgramData?.prices[90]})
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Date</label>
                    <input
                      type="date"
                      className="date-input"
                      value={selectedDate}
                      onChange={handleDateChange}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  {selectedDate && (
                    <div className="slots-container">
                      <label>Available Slots</label>
                      {isLoadingSlots ? (
                        <div className="text-center p-4">
                          <Loader size="small" />
                        </div>
                      ) : availableSlots.length > 0 ? (
                        <div className="slots-grid">
                          {availableSlots.map((slot) => (
                            <button
                              key={slot}
                              className={`slot-btn ${selectedTime === slot ? 'selected' : ''}`}
                              onClick={() => setSelectedTime(slot)}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center p-4" style={{ marginTop: '1rem', color: '#888' }}>
                          No slots available for this date.
                        </div>
                      )}
                    </div>
                  )}

                  {selectedTime && step === 1 && (
                    <button className="btn-primary full-width mt-4" onClick={() => setStep(2)}>
                      Continue to Payment
                    </button>
                  )}
                </div>

                <div className={`booking-step ${step === 2 ? 'active' : 'disabled'} reveal`}>
                  <div className="step-header">
                    <span className="step-num">2</span>
                    <h2>Checkout</h2>
                  </div>

                  {step === 2 && (
                    <form className="payment-form" onSubmit={handlePaymentSubmit}>
                      <div className="summary-card">
                        <h3>Summary</h3>
                        <div className="summary-row">
                          <span>Program</span>
                          <strong>{selectedProgram}</strong>
                        </div>
                        <div className="summary-row">
                          <span>Duration</span>
                          <span>{selectedDuration} Minutes</span>
                        </div>
                        <div className="summary-row">
                          <span>Session</span>
                          <span>
                            {selectedDate} at {selectedTime}
                          </span>
                        </div>
                        <div className="summary-row total">
                          <span>Total</span>
                          <span>${totalPrice}.00</span>
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Account</label>
                        <input type="email" value={currentUser?.email || ''} readOnly />
                      </div>

                      <div className="summary-card">
                        <h3>Player Details</h3>
                        <div className="form-group">
                          <label>Player Name</label>
                          <input
                            type="text"
                            name="playerName"
                            value={customerDetails.playerName}
                            onChange={handleCustomerDetailsChange}
                            required
                          />
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label>Player Age</label>
                            <input
                              type="number"
                              name="playerAge"
                              value={customerDetails.playerAge}
                              onChange={handleCustomerDetailsChange}
                              min="3"
                              max="18"
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label>Parent Name</label>
                            <input
                              type="text"
                              name="parentName"
                              value={customerDetails.parentName}
                              onChange={handleCustomerDetailsChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label>Parent Phone</label>
                          <input
                            type="tel"
                            name="parentPhone"
                            value={customerDetails.parentPhone}
                            onChange={handleCustomerDetailsChange}
                            required
                          />
                        </div>
                        <div className="form-group compact">
                          <label>Notes</label>
                          <textarea
                            name="notes"
                            value={customerDetails.notes}
                            onChange={handleCustomerDetailsChange}
                            placeholder="Optional"
                            rows="3"
                          />
                        </div>
                      </div>

                      <div className="summary-card">
                        <div className="summary-row">
                          <span>Payment Method</span>
                          <span>Stripe Payment Link</span>
                        </div>
                        <div className="summary-row">
                          <span>Reservation Hold</span>
                          <span>15 minutes</span>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="btn-primary full-width success-btn"
                        disabled={isSubmittingBooking}
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                      >
                        {isSubmittingBooking ? (
                          <>
                            <div
                              className="spinner"
                              style={{
                                width: '20px',
                                height: '20px',
                                borderWidth: '2px',
                                borderColor: 'rgba(255,255,255,0.3)',
                                borderTopColor: '#fff',
                              }}
                            />
                            <span>Redirecting...</span>
                          </>
                        ) : (
                          `Continue to Secure Checkout - $${totalPrice}.00`
                        )}
                      </button>
                      <button type="button" className="btn-text" onClick={() => setStep(1)}>
                        Back to Schedule
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default BookingPage;
