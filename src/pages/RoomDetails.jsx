
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button, Spinner, Carousel, Form, ListGroup } from 'react-bootstrap';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const RoomDetails = () => {
  const { id } = useParams();
  const { state } = useAuth();
  const { isAuthenticated } = state;
  
  const [room, setRoom] = useState(null);
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    totalNights: 1,
    totalPrice: 0
  });
  
  useEffect(() => {
    const fetchRoomDetails = async () => {
      setLoading(true);
      try {
        // Mock data for demonstration
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // This is where you'd normally fetch from an API
        const mockRoom = {
          _id: id,
          name: 'Deluxe Ocean View Suite',
          desc: 'Indulge in luxury with our Deluxe Ocean View Suite. This spacious accommodation features a king-size bed, premium linens, and a private balcony overlooking the stunning Atlantic Ocean. The elegantly appointed bathroom includes a deep soaking tub, separate rainfall shower, and deluxe toiletries. Additional amenities include a comfortable seating area, work desk, smart TV, mini-fridge, coffee maker, and high-speed Wi-Fi.',
          price: 299,
          maxPeople: 2,
          size: 550, // sq ft
          bedType: 'King',
          photos: [
            'https://images.unsplash.com/photo-1566073771259-6a8506099945',
            'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa',
            'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb'
          ],
          amenities: [
            'Ocean View',
            'Private Balcony',
            'King Bed',
            'Premium Linens',
            'Deep Soaking Tub',
            'Rainfall Shower',
            'Smart TV',
            'Mini Fridge',
            'Coffee Maker',
            'High-Speed Wi-Fi',
            'Air Conditioning',
            'Room Service',
            'Daily Housekeeping'
          ],
          available: true,
          hotelId: 'h123'
        };
        
        const mockHotel = {
          _id: 'h123',
          name: 'Grand Luxury Resort & Spa',
          city: 'Miami',
          address: '123 Beach Blvd, Miami, FL 33139',
          rating: 4.8,
          photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945']
        };
        
        setRoom(mockRoom);
        setHotel(mockHotel);
        setBookingData(prev => ({
          ...prev,
          totalPrice: mockRoom.price
        }));
      } catch (err) {
        console.error('Error fetching room details:', err);
        setError('Failed to load room details. Please try again later.');
        toast.error('Failed to load room details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRoomDetails();
  }, [id]);
  
  useEffect(() => {
    if (!bookingData.checkIn || !bookingData.checkOut) return;
    
    const start = new Date(bookingData.checkIn);
    const end = new Date(bookingData.checkOut);
    
    // Calculate difference in days
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return;
    
    setBookingData(prev => ({
      ...prev,
      totalNights: diffDays,
      totalPrice: diffDays * (room?.price || 0)
    }));
  }, [bookingData.checkIn, bookingData.checkOut, room?.price]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData({
      ...bookingData,
      [name]: value
    });
  };
  
  const handleBookNow = () => {
    if (!isAuthenticated) {
      toast.error('Please login to book a room');
      return;
    }
    
    if (!bookingData.checkIn || !bookingData.checkOut) {
      toast.error('Please select check-in and check-out dates');
      return;
    }
    
    toast.success('Booking request submitted successfully');
    // Here you would normally send the booking data to your backend
    console.log('Booking data:', {
      roomId: room._id,
      hotelId: hotel._id,
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      guests: bookingData.guests,
      totalNights: bookingData.totalNights,
      totalPrice: bookingData.totalPrice
    });
  };
  
  if (loading) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <Container className="flex-grow-1 py-5 mt-5 text-center">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Loading room details...</p>
        </Container>
        <Footer />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <Container className="flex-grow-1 py-5 mt-5 text-center">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
          <Link to="/hotels" className="btn btn-primary mt-3">
            Back to Hotels
          </Link>
        </Container>
        <Footer />
      </div>
    );
  }
  
  if (!room || !hotel) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <Container className="flex-grow-1 py-5 mt-5 text-center">
          <div className="alert alert-warning" role="alert">
            Room not found.
          </div>
          <Link to="/hotels" className="btn btn-primary mt-3">
            Browse Other Rooms
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
        {/* Breadcrumb */}
        <Row className="mb-4">
          <Col>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item"><Link to="/hotels">Hotels</Link></li>
                <li className="breadcrumb-item"><Link to={`/hotels/${hotel._id}`}>{hotel.name}</Link></li>
                <li className="breadcrumb-item active" aria-current="page">{room.name}</li>
              </ol>
            </nav>
          </Col>
        </Row>
        
        {/* Room Title Section */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-start flex-wrap">
              <div>
                <h1 className="mb-2">{room.name}</h1>
                <p className="text-muted mb-2">
                  <Link to={`/hotels/${hotel._id}`} className="text-decoration-none">
                    <i className="bi bi-building me-1"></i>{hotel.name}
                  </Link> • 
                  <i className="bi bi-geo-alt-fill ms-2 me-1"></i>{hotel.city}
                </p>
                <div className="d-flex align-items-center">
                  <Badge bg="primary" className="d-flex align-items-center me-2">
                    <i className="bi bi-star-fill me-1"></i>
                    {hotel.rating.toFixed(1)}
                  </Badge>
                  {room.available ? (
                    <Badge bg="success">Available</Badge>
                  ) : (
                    <Badge bg="danger">Not Available</Badge>
                  )}
                </div>
              </div>
              <div className="mt-3 mt-md-0">
                <div className="text-md-end">
                  <div className="fs-3 fw-bold text-primary mb-1">
                    ${room.price}
                  </div>
                  <p className="text-muted">per night</p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        
        <Row>
          {/* Room Details */}
          <Col lg={8} className="mb-4">
            {/* Photo Gallery */}
            <Card className="border-0 shadow-sm overflow-hidden mb-4">
              <Carousel>
                {room.photos.map((photo, index) => (
                  <Carousel.Item key={index}>
                    <div className="aspect-ratio-container">
                      <img
                        className="d-block w-100"
                        src={photo}
                        alt={`${room.name} - Photo ${index + 1}`}
                      />
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
            </Card>
            
            {/* Room Description */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <h3 className="mb-3">Room Details</h3>
                <p>{room.desc}</p>
                
                <Row className="mt-4">
                  <Col md={6}>
                    <h5 className="mb-3">Room Specifications</h5>
                    <ListGroup variant="flush">
                      <ListGroup.Item className="px-0 py-2 d-flex justify-content-between">
                        <span>Room Size:</span>
                        <span className="fw-semibold">{room.size} sq ft</span>
                      </ListGroup.Item>
                      <ListGroup.Item className="px-0 py-2 d-flex justify-content-between">
                        <span>Bed Type:</span>
                        <span className="fw-semibold">{room.bedType}</span>
                      </ListGroup.Item>
                      <ListGroup.Item className="px-0 py-2 d-flex justify-content-between">
                        <span>Max Occupancy:</span>
                        <span className="fw-semibold">{room.maxPeople} persons</span>
                      </ListGroup.Item>
                    </ListGroup>
                  </Col>
                  <Col md={6}>
                    <h5 className="mb-3">Amenities</h5>
                    <div className="row g-2">
                      {room.amenities.map((amenity, index) => (
                        <div key={index} className="col-6">
                          <div className="d-flex align-items-center">
                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                            <span>{amenity}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            
            {/* Policies */}
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h3 className="mb-3">Policies</h3>
                <Row>
                  <Col md={6}>
                    <h5 className="mb-2">Check-in & Check-out</h5>
                    <ListGroup variant="flush">
                      <ListGroup.Item className="px-0 py-2 d-flex justify-content-between">
                        <span>Check-in:</span>
                        <span className="fw-semibold">From 3:00 PM</span>
                      </ListGroup.Item>
                      <ListGroup.Item className="px-0 py-2 d-flex justify-content-between">
                        <span>Check-out:</span>
                        <span className="fw-semibold">Until 11:00 AM</span>
                      </ListGroup.Item>
                    </ListGroup>
                  </Col>
                  <Col md={6}>
                    <h5 className="mb-2">Cancellation Policy</h5>
                    <p className="mb-0">Free cancellation up to 24 hours before check-in. Cancellations made less than 24 hours in advance are subject to a one-night charge.</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          
          {/* Booking Form */}
          <Col lg={4}>
            <Card className="border-0 shadow-sm position-sticky" style={{ top: '95px' }}>
              <Card.Body>
                <h3 className="mb-4">Book This Room</h3>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Check-in Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="checkIn"
                      value={bookingData.checkIn}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Check-out Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="checkOut"
                      value={bookingData.checkOut}
                      onChange={handleInputChange}
                      min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                      required
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label>Number of Guests</Form.Label>
                    <Form.Select
                      name="guests"
                      value={bookingData.guests}
                      onChange={handleInputChange}
                    >
                      {[...Array(room.maxPeople)].map((_, i) => (
                        <option key={i} value={i + 1}>{i + 1} {i === 0 ? 'Guest' : 'Guests'}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  
                  <div className="p-3 bg-light rounded mb-4">
                    <h5 className="mb-3">Price Summary</h5>
                    <div className="d-flex justify-content-between mb-2">
                      <span>${room.price} x {bookingData.totalNights} night{bookingData.totalNights !== 1 ? 's' : ''}</span>
                      <span>${bookingData.totalPrice}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Taxes & Fees (10%)</span>
                      <span>${(bookingData.totalPrice * 0.1).toFixed(2)}</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between fw-bold">
                      <span>Total</span>
                      <span>${(bookingData.totalPrice * 1.1).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="d-grid">
                    <Button 
                      variant="primary" 
                      size="lg" 
                      onClick={handleBookNow}
                      disabled={!room.available}
                    >
                      {isAuthenticated ? 'Book Now' : 'Login to Book'}
                    </Button>
                  </div>
                  
                  {!isAuthenticated && (
                    <div className="text-center mt-3">
                      <Link to="/login" className="text-decoration-none">
                        Login to your account
                      </Link> to book this room.
                    </div>
                  )}
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      
      <Footer />
    </div>
  );
};

export default RoomDetails;
