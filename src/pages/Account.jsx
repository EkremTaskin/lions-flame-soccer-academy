import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth, db } from '../firebase';
import { updatePassword, signOut } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Navbar from '../components/Navbar';
import { toast } from 'sonner';
import Loader from '../components/Loader';
import '../components/Loader.css';
import './Account.css';
import { BOOKING_STATUSES, getBookingStatusLabel } from '../../shared/bookingConfig';

const Account = () => {
    const { currentUser, userRole } = useAuth();
    const navigate = useNavigate();
    
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const [bookings, setBookings] = useState([]);
    const [loadingBookings, setLoadingBookings] = useState(true);

    const confirmedBookings = bookings.filter((booking) => (
        booking.status === BOOKING_STATUSES.confirmed || booking.status === BOOKING_STATUSES.paid
    )).length;
    const pendingBookings = bookings.filter((booking) => (
        booking.status === BOOKING_STATUSES.pending || booking.status === BOOKING_STATUSES.paymentSubmitted
    )).length;

    useEffect(() => {
        let active = true;
        const fetchBookings = async () => {
            if (!currentUser?.uid) return;
            setLoadingBookings(true);
            try {
                const q = query(
                    collection(db, 'bookings'), 
                    where('userId', '==', currentUser.uid)
                );
                const querySnapshot = await getDocs(q);
                const userBookings = [];
                querySnapshot.forEach((doc) => {
                    userBookings.push({ id: doc.id, ...doc.data() });
                });
                
                // Sort bookings by creation date locally, assuming createdAt exists
                userBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                
                if (active) setBookings(userBookings);
            } catch (err) {
                console.error("Error fetching bookings: ", err);
                toast.error("Error loading past bookings.");
            } finally {
                if (active) setLoadingBookings(false);
            }
        };

        fetchBookings();
        return () => { active = false; };
    }, [currentUser]);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match!');
            return setError('Passwords do not match');
        }

        setLoading(true);
        try {
            await updatePassword(currentUser, newPassword);
            toast.success('Password updated successfully!');
            setMessage('Password updated successfully');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            console.error(err);
            toast.error('Failed to update password. Please log in again.');
            setError('Failed to update password. You may need to log in again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success('Successfully logged out.');
            navigate('/');
        } catch (err) {
            console.error('Failed to log out', err);
            toast.error('Failed to log out.');
        }
    };

    return (
        <>
            <Navbar />
            <div className="account-page">
                <div className="container account-container">
                    <section className="account-hero">
                        <div>
                            <span className="account-kicker">Family Dashboard</span>
                            <h1>My Account</h1>
                            <p>Track booking requests, payment updates, and account security in one place.</p>
                        </div>
                        <button onClick={handleLogout} className="account-logout">
                            Log Out
                        </button>
                    </section>

                    <section className="account-summary-grid">
                        <article className="summary-card profile-summary">
                            <span className="summary-label">Signed in as</span>
                            <strong>{currentUser?.email}</strong>
                            <span className={`role-badge ${userRole || 'user'}`}>{userRole || 'User'}</span>
                        </article>
                        <article className="summary-card">
                            <span className="summary-label">Total Bookings</span>
                            <strong>{bookings.length}</strong>
                        </article>
                        <article className="summary-card">
                            <span className="summary-label">Confirmed</span>
                            <strong>{confirmedBookings}</strong>
                        </article>
                        <article className="summary-card">
                            <span className="summary-label">Needs Review</span>
                            <strong>{pendingBookings}</strong>
                        </article>
                    </section>

                    <div className="account-layout">
                        <section className="account-panel bookings-section">
                            <div className="panel-header">
                                <div>
                                    <span className="panel-eyebrow">Training</span>
                                    <h2>My Bookings</h2>
                                </div>
                                <button onClick={() => navigate('/book')} className="panel-action">
                                    New Booking
                                </button>
                            </div>
                            {loadingBookings ? (
                                <div className="account-loading">
                                    <Loader size="small" />
                                </div>
                            ) : bookings.length > 0 ? (
                                <div className="booking-list">
                                    {bookings.map(book => (
                                        <article className="booking-item" key={book.id}>
                                            <div className="booking-main">
                                                <span className={`booking-status status-${book.status || BOOKING_STATUSES.pending}`}>
                                                    {getBookingStatusLabel(book.status)}
                                                </span>
                                                <h3>{book.program}</h3>
                                                <p>{book.customerDetails?.playerName || 'Player details pending'}</p>
                                            </div>
                                            <dl className="booking-meta">
                                                <div>
                                                    <dt>Date</dt>
                                                    <dd>{book.date}</dd>
                                                </div>
                                                <div>
                                                    <dt>Time</dt>
                                                    <dd>{book.time}</dd>
                                                </div>
                                                <div>
                                                    <dt>Duration</dt>
                                                    <dd>{book.duration} Min</dd>
                                                </div>
                                                <div>
                                                    <dt>Price</dt>
                                                    <dd>${book.amount ?? book.price}.00</dd>
                                                </div>
                                            </dl>
                                        </article>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-bookings">
                                    <h3>No bookings yet</h3>
                                    <p>Choose a program and secure your first training session.</p>
                                    <button onClick={() => navigate('/book')} className="panel-action">
                                        Book A Session
                                    </button>
                                </div>
                            )}
                        </section>
                        
                        <aside className="account-side">
                            <section className="account-panel account-security">
                                <div className="panel-header compact">
                                    <div>
                                        <span className="panel-eyebrow">Security</span>
                                        <h2>Password</h2>
                                    </div>
                                </div>
                                <p className="security-copy">
                                    Update your password regularly to keep booking and payment details protected.
                                </p>
                                <form onSubmit={handlePasswordChange} className="password-form">
                                {error && <div className="alert alert-danger">{error}</div>}
                                {message && <div className="alert alert-success">{message}</div>}
                                
                                <div className="form-group">
                                    <label htmlFor="new-password">New Password</label>
                                    <input 
                                        id="new-password"
                                        type="password" 
                                        className="form-input" 
                                        placeholder="Minimum 6 characters"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        minLength="6"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="confirm-password">Confirm New Password</label>
                                    <input 
                                        id="confirm-password"
                                        type="password" 
                                        className="form-input" 
                                        placeholder="Repeat new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        minLength="6"
                                    />
                                </div>
                                <button type="submit" className="security-submit" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <div className="spinner account-spinner"></div>
                                            <span>Updating...</span>
                                        </>
                                    ) : 'Update Password'}
                                </button>
                            </form>
                            </section>
                        </aside>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Account;
