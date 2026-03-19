import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Navbar from '../components/Navbar';
import './Login.css';

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
                navigate('/');
            }
        } catch (err) {
            console.error(err);
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
                    <div className="login-card">
                        <h2 className="text-center">{isLogin ? 'Welcome Back' : 'Join The Pride'}</h2>
                        <p className="text-center mb-4">
                            {isLogin ? 'Login to manage your bookings.' : 'Create an account to get started.'}
                        </p>
                        
                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="form-group">
                                <label>Email Address</label>
                                <input 
                                    type="email" 
                                    className="form-input" 
                                    value={email} 
                                    onChange={e => setEmail(e.target.value)} 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input 
                                    type="password" 
                                    className="form-input" 
                                    value={password} 
                                    onChange={e => setPassword(e.target.value)} 
                                    required 
                                />
                            </div>
                            
                            {error && <div className="form-error text-center p-2 mb-3 rounded" style={{color:'red'}}>{error}</div>}
                            
                            <button type="submit" className="btn-primary full-width" disabled={loading}>
                                {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
                            </button>
                        </form>
                        
                        <div className="text-center mt-4 pt-3 border-top">
                            <p className="mb-0">
                                {isLogin ? "Don't have an account? " : "Already have an account? "}
                                <button type="button" className="btn-text p-0" onClick={() => setIsLogin(!isLogin)}>
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
