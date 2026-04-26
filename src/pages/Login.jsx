import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Navbar from '../components/Navbar';
import { toast } from 'sonner';
import '../components/Loader.css';
import './Login.css';
import { notifyRegistration } from '../utils/emailNotifications';

const Login = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
                toast.success('Successfully logged in!');
                navigate('/');
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                // Create user document in Firestore with strict default 'user' role
                await setDoc(doc(db, 'users', user.uid), {
                    email: user.email,
                    role: 'user',
                    createdAt: new Date().toISOString()
                });
                await notifyRegistration({ email: user.email });
                toast.success('Account created successfully!');
                navigate('/');
            }
        } catch (err) {
            console.error(err);
            toast.error(err.message || 'Login failed.');
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="login-page">
                <div className="container login-container">
                    <div className="login-intro" aria-hidden="true">
                        <span className="login-kicker">Lion's Flame Academy</span>
                        <h1>{isLogin ? 'Welcome Back' : 'Create Your Account'}</h1>
                        <p>
                            Manage training bookings, payment updates, and session details from one secure place.
                        </p>
                        <div className="login-highlights">
                            <span>Secure access</span>
                            <span>Booking history</span>
                            <span>Parent-friendly updates</span>
                        </div>
                    </div>
                    <div className="login-card">
                        <div className="login-card-header">
                            <span className="login-card-eyebrow">{isLogin ? 'Account Login' : 'New Family Account'}</span>
                            <h2>{isLogin ? 'Welcome Back' : 'Join The Pride'}</h2>
                        </div>
                        <p className="login-card-copy">
                            {isLogin ? 'Login to manage your bookings.' : 'Create an account to get started.'}
                        </p>
                        
                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="form-group">
                                <label htmlFor="auth-email">Email Address</label>
                                <input 
                                    id="auth-email"
                                    type="email" 
                                    className="form-input" 
                                    placeholder="you@example.com"
                                    value={email} 
                                    onChange={e => setEmail(e.target.value)} 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="auth-password">Password</label>
                                <input 
                                    id="auth-password"
                                    type="password" 
                                    className="form-input" 
                                    placeholder="Enter your password"
                                    value={password} 
                                    onChange={e => setPassword(e.target.value)} 
                                    required 
                                />
                            </div>
                            
                            {error && <div className="form-error">{error}</div>}
                            
                            <button type="submit" className="login-submit" disabled={loading}>
                                {loading ? (
                                    <>
                                        <div className="spinner login-spinner"></div>
                                        <span>Processing...</span>
                                    </>
                                ) : (isLogin ? 'Log In' : 'Sign Up')}
                            </button>
                        </form>
                        
                        <div className="auth-switch">
                            <p>
                                {isLogin ? "Don't have an account? " : "Already have an account? "}
                                <button type="button" onClick={() => setIsLogin(!isLogin)}>
                                    {isLogin ? 'Sign up here' : 'Log in here'}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
