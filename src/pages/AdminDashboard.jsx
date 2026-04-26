/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import { db } from '../firebase';
import { fetchAvailableSlots } from '../utils/bookingApi';
import { notifyBookingConfirmed } from '../utils/emailNotifications';
import { BOOKING_STATUSES, buildBookingRecord, getBookingStatusLabel } from '../../shared/bookingConfig';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [allBookings, setAllBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [blockingSlot, setBlockingSlot] = useState(false);
  const [blockDate, setBlockDate] = useState('');
  const [blockTime, setBlockTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const fetchAllBookings = async () => {
    try {
      setLoadingBookings(true);
      const bookingsQuery = query(collection(db, 'bookings'));
      const snapshot = await getDocs(bookingsQuery);
      const globalBookings = [];

      snapshot.forEach((docSnapshot) => {
        globalBookings.push({ id: docSnapshot.id, ...docSnapshot.data() });
      });

      globalBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setAllBookings(globalBookings);
    } catch (error) {
      console.error('Error fetching all bookings', error);
      toast.error('Error fetching bookings.');
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const handleDateChange = async (event) => {
    const date = event.target.value;
    setBlockDate(date);
    setBlockTime('');

    if (!date) {
      setAvailableSlots([]);
      return;
    }

    setLoadingSlots(true);
    try {
      const slots = await fetchAvailableSlots(date, 45);
      setAvailableSlots(slots);
    } catch (error) {
      console.error('Error fetching slots:', error);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleBlockSlot = async () => {
    if (!blockDate || !blockTime) {
      toast.error('Please select both date and time.');
      return;
    }

    setBlockingSlot(true);
    try {
      await addDoc(collection(db, 'bookings'), {
        ...buildBookingRecord({
          program: 'BLOCKED',
          duration: 45,
          date: blockDate,
          time: blockTime,
          amount: 0,
          status: BOOKING_STATUSES.paid,
          userId: 'admin',
          userEmail: 'ADMIN (BLOCKED)',
        }),
        isBlocked: true,
      });

      toast.success(`Slot ${blockTime} on ${blockDate} is now closed.`);
      setBlockTime('');
      fetchAllBookings();

      const slots = await fetchAvailableSlots(blockDate, 45);
      setAvailableSlots(slots);
    } catch (error) {
      console.error('Error blocking slot:', error);
      toast.error('Failed to block slot.');
    } finally {
      setBlockingSlot(false);
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Are you sure you want to delete/unblock this record?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'bookings', id));
      toast.success('Record deleted successfully.');
      fetchAllBookings();
    } catch (error) {
      console.error('Error deleting record:', error);
      toast.error('Failed to delete record.');
    }
  };

  const handleUpdateBookingStatus = async (booking, status) => {
    try {
      await updateDoc(doc(db, 'bookings', booking.id), {
        status,
        paymentStatus: status === BOOKING_STATUSES.confirmed ? 'paid' : status,
        updatedAt: new Date().toISOString(),
      });

      if (status === BOOKING_STATUSES.confirmed) {
        await notifyBookingConfirmed({
          ...booking,
          status,
          paymentStatus: 'paid',
        });
      }

      toast.success(`Booking marked as ${getBookingStatusLabel(status)}.`);
      fetchAllBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status.');
    }
  };

  const totalRevenue = allBookings.reduce(
    (sum, booking) => (
      [BOOKING_STATUSES.confirmed, BOOKING_STATUSES.paid].includes(booking.status)
        ? sum + (Number(booking.amount ?? booking.price) || 0)
        : sum
    ),
    0,
  );

  const filteredBookings = allBookings.filter((booking) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'blocked') return Boolean(booking.isBlocked);
    if (activeFilter === 'pending') {
      return !booking.isBlocked && [BOOKING_STATUSES.pending, BOOKING_STATUSES.paymentSubmitted].includes(booking.status);
    }
    if (activeFilter === 'confirmed') {
      return !booking.isBlocked && [BOOKING_STATUSES.confirmed, BOOKING_STATUSES.paid].includes(booking.status);
    }
    return true;
  });

  return (
    <>
      <Navbar />
      <div className="admin-dashboard-page">
        <div className="container" style={{ maxWidth: '1200px' }}>
          <div
            className="alert alert-success mb-4"
            style={{
              backgroundColor: '#e8f5e9',
              padding: '1.5rem',
              borderRadius: '12px',
              border: '1px solid #c8e6c9',
              color: '#2e7d32',
            }}
          >
            <h4 style={{ margin: '0 0 0.5rem 0' }}>Admin Access Verified!</h4>
            <p style={{ margin: '0' }}>You can monitor all bookings and manage availability from here.</p>
          </div>

          <div
            className="admin-grid"
            style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}
          >
            <div className="admin-card">
              <div className="admin-header">
                <h2>Academy Control Panel</h2>
                <div className="admin-stats">
                  <div className="stat-box">
                    <h3>{allBookings.filter((booking) => !booking.isBlocked).length}</h3>
                    <p>Total Bookings</p>
                  </div>
                  <div className="stat-box success">
                    <h3>${totalRevenue}</h3>
                    <p>Total Revenue</p>
                  </div>
                </div>
              </div>

              <div className="bookings-section mt-3">
                <h4 style={{ marginBottom: '1rem', color: 'var(--secondary)' }}>
                  All Records (Sorted by Newest)
                </h4>
                <div className="admin-filters" aria-label="Booking filters">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'pending', label: 'Pending' },
                    { id: 'confirmed', label: 'Confirmed' },
                    { id: 'blocked', label: 'Blocked Slots' },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      className={activeFilter === filter.id ? 'active' : ''}
                      onClick={() => setActiveFilter(filter.id)}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                {loadingBookings ? (
                  <div className="text-center p-5">
                    <Loader size="default" />
                    <p style={{ marginTop: '1rem', color: '#666' }}>Fetching data...</p>
                  </div>
                ) : filteredBookings.length > 0 ? (
                  <div className="table-responsive">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Customer / Role</th>
                          <th>Player</th>
                          <th>Program</th>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Status</th>
                          <th>Price</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBookings.map((booking) => (
                          <tr key={booking.id} className={booking.isBlocked ? 'blocked-row' : ''}>
                            <td>
                              <span className={`badge-email ${booking.isBlocked ? 'badge-blocked' : ''}`}>
                                {booking.userEmail || 'Anonymous (No Info)'}
                              </span>
                            </td>
                            <td>
                              {booking.customerDetails?.playerName ? (
                                <>
                                  <strong>{booking.customerDetails.playerName}</strong>
                                  <div style={{ fontSize: '12px', color: '#666' }}>
                                    Age {booking.customerDetails.playerAge || '-'} | {booking.customerDetails.parentPhone || 'No phone'}
                                  </div>
                                </>
                              ) : (
                                '-'
                              )}
                            </td>
                            <td>
                              <strong>{booking.program}</strong>
                            </td>
                            <td>{booking.date}</td>
                            <td>{booking.time}</td>
                            <td>
                              <span className={`booking-status status-${booking.status || BOOKING_STATUSES.pending}`}>
                                {booking.isBlocked ? 'Blocked' : getBookingStatusLabel(booking.status)}
                              </span>
                            </td>
                            <td>
                              <strong style={{ color: booking.isBlocked ? '#666' : '#2e7d32' }}>
                                ${booking.amount ?? booking.price}.00
                              </strong>
                            </td>
                            <td>
                              <div className="admin-actions">
                                {!booking.isBlocked && ![BOOKING_STATUSES.confirmed, BOOKING_STATUSES.paid].includes(booking.status) && (
                                  <button
                                    className="action-confirm"
                                    onClick={() => handleUpdateBookingStatus(booking, BOOKING_STATUSES.confirmed)}
                                  >
                                    Confirm
                                  </button>
                                )}
                                {!booking.isBlocked && booking.status !== BOOKING_STATUSES.cancelled && (
                                  <button
                                    className="action-cancel"
                                    onClick={() => handleUpdateBookingStatus(booking, BOOKING_STATUSES.cancelled)}
                                  >
                                    Cancel
                                  </button>
                                )}
                                <button className="action-delete" onClick={() => handleDeleteBooking(booking.id)}>
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="alert" style={{ background: '#f8f9fa', color: '#666', border: '1px solid #ddd' }}>
                    No records found in the system yet.
                  </div>
                )}
              </div>
            </div>

            <div className="admin-card">
              <h3>Manage Availability</h3>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '1.5rem' }}>
                Block specific time slots to make them unavailable for booking.
              </p>

              <div className="form-group mb-3">
                <label
                  style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}
                >
                  Select Date
                </label>
                <input
                  type="date"
                  value={blockDate}
                  onChange={handleDateChange}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="form-group mb-3">
                <label
                  style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}
                >
                  Select Time Slot
                </label>
                {loadingSlots ? (
                  <div className="text-center p-2">
                    <Loader size="small" />
                  </div>
                ) : availableSlots.length > 0 ? (
                  <select
                    value={blockTime}
                    onChange={(event) => setBlockTime(event.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                  >
                    <option value="">-- Choose a Slot --</option>
                    {availableSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                ) : blockDate ? (
                  <p style={{ fontSize: '12px', color: '#ff5252' }}>No free slots on this date.</p>
                ) : (
                  <p style={{ fontSize: '12px', color: '#888' }}>Please select a date first.</p>
                )}
              </div>

              <button
                onClick={handleBlockSlot}
                disabled={blockingSlot || !blockTime}
                className="btn-primary full-width mt-3"
                style={{ background: 'var(--secondary)', color: 'white' }}
              >
                {blockingSlot ? 'Blocking...' : 'Block Selected Slot'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
