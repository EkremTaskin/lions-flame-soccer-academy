import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import {
  createCheckoutSession,
  fetchAvailableSlots,
  getCheckoutSessionStatus,
} from '../utils/bookingApi';
import { getBookingPrice, getProgramByName, PROGRAMS } from '../../shared/bookingConfig';
import './BookingPage.css';

const BookingPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialProgram = queryParams.get('program') || '';
  const checkoutStatus = queryParams.get('checkout');
  const checkoutSessionId = queryParams.get('session_id');
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
  const [isCheckingSession, setIsCheckingSession] = useState(false);
  const [step, setStep] = useState(selectedProgram ? 1 : 0);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

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

    if (checkoutStatus !== 'success' || !checkoutSessionId) {
      return;
    }

    let isMounted = true;

    const verifySession = async () => {
      setIsCheckingSession(true);

      try {
        const session = await getCheckoutSessionStatus(checkoutSessionId);

        if (!isMounted) {
          return;
        }

        if (session.paymentStatus === 'paid') {
          setConfirmedBooking(session.booking ?? null);
          setStep(3);
          toast.success('Payment completed and booking confirmed!');
          return;
        }

        toast.info('Payment is still processing. Please refresh in a moment.');
      } catch (error) {
        console.error('Error checking checkout session:', error);
        toast.error('We could not verify the payment yet.');
      } finally {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      }
    };

    verifySession();

    return () => {
      isMounted = false;
    };
  }, [checkoutStatus, checkoutSessionId]);

  const handleDateChange = async (event) => {
    const date = event.target.value;
    setSelectedDate(date);
    setSelectedTime('');
    setAvailableSlots([]);
  };

  const handlePaymentSubmit = async (event) => {
    event.preventDefault();
    setIsSubmittingBooking(true);

    try {
      const session = await createCheckoutSession({
        program: selectedProgram,
        duration: selectedDuration,
        date: selectedDate,
        time: selectedTime,
        origin: window.location.origin,
        basePath: import.meta.env.BASE_URL,
      });

      window.location.assign(session.url);
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
          {isCheckingSession ? (
            <div className="text-center p-5">
              <Loader size="default" />
              <p style={{ marginTop: '1rem' }}>Checking your payment confirmation...</p>
            </div>
          ) : step === 3 ? (
            <div className="booking-success text-center">
              <div className="success-icon">*</div>
              <h1 className="text-primary">Booking Confirmed!</h1>
              <p>
                You have successfully registered for the{' '}
                <strong>{confirmedBooking?.program ?? selectedProgram}</strong> session.
              </p>
              <div className="confirmation-details">
                <p>
                  <strong>Program:</strong> {confirmedBooking?.program ?? selectedProgram} (
                  {confirmedBooking?.duration ?? selectedDuration} Min)
                </p>
                <p>
                  <strong>Date:</strong> {confirmedBooking?.date ?? selectedDate}
                </p>
                <p>
                  <strong>Time:</strong> {confirmedBooking?.time ?? selectedTime}
                </p>
                <p>
                  <strong>Paid:</strong> ${confirmedBooking?.amount ?? totalPrice}.00
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
                        <div className="summary-row">
                          <span>Payment Method</span>
                          <span>Secure Stripe Checkout</span>
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
