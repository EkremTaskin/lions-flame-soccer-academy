import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { db } from '../firebase';
import { collection, query, getDocs } from 'firebase/firestore';
import Loader from '../components/Loader';
import { toast } from 'sonner';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [allBookings, setAllBookings] = useState([]);
    const [loadingBookings, setLoadingBookings] = useState(true);

    useEffect(() => {
        let active = true;
        const fetchAllBookings = async () => {
            try {
                setLoadingBookings(true);
                const q = query(collection(db, 'bookings'));
                const snap = await getDocs(q);
                const globalBookings = [];
                snap.forEach(doc => {
                    globalBookings.push({ id: doc.id, ...doc.data() });
                });
                
                // Sort by creation date
                globalBookings.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
                
                if (active) setAllBookings(globalBookings);
            } catch(error) {
                console.error('Error fetching all bookings', error);
                toast.error('Error fetching bookings.');
            } finally {
                if (active) setLoadingBookings(false);
            }
        };
        fetchAllBookings();
        return () => { active = false; };
    }, []);

    // Calculate sum of total revenue
    const totalRevenue = allBookings.reduce((sum, booking) => sum + (Number(booking.price) || 0), 0);

    return (
        <>
            <Navbar />
            <div className="admin-dashboard-page">
                <div className="container" style={{ maxWidth: '1200px' }}>
                    
                    <div className="alert alert-success mb-4" style={{ backgroundColor: '#e8f5e9', padding: '1.5rem', borderRadius: '12px', border: '1px solid #c8e6c9', color: '#2e7d32' }}>
                        <h4 style={{margin: '0 0 0.5rem 0'}}>Admin Access Verified! ✅</h4>
                        <p style={{margin: '0'}}>You can monitor all bookings and system activities from here.</p>
                    </div>

                    <div className="admin-card">
                        <div className="admin-header">
                            <h2>Academy Control Panel</h2>
                            <div className="admin-stats">
                                <div className="stat-box">
                                    <h3>{allBookings.length}</h3>
                                    <p>Total Bookings</p>
                                </div>
                                <div className="stat-box success">
                                    <h3>${totalRevenue}</h3>
                                    <p>Total Revenue</p>
                                </div>
                            </div>
                        </div>

                        <div className="bookings-section mt-3">
                            <h4 style={{marginBottom: '1rem', color: 'var(--secondary)'}}>All Bookings (System Wide)</h4>
                            
                            {loadingBookings ? (
                                <div className="text-center p-5">
                                    <Loader size="default" />
                                    <p style={{marginTop: '1rem', color: '#666'}}>Fetching data...</p>
                                </div>
                            ) : allBookings.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Customer Email</th>
                                                <th>Program</th>
                                                <th>Date</th>
                                                <th>Time</th>
                                                <th>Duration</th>
                                                <th>Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allBookings.map(book => (
                                                <tr key={book.id}>
                                                    <td>
                                                        <span className="badge-email">
                                                            {book.userEmail || "Anonymous (No Info)"}
                                                        </span>
                                                    </td>
                                                    <td><strong>{book.program}</strong></td>
                                                    <td>{book.date}</td>
                                                    <td>{book.time}</td>
                                                    <td>{book.duration} Min</td>
                                                    <td><strong style={{color: '#2e7d32'}}>${book.price}.00</strong></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="alert" style={{background: '#f8f9fa', color: '#666', border: '1px solid #ddd'}}>
                                    No booking records found in the system yet.
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default AdminDashboard;
