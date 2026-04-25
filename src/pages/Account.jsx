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
                    <div className="account-card">
                        <h2 className="text-secondary mb-4">My Account</h2>
                        
                        <div className="account-info mb-5">
                            <h4>Profile Details</h4>
                            <p><strong>Email:</strong> {currentUser?.email}</p>
                            <p><strong>Role:</strong> <span className={`role-badge ${userRole || 'user'}`}>{userRole || 'User'}</span></p>
                        </div>
                        
                        <div className="bookings-section mb-5">
                            <h4>My Past Bookings</h4>
                            {loadingBookings ? (
                                <div className="text-center p-4">
                                    <Loader size="small" />
                                </div>
                            ) : bookings.length > 0 ? (
                                <div className="bookings-table-wrapper">
                                    <table className="bookings-table">
                                        <thead>
                                            <tr>
                                                <th>Program</th>
                                                <th>Player</th>
                                                <th>Date</th>
                                                <th>Time</th>
                                                <th>Duration</th>
                                                <th>Status</th>
                                                <th>Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bookings.map(book => (
                                                <tr key={book.id}>
                                                    <td><strong>{book.program}</strong></td>
                                                    <td>{book.customerDetails?.playerName || '-'}</td>
                                                    <td>{book.date}</td>
                                                    <td>{book.time}</td>
                                                    <td>{book.duration} Min</td>
                                                    <td>
                                                        <span className={`booking-status status-${book.status || BOOKING_STATUSES.pending}`}>
                                                            {getBookingStatusLabel(book.status)}
                                                        </span>
                                                    </td>
                                                    <td>${book.amount ?? book.price}.00</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="alert alert-success" style={{background: '#f8f9fa', color: '#666', border: '1px solid #ddd'}}>
                                    You have no past bookings yet. Let's get on the pitch!
                                </div>
                            )}
                        </div>
                        
                        <div className="account-security mb-5">
                            <h4>Security</h4>
                            <form onSubmit={handlePasswordChange} className="password-form mt-3">
                                {error && <div className="alert alert-danger">{error}</div>}
                                {message && <div className="alert alert-success">{message}</div>}
                                
                                <div className="form-group">
                                    <label>New Password</label>
                                    <input 
                                        type="password" 
                                        className="form-input" 
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        minLength="6"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Confirm New Password</label>
                                    <input 
                                        type="password" 
                                        className="form-input" 
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        minLength="6"
                                    />
                                </div>
                                <button type="submit" className="btn-primary mt-2" disabled={loading} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                                    {loading ? (
                                        <>
                                            <div className="spinner" style={{width: '20px', height: '20px', borderWidth: '2px', borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff'}}></div>
                                            <span>Updating...</span>
                                        </>
                                    ) : 'Update Password'}
                                </button>
                            </form>
                        </div>

                        <div className="account-actions border-top pt-4">
                            <button onClick={handleLogout} className="btn-danger full-width">
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Account;
