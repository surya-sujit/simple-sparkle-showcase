
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Spinner, Nav, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const UserDashboard = () => {
  const { state } = useAuth();
  const { user, isAuthenticated } = state;
  
  const [bookings, setBookings] = useState([]);
  const [favoriteHotels, setFavoriteHotels] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated) return;
      
      setLoading(true);
      try {
        // Mock data for demonstration
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock user profile
        setProfile({
          username: user.username || 'User',
          email: user.email || 'user@example.com',
          phone: '+1 (555) 123-4567',
          address: '123 Main St, Anytown, USA',
          memberSince: '2023-01-15',
          loyaltyPoints: 350,
          profileComplete: 85
        });
        
        // Mock bookings
        const mockBookings = [
          {
            _id: 'b1',
            hotelName: 'Grand Luxury Resort & Spa',
            roomName: 'Deluxe Ocean View',
            checkIn: '2023-12-10',
            checkOut: '2023-12-15',
            status: 'confirmed',
            totalPrice: 1495,
            hotelId: 'h1',
            roomId: 'r1'
          },
          {
            _id: 'b2',
            hotelName: 'City Central Hotel',
            roomName: 'Executive Suite',
            checkIn: '2024-01-20',
            checkOut: '2024-01-25',
            status: 'pending',
            totalPrice: 1200,
            hotelId: 'h2',
            roomId: 'r2'
          },
          {
            _id: 'b3',
            hotelName: 'Mountain View Lodge',
            roomName: 'Cabin Suite',
            checkIn: '2023-05-15',
            checkOut: '2023-05-20',
            status: 'completed',
            totalPrice: 950,
            hotelId: 'h3',
            roomId: 'r3'
          }
        ];
        
        // Mock favorite hotels
        const mockFavorites = [
          {
            _id: 'h1',
            name: 'Grand Luxury Resort & Spa',
            city: 'Miami',
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
            price: 299
          },
          {
            _id: 'h2',
            name: 'City Central Hotel',
            city: 'New York',
            rating: 4.5,
            image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa',
            price: 240
          }
        ];
        
        setBookings(mockBookings);
        setFavoriteHotels(mockFavorites);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [isAuthenticated, user]);
  
  const cancelBooking = (bookingId) => {
    setBookings(prevBookings => 
      prevBookings.map(booking => 
        booking._id === bookingId ? { ...booking, status: 'cancelled' } : booking
      )
    );
    toast.success('Booking cancelled successfully');
  };
  
  const removeFromFavorites = (hotelId) => {
    setFavoriteHotels(prevFavorites => 
      prevFavorites.filter(hotel => hotel._id !== hotelId)
    );
    toast.success('Hotel removed from favorites');
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <Badge bg="success">Confirmed</Badge>;
      case 'pending':
        return <Badge bg="warning" text="dark">Pending</Badge>;
      case 'cancelled':
        return <Badge bg="danger">Cancelled</Badge>;
      case 'completed':
        return <Badge bg="secondary">Completed</Badge>;
      default:
        return <Badge bg="info">{status}</Badge>;
    }
  };
  
  if (!isAuthenticated) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <Container className="flex-grow-1 py-5 mt-5 text-center">
          <h2>Access Denied</h2>
          <p>Please login to view your dashboard.</p>
          <Link to="/login" className="btn btn-primary mt-3">
            Login
          </Link>
        </Container>
        <Footer />
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <Container className="flex-grow-1 py-5 mt-5 text-center">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Loading your dashboard...</p>
        </Container>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      
      <Container className="flex-grow-1 py-5 mt-5">
        <Tab.Container defaultActiveKey="overview">
          <Row>
            {/* Sidebar */}
            <Col lg={3} md={4} className="mb-4">
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="text-center mb-4">
                    <div className="avatar-placeholder rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                      {profile?.username.charAt(0).toUpperCase()}
                    </div>
                    <h5 className="mb-1">{profile?.username}</h5>
                    <p className="text-muted small mb-0">{profile?.email}</p>
                  </div>
                  
                  <Nav variant="pills" className="flex-column">
                    <Nav.Item>
                      <Nav.Link eventKey="overview" className="mb-2">
                        <i className="bi bi-house-door me-2"></i>
                        Overview
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="bookings" className="mb-2">
                        <i className="bi bi-calendar3 me-2"></i>
                        My Bookings
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="favorites" className="mb-2">
                        <i className="bi bi-heart me-2"></i>
                        Favorite Hotels
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="profile" className="mb-2">
                        <i className="bi bi-person me-2"></i>
                        Profile Settings
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Card.Body>
              </Card>
            </Col>
            
            {/* Main Content Area */}
            <Col lg={9} md={8}>
              <Tab.Content>
                {/* Overview Tab */}
                <Tab.Pane eventKey="overview">
                  <h2 className="mb-4">Dashboard Overview</h2>
                  
                  {/* Stats */}
                  <Row className="mb-4">
                    <Col md={4} className="mb-3 mb-md-0">
                      <Card className="border-0 shadow-sm h-100">
                        <Card.Body className="d-flex align-items-center">
                          <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                            <i className="bi bi-calendar2-check text-primary fs-4"></i>
                          </div>
                          <div>
                            <h6 className="mb-1">Active Bookings</h6>
                            <h4 className="mb-0">{bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length}</h4>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={4} className="mb-3 mb-md-0">
                      <Card className="border-0 shadow-sm h-100">
                        <Card.Body className="d-flex align-items-center">
                          <div className="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
                            <i className="bi bi-star text-warning fs-4"></i>
                          </div>
                          <div>
                            <h6 className="mb-1">Loyalty Points</h6>
                            <h4 className="mb-0">{profile?.loyaltyPoints}</h4>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={4}>
                      <Card className="border-0 shadow-sm h-100">
                        <Card.Body className="d-flex align-items-center">
                          <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                            <i className="bi bi-heart text-success fs-4"></i>
                          </div>
                          <div>
                            <h6 className="mb-1">Favorites</h6>
                            <h4 className="mb-0">{favoriteHotels.length}</h4>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                  
                  {/* Recent Bookings */}
                  <Card className="border-0 shadow-sm mb-4">
                    <Card.Header className="bg-white py-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Recent Bookings</h5>
                        <Button 
                          variant="link" 
                          className="p-0 text-decoration-none" 
                          onClick={() => document.querySelector('a[href="#bookings"]').click()}
                        >
                          View All
                        </Button>
                      </div>
                    </Card.Header>
                    <Card.Body className="p-0">
                      <div className="table-responsive">
                        <Table hover className="mb-0">
                          <thead className="bg-light">
                            <tr>
                              <th>Hotel/Room</th>
                              <th>Dates</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {bookings.slice(0, 3).map((booking) => (
                              <tr key={booking._id}>
                                <td>
                                  <div className="fw-semibold">{booking.hotelName}</div>
                                  <div className="small text-muted">{booking.roomName}</div>
                                </td>
                                <td>
                                  {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                                </td>
                                <td>
                                  {getStatusBadge(booking.status)}
                                </td>
                                <td>
                                  <Link to={`/hotels/${booking.hotelId}`} className="btn btn-sm btn-outline-primary me-2">
                                    View Hotel
                                  </Link>
                                  {(booking.status === 'confirmed' || booking.status === 'pending') && (
                                    <Button 
                                      variant="outline-danger" 
                                      size="sm"
                                      onClick={() => cancelBooking(booking._id)}
                                    >
                                      Cancel
                                    </Button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </Card.Body>
                  </Card>
                  
                  {/* Favorite Hotels */}
                  <Card className="border-0 shadow-sm">
                    <Card.Header className="bg-white py-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Your Favorite Hotels</h5>
                        <Button 
                          variant="link" 
                          className="p-0 text-decoration-none" 
                          onClick={() => document.querySelector('a[href="#favorites"]').click()}
                        >
                          View All
                        </Button>
                      </div>
                    </Card.Header>
                    <Card.Body>
                      <Row xs={1} md={2} className="g-4">
                        {favoriteHotels.map((hotel) => (
                          <Col key={hotel._id}>
                            <Card className="h-100 border hotel-card">
                              <Row className="g-0">
                                <Col xs={4}>
                                  <img 
                                    src={hotel.image} 
                                    alt={hotel.name}
                                    className="w-100 h-100 object-fit-cover"
                                    style={{ objectFit: 'cover' }}
                                  />
                                </Col>
                                <Col xs={8}>
                                  <Card.Body className="py-2">
                                    <div className="d-flex justify-content-between align-items-start">
                                      <div>
                                        <Card.Title className="h6 mb-1">{hotel.name}</Card.Title>
                                        <Card.Subtitle className="text-muted small mb-2">
                                          {hotel.city}
                                        </Card.Subtitle>
                                      </div>
                                      <Badge bg="primary">
                                        <i className="bi bi-star-fill me-1"></i>
                                        {hotel.rating}
                                      </Badge>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mt-2">
                                      <div className="text-primary fw-semibold">
                                        ${hotel.price} <small className="text-muted">/ night</small>
                                      </div>
                                      <Link to={`/hotels/${hotel._id}`} className="btn btn-sm btn-outline-primary">
                                        View
                                      </Link>
                                    </div>
                                  </Card.Body>
                                </Col>
                              </Row>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    </Card.Body>
                  </Card>
                </Tab.Pane>
                
                {/* Bookings Tab */}
                <Tab.Pane eventKey="bookings">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="mb-0">My Bookings</h2>
                    <Link to="/hotels" className="btn btn-primary">
                      <i className="bi bi-plus-lg me-1"></i>
                      New Booking
                    </Link>
                  </div>
                  
                  <Card className="border-0 shadow-sm">
                    <Card.Body className="p-0">
                      <div className="table-responsive">
                        <Table hover className="mb-0">
                          <thead className="bg-light">
                            <tr>
                              <th>Booking ID</th>
                              <th>Hotel/Room</th>
                              <th>Dates</th>
                              <th>Price</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {bookings.length > 0 ? (
                              bookings.map((booking) => (
                                <tr key={booking._id}>
                                  <td>
                                    <span className="text-muted small">#{booking._id}</span>
                                  </td>
                                  <td>
                                    <div className="fw-semibold">{booking.hotelName}</div>
                                    <div className="small text-muted">{booking.roomName}</div>
                                  </td>
                                  <td>
                                    {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                                  </td>
                                  <td>
                                    <div className="fw-semibold">${booking.totalPrice}</div>
                                  </td>
                                  <td>
                                    {getStatusBadge(booking.status)}
                                  </td>
                                  <td>
                                    <div className="d-flex gap-2">
                                      <Link to={`/hotels/${booking.hotelId}`} className="btn btn-sm btn-outline-primary">
                                        View Hotel
                                      </Link>
                                      {(booking.status === 'confirmed' || booking.status === 'pending') && (
                                        <Button 
                                          variant="outline-danger" 
                                          size="sm"
                                          onClick={() => cancelBooking(booking._id)}
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
                                <td colSpan="6" className="text-center py-4">
                                  No bookings found. 
                                  <Link to="/hotels" className="ms-2">Book your first stay!</Link>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </div>
                    </Card.Body>
                  </Card>
                </Tab.Pane>
                
                {/* Favorites Tab */}
                <Tab.Pane eventKey="favorites">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="mb-0">My Favorite Hotels</h2>
                    <Link to="/hotels" className="btn btn-primary">
                      <i className="bi bi-search me-1"></i>
                      Explore Hotels
                    </Link>
                  </div>
                  
                  <Row xs={1} md={2} lg={2} className="g-4">
                    {favoriteHotels.length > 0 ? (
                      favoriteHotels.map((hotel) => (
                        <Col key={hotel._id}>
                          <Card className="h-100 border-0 shadow-sm hotel-card">
                            <div className="position-relative">
                              <Card.Img 
                                variant="top" 
                                src={hotel.image} 
                                alt={hotel.name}
                                className="card-img-top"
                                style={{ height: '200px', objectFit: 'cover' }}
                              />
                              <Button
                                variant="light"
                                size="sm"
                                className="position-absolute top-0 end-0 m-2 rounded-circle p-1"
                                onClick={() => removeFromFavorites(hotel._id)}
                              >
                                <i className="bi bi-heart-fill text-danger"></i>
                              </Button>
                            </div>
                            <Card.Body>
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <Card.Title className="h5 mb-0">{hotel.name}</Card.Title>
                                <Badge bg="primary" className="d-flex align-items-center">
                                  <i className="bi bi-star-fill me-1"></i>
                                  {hotel.rating}
                                </Badge>
                              </div>
                              <Card.Subtitle className="mb-3 text-muted">
                                <i className="bi bi-geo-alt-fill me-1"></i>{hotel.city}
                              </Card.Subtitle>
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="fs-5 fw-bold text-primary">
                                  ${hotel.price}
                                  <span className="text-muted small fw-normal"> / night</span>
                                </div>
                                <Link to={`/hotels/${hotel._id}`} className="btn btn-primary">
                                  View Details
                                </Link>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))
                    ) : (
                      <Col xs={12}>
                        <Card className="border-0 shadow-sm">
                          <Card.Body className="text-center py-5">
                            <i className="bi bi-heart text-muted fs-1 mb-3"></i>
                            <h4>No Favorite Hotels</h4>
                            <p className="text-muted mb-4">
                              You haven't added any hotels to your favorites yet.
                            </p>
                            <Link to="/hotels" className="btn btn-primary">
                              Browse Hotels
                            </Link>
                          </Card.Body>
                        </Card>
                      </Col>
                    )}
                  </Row>
                </Tab.Pane>
                
                {/* Profile Tab */}
                <Tab.Pane eventKey="profile">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="mb-0">Profile Settings</h2>
                    <Button variant="primary">
                      <i className="bi bi-check-lg me-1"></i>
                      Save Changes
                    </Button>
                  </div>
                  
                  <Row>
                    <Col lg={8}>
                      <Card className="border-0 shadow-sm mb-4">
                        <Card.Header className="bg-white py-3">
                          <h5 className="mb-0">Personal Information</h5>
                        </Card.Header>
                        <Card.Body>
                          <Row className="mb-3">
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label>Username</Form.Label>
                                <Form.Control 
                                  type="text" 
                                  defaultValue={profile?.username} 
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control 
                                  type="email" 
                                  defaultValue={profile?.email} 
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          <Row className="mb-3">
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label>Phone Number</Form.Label>
                                <Form.Control 
                                  type="tel" 
                                  defaultValue={profile?.phone} 
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label>Address</Form.Label>
                                <Form.Control 
                                  type="text" 
                                  defaultValue={profile?.address} 
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                      
                      <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white py-3">
                          <h5 className="mb-0">Password</h5>
                        </Card.Header>
                        <Card.Body>
                          <Row className="mb-3">
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label>Current Password</Form.Label>
                                <Form.Control 
                                  type="password" 
                                  placeholder="Enter current password" 
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          <Row className="mb-3">
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label>New Password</Form.Label>
                                <Form.Control 
                                  type="password" 
                                  placeholder="Enter new password" 
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label>Confirm New Password</Form.Label>
                                <Form.Control 
                                  type="password" 
                                  placeholder="Confirm new password" 
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          <Button variant="primary">Update Password</Button>
                        </Card.Body>
                      </Card>
                    </Col>
                    
                    <Col lg={4}>
                      <Card className="border-0 shadow-sm mb-4">
                        <Card.Header className="bg-white py-3">
                          <h5 className="mb-0">Account Summary</h5>
                        </Card.Header>
                        <Card.Body>
                          <div className="mb-3">
                            <div className="d-flex justify-content-between mb-1">
                              <span>Profile Completion</span>
                              <span>{profile?.profileComplete}%</span>
                            </div>
                            <div className="progress" style={{ height: '8px' }}>
                              <div 
                                className="progress-bar bg-success" 
                                role="progressbar" 
                                style={{ width: `${profile?.profileComplete}%` }}
                                aria-valuenow={profile?.profileComplete} 
                                aria-valuemin="0" 
                                aria-valuemax="100"
                              ></div>
                            </div>
                          </div>
                          <div className="mb-3">
                            <div className="d-flex justify-content-between">
                              <span>Member Since</span>
                              <span className="text-muted">{formatDate(profile?.memberSince)}</span>
                            </div>
                          </div>
                          <div className="mb-3">
                            <div className="d-flex justify-content-between">
                              <span>Loyalty Status</span>
                              <Badge bg={profile?.loyaltyPoints > 300 ? 'success' : 'secondary'}>
                                {profile?.loyaltyPoints > 300 ? 'Gold Member' : 'Standard'}
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <div className="d-flex justify-content-between">
                              <span>Loyalty Points</span>
                              <span className="fw-semibold">{profile?.loyaltyPoints}</span>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                      
                      <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white py-3">
                          <h5 className="mb-0">Preferences</h5>
                        </Card.Header>
                        <Card.Body>
                          <Form.Check 
                            type="switch"
                            id="email-notification"
                            label="Email Notifications"
                            defaultChecked
                            className="mb-3"
                          />
                          <Form.Check 
                            type="switch"
                            id="marketing-email"
                            label="Marketing Emails"
                            defaultChecked
                            className="mb-3"
                          />
                          <Form.Check 
                            type="switch"
                            id="special-offers"
                            label="Special Offers"
                            defaultChecked
                            className="mb-3"
                          />
                          <Form.Check 
                            type="switch"
                            id="newsletter"
                            label="Newsletter"
                            defaultChecked
                          />
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
      
      <Footer />
    </div>
  );
};

export default UserDashboard;
