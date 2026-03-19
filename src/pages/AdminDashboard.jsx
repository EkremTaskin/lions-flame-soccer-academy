import React from 'react';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
    return (
        <>
            <Navbar />
            <div className="container" style={{paddingTop: '8rem', minHeight: '80vh'}}>
                <h2>Admin Dashboard</h2>
                <div className="alert alert-success mt-4" style={{
                    backgroundColor: '#e8f5e9', 
                    padding: '1.5rem', 
                    borderRadius: '8px', 
                    border: '1px solid #c8e6c9',
                    color: '#2e7d32'
                }}>
                    <h4>Welcome, Admin!</h4>
                    <p>You have successfully authenticated as an admin. This route is fully protected.</p>
                </div>
                <div style={{marginTop: '2rem'}}>
                    <p>Future Features Here:</p>
                    <ul>
                        <li>View all received Contact form submissions</li>
                        <li>Manage User Bookings</li>
                        <li>Update user roles</li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;
