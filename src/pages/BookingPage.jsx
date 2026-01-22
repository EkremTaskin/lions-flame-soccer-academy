import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './BookingPage.css';

const BookingPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialProgram = queryParams.get('program') || '';

    const [selectedProgram, setSelectedProgram] = useState(initialProgram);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [step, setStep] = useState(selectedProgram ? 1 : 0); // 0: Select Program, 1: Schedule, 2: Payment, 3: Success

    const programs = ["One-on-One", "Small Group", "Large Group"];

    const handleDateChange = (e) => {
        const date = e.target.value;
        setSelectedDate(date);
        generateSlots(date);
        setSelectedTime('');
    };

    const handlePaymentSubmit = (e) => {
        e.preventDefault();
        setTimeout(() => {
            setStep(3);
        }, 1000);
    };

    const generateSlots = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDay();
        const isWeekend = day === 0 || day === 6;

        let startTime = isWeekend ? 9 : 17;
        let endTime = 21;

        const slots = [];
        for (let hour = startTime; hour < endTime; hour++) {
            slots.push(formatTime(hour, 0));
            slots.push(formatTime(hour, 30));
        }
        setAvailableSlots(slots);
    };

    const formatTime = (hour, minutes) => {
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        const minStr = minutes === 0 ? '00' : minutes;
        return `${hour12}:${minStr} ${ampm}`;
    };

    return (
        <>
            <Navbar />
            <div className="booking-page">
                <div className="container booking-container">
                    {step === 3 ? (
                        <div className="booking-success text-center reveal">
                            <div className="success-icon">🎉</div>
                            <h1 className="text-primary">Booking Confirmed!</h1>
                            <p>You have successfully registered for the <strong>{selectedProgram}</strong> session.</p>
                            <div className="confirmation-details">
                                <p><strong>Program:</strong> {selectedProgram}</p>
                                <p><strong>Date:</strong> {selectedDate}</p>
                                <p><strong>Time:</strong> {selectedTime}</p>
                            </div>
                            <Link to="/" className="btn-primary mt-4 inline-block">Return Home</Link>
                        </div>
                    ) : (
                        <>
                            <div className="booking-header reveal">
                                <h1 className="text-secondary">Join The Pride</h1>
                                <p>Secure your spot in our elite training sessions.</p>
                            </div>

                            <div className="booking-grid">
                                {/* STEP 0: Select Program if not provided */}
                                {step === 0 && (
                                    <div className="booking-step active reveal">
                                        <div className="step-header">
                                            <span className="step-num">!</span>
                                            <h2>Choose Your Program</h2>
                                        </div>
                                        <div className="program-select-grid">
                                            {programs.map(p => (
                                                <button
                                                    key={p}
                                                    className={`program-select-btn ${selectedProgram === p ? 'selected' : ''}`}
                                                    onClick={() => {
                                                        setSelectedProgram(p);
                                                        setStep(1);
                                                    }}
                                                >
                                                    {p}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Step 1: Schedule */}
                                <div className={`booking-step ${step === 1 ? 'active' : step < 1 ? 'disabled' : ''} reveal`}>
                                    <div className="step-header">
                                        <span className="step-num">1</span>
                                        <h2>Select Date & Time</h2>
                                    </div>

                                    {selectedProgram && (
                                        <div className="selected-tag">
                                            Currently Selecting: <strong>{selectedProgram}</strong>
                                            <button onClick={() => setStep(0)} className="change-btn">Change</button>
                                        </div>
                                    )}

                                    <div className="form-group">
                                        <label>Date</label>
                                        <input
                                            type="date"
                                            className="date-input"
                                            onChange={handleDateChange}
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>

                                    {selectedDate && (
                                        <div className="slots-container">
                                            <label>Available Slots</label>
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
                                        </div>
                                    )}

                                    {selectedTime && step === 1 && (
                                        <button className="btn-primary full-width mt-4" onClick={() => setStep(2)}>
                                            Continue to Payment
                                        </button>
                                    )}
                                </div>

                                {/* Step 2: Payment */}
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
                                                    <span>Session</span>
                                                    <span>{selectedDate} at {selectedTime}</span>
                                                </div>
                                                <div className="summary-row total">
                                                    <span>Total</span>
                                                    <span>$50.00</span>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label>Cardholder Name</label>
                                                <input type="text" placeholder="Full Name" required />
                                            </div>

                                            <div className="form-group">
                                                <label>Card Number</label>
                                                <input type="text" placeholder="0000 0000 0000 0000" required />
                                            </div>

                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Expiry</label>
                                                    <input type="text" placeholder="MM/YY" required />
                                                </div>
                                                <div className="form-group">
                                                    <label>CVC</label>
                                                    <input type="text" placeholder="123" required />
                                                </div>
                                            </div>

                                            <button type="submit" className="btn-primary full-width success-btn">
                                                Confirm & Pay $50.00
                                            </button>
                                            <button type="button" className="btn-text" onClick={() => setStep(1)}>Back to Schedule</button>
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
