
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const WorkerDashboard = () => {
  const { state } = useAuth();
  const { user } = state;
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Mock data for demonstration
        const mockBookings = [
          {
            _id: 'b1',
            hotelName: 'Grand Hotel',
            roomName: 'Deluxe Suite',
            checkIn: new Date().toISOString(),
            checkOut: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            guestName: 'John Smith',
            status: 'confirmed',
            totalPrice: 750,
          },
          {
            _id: 'b2',
            hotelName: 'Seaside Resort',
            roomName: 'Ocean View Room',
            checkIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            checkOut: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
            guestName: 'Emma Johnson',
            status: 'pending',
            totalPrice: 450,
          }
        ];
        
        const mockRooms = [
          {
            _id: 'r1',
            name: 'Deluxe Suite',
            hotelName: 'Grand Hotel',
            status: 'available',
            price: 250,
            capacity: 2,
          },
          {
            _id: 'r2',
            name: 'Ocean View Room',
            hotelName: 'Seaside Resort',
            status: 'booked',
            price: 150,
            capacity: 2,
          },
          {
            _id: 'r3',
            name: 'Presidential Suite',
            hotelName: 'Grand Hotel',
            status: 'maintenance',
            price: 500,
            capacity: 4,
          }
        ];

        setBookings(mockBookings);
        setRooms(mockRooms);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRoomStatusChange = (roomId, newStatus) => {
    setRooms(prevRooms => 
      prevRooms.map(room => 
        room._id === roomId ? { ...room, status: newStatus } : room
      )
    );
    toast.success(`Room status updated to ${newStatus}`);
  };

  const handleBookingStatusChange = (bookingId, newStatus) => {
    setBookings(prevBookings => 
      prevBookings.map(booking => 
        booking._id === bookingId ? { ...booking, status: newStatus } : booking
      )
    );
    toast.success(`Booking status updated to ${newStatus}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <Badge bg="success">Confirmed</Badge>;
      case 'pending':
        return <Badge bg="warning">Pending</Badge>;
      case 'cancelled':
        return <Badge bg="danger">Cancelled</Badge>;
      case 'available':
        return <Badge bg="success">Available</Badge>;
      case 'booked':
        return <Badge bg="danger">Booked</Badge>;
      case 'maintenance':
        return <Badge bg="warning">Maintenance</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  if (!user || !user.isWorker) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <Container className="flex-grow-1 py-5 mt-5 text-center">
          <h2>Access Denied</h2>
          <p>You need worker privileges to access this dashboard.</p>
          <Link to="/" className="btn btn-primary mt-3">
            Return to Home
          </Link>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      
      <Container className="flex-grow-1 py-5 mt-5">
        <Row className="mb-4">
          <Col>
            <h2 className="mb-3">Worker Dashboard</h2>
            <p className="text-muted">
              Welcome back, {user.username}. Manage hotel operations and bookings from here.
            </p>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <div className="d-flex mb-3">
              <Button 
                variant={activeTab === 'bookings' ? 'primary' : 'outline-primary'} 
                className="me-2"
                onClick={() => setActiveTab('bookings')}
              >
                Bookings
              </Button>
              <Button 
                variant={activeTab === 'rooms' ? 'primary' : 'outline-primary'} 
                onClick={() => setActiveTab('rooms')}
              >
                Rooms
              </Button>
            </div>
          </Col>
        </Row>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <>
            {activeTab === 'bookings' && (
              <Card className="shadow-sm">
                <Card.Header className="bg-white">
                  <h5 className="mb-0">Recent Bookings</h5>
                </Card.Header>
                <Card.Body className="p-0">
                  <div className="table-responsive">
                    <Table hover className="mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th>ID</th>
                          <th>Guest</th>
                          <th>Hotel & Room</th>
                          <th>Check-in</th>
                          <th>Check-out</th>
                          <th>Price</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.length > 0 ? (
                          bookings.map((booking) => (
                            <tr key={booking._id}>
                              <td>{booking._id}</td>
                              <td>{booking.guestName}</td>
                              <td>
                                {booking.hotelName}
                                <br />
                                <small className="text-muted">{booking.roomName}</small>
                              </td>
                              <td>{formatDate(booking.checkIn)}</td>
                              <td>{formatDate(booking.checkOut)}</td>
                              <td>${booking.totalPrice}</td>
                              <td>{getStatusBadge(booking.status)}</td>
                              <td>
                                <div className="d-flex gap-2">
                                  {booking.status === 'pending' && (
                                    <>
                                      <Button 
                                        size="sm" 
                                        variant="success"
                                        onClick={() => handleBookingStatusChange(booking._id, 'confirmed')}
                                      >
                                        Confirm
                                      </Button>
                                      <Button 
                                        size="sm" 
                                        variant="danger"
                                        onClick={() => handleBookingStatusChange(booking._id, 'cancelled')}
                                      >
                                        Cancel
                                      </Button>
                                    </>
                                  )}
                                  {booking.status === 'confirmed' && (
                                    <Button 
                                      size="sm" 
                                      variant="danger"
                                      onClick={() => handleBookingStatusChange(booking._id, 'cancelled')}
                                    >
                                      Cancel
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="8" className="text-center py-4">
                              No bookings found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            )}

            {activeTab === 'rooms' && (
              <Card className="shadow-sm">
                <Card.Header className="bg-white">
                  <h5 className="mb-0">Room Management</h5>
                </Card.Header>
                <Card.Body className="p-0">
                  <div className="table-responsive">
                    <Table hover className="mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th>ID</th>
                          <th>Room</th>
                          <th>Hotel</th>
                          <th>Price/Night</th>
                          <th>Capacity</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rooms.length > 0 ? (
                          rooms.map((room) => (
                            <tr key={room._id}>
                              <td>{room._id}</td>
                              <td>{room.name}</td>
                              <td>{room.hotelName}</td>
                              <td>${room.price}</td>
                              <td>{room.capacity} guests</td>
                              <td>{getStatusBadge(room.status)}</td>
                              <td>
                                <div className="dropdown">
                                  <Button 
                                    variant="outline-secondary" 
                                    size="sm" 
                                    className="dropdown-toggle" 
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    Set Status
                                  </Button>
                                  <ul className="dropdown-menu">
                                    <li>
                                      <Button 
                                        variant="link" 
                                        className="dropdown-item"
                                        onClick={() => handleRoomStatusChange(room._id, 'available')}
                                      >
                                        Available
                                      </Button>
                                    </li>
                                    <li>
                                      <Button 
                                        variant="link" 
                                        className="dropdown-item"
                                        onClick={() => handleRoomStatusChange(room._id, 'booked')}
                                      >
                                        Booked
                                      </Button>
                                    </li>
                                    <li>
                                      <Button 
                                        variant="link" 
                                        className="dropdown-item"
                                        onClick={() => handleRoomStatusChange(room._id, 'maintenance')}
                                      >
                                        Maintenance
                                      </Button>
                                    </li>
                                  </ul>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7" className="text-center py-4">
                              No rooms found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            )}
          </>
        )}
      </Container>
      
      <Footer />
    </div>
  );
};

export default WorkerDashboard;
