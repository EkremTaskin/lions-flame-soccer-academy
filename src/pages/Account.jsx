import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import { updatePassword, signOut } from 'firebase/auth';
import Navbar from '../components/Navbar';
import './Account.css';

const Account = () => {
    const { currentUser, userRole } = useAuth();
    const navigate = useNavigate();
    
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (newPassword !== confirmPassword) {
            return setError('Passwords do not match');
        }

        setLoading(true);
        try {
            await updatePassword(currentUser, newPassword);
            setMessage('Password updated successfully');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            console.error(err);
            setError('Failed to update password. You may need to log in again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (err) {
            console.error('Failed to log out', err);
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
                                <button type="submit" className="btn-primary mt-2" disabled={loading}>
                                    {loading ? 'Updating...' : 'Update Password'}
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
