
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button, Spinner, Carousel, Tab, Tabs, ListGroup } from 'react-bootstrap';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchForm from '@/components/SearchForm';
import { toast } from 'sonner';

const HotelDetail = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchHotelDetails = async () => {
      setLoading(true);
      try {
        // Mock data for demonstration
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // This is where you'd normally fetch from an API
        const mockHotel = {
          _id: id,
          name: 'Grand Luxury Resort & Spa',
          city: 'Miami',
          address: '123 Beach Blvd, Miami, FL 33139',
          photos: [
            'https://images.unsplash.com/photo-1566073771259-6a8506099945',
            'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa',
            'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb'
          ],
          desc: 'Experience luxury and comfort at our beachfront resort. Set amid lush tropical gardens and overlooking the crystal-clear waters of the Atlantic Ocean, Grand Luxury Resort & Spa offers an unforgettable stay with world-class amenities and personalized service. Our spacious rooms and suites feature elegant décor, premium bedding, and private balconies with stunning views.',
          rating: 4.8,
          cheapestPrice: 199,
          featured: true,
          type: 'resort',
          amenities: [
            'Free WiFi',
            'Swimming Pool',
            'Spa',
            'Fitness Center',
            'Restaurant',
            'Bar/Lounge',
            'Room Service',
            'Beachfront',
            'Air Conditioning',
            'Concierge Service'
          ],
          reviews: [
            {
              _id: 'r1',
              user: 'Sarah M.',
              rating: 5,
              comment: 'Absolutely amazing experience! The staff was incredibly attentive and the facilities were top-notch.',
              date: '2023-08-15'
            },
            {
              _id: 'r2',
              user: 'John D.',
              rating: 4,
              comment: 'Great location and beautiful property. The room was spacious and clean. Would definitely recommend.',
              date: '2023-07-22'
            }
          ],
          rooms: [
            {
              _id: 'rm1',
              name: 'Deluxe Ocean View',
              desc: 'Spacious room with stunning ocean views, king bed, and luxury amenities.',
              price: 299,
              maxPeople: 2,
              photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945'],
              available: true
            },
            {
              _id: 'rm2',
              name: 'Family Suite',
              desc: 'Perfect for families, featuring two bedrooms, a living area, and garden views.',
              price: 499,
              maxPeople: 4,
              photos: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa'],
              available: true
            },
            {
              _id: 'rm3',
              name: 'Presidential Suite',
              desc: 'Our most luxurious accommodation with panoramic ocean views, private terrace, and premium amenities.',
              price: 899,
              maxPeople: 2,
              photos: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb'],
              available: false
            }
          ]
        };
        
        setHotel(mockHotel);
      } catch (err) {
        console.error('Error fetching hotel details:', err);
        setError('Failed to load hotel details. Please try again later.');
        toast.error('Failed to load hotel details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchHotelDetails();
  }, [id]);
  
  if (loading) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <Container className="flex-grow-1 py-5 mt-5 text-center">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Loading hotel details...</p>
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
  
  if (!hotel) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <Container className="flex-grow-1 py-5 mt-5 text-center">
          <div className="alert alert-warning" role="alert">
            Hotel not found.
          </div>
          <Link to="/hotels" className="btn btn-primary mt-3">
            Browse Other Hotels
          </Link>
        </Container>
        <Footer />
      </div>
    );
  }
  
  const formatPrice = (price) => {
    return `$${price}`;
  };
  
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      
      <Container className="flex-grow-1 py-5 mt-5">
        {/* Hotel Title Section */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-start flex-wrap">
              <div>
                <h1 className="mb-2">{hotel.name}</h1>
                <p className="text-muted mb-2">
                  <i className="bi bi-geo-alt-fill me-1"></i>{hotel.address}
                </p>
                <div className="d-flex align-items-center mb-3">
                  <Badge bg="primary" className="d-flex align-items-center me-2">
                    <i className="bi bi-star-fill me-1"></i>
                    {hotel.rating.toFixed(1)}
                  </Badge>
                  <Badge bg="secondary" className="text-capitalize me-2">
                    {hotel.type}
                  </Badge>
                  {hotel.featured && (
                    <Badge bg="warning" text="dark">
                      Featured
                    </Badge>
                  )}
                </div>
              </div>
              <div className="mt-3 mt-md-0">
                <div className="text-md-end">
                  <div className="fs-3 fw-bold text-primary mb-1">
                    {formatPrice(hotel.cheapestPrice)}
                  </div>
                  <p className="text-muted">starting price per night</p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        
        {/* Photo Gallery */}
        <Row className="mb-4">
          <Col>
            <Card className="border-0 shadow-sm overflow-hidden">
              <Carousel>
                {hotel.photos.map((photo, index) => (
                  <Carousel.Item key={index}>
                    <div className="aspect-ratio-container">
                      <img
                        className="d-block w-100"
                        src={photo}
                        alt={`${hotel.name} - Photo ${index + 1}`}
                      />
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
            </Card>
          </Col>
        </Row>
        
        {/* Search Form */}
        <Row className="mb-4">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h5 className="mb-3">Check Availability</h5>
                <SearchForm />
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        {/* Hotel Details Tabs */}
        <Row className="mb-4">
          <Col>
            <Tabs defaultActiveKey="overview" className="mb-3">
              <Tab eventKey="overview" title="Overview">
                <Card className="border-0 shadow-sm">
                  <Card.Body>
                    <h3 className="mb-4">About This Hotel</h3>
                    <p className="mb-4">{hotel.desc}</p>
                    
                    <h4 className="mb-3">Amenities</h4>
                    <Row className="row-cols-1 row-cols-md-3 g-4 mb-4">
                      {hotel.amenities.map((amenity, index) => (
                        <Col key={index}>
                          <div className="d-flex align-items-center">
                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                            {amenity}
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </Card.Body>
                </Card>
              </Tab>
              
              <Tab eventKey="rooms" title="Rooms">
                <Card className="border-0 shadow-sm">
                  <Card.Body>
                    <h3 className="mb-4">Available Rooms</h3>
                    <Row xs={1} md={2} lg={3} className="g-4">
                      {hotel.rooms.map((room) => (
                        <Col key={room._id}>
                          <Card className={`h-100 ${room.available ? 'room-available' : 'room-unavailable'}`}>
                            <div className="position-relative">
                              <Card.Img 
                                variant="top" 
                                src={room.photos[0]} 
                                alt={room.name}
                                className="card-img-top"
                              />
                              {!room.available && (
                                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50">
                                  <Badge bg="danger" className="py-2 px-3 fs-6">Not Available</Badge>
                                </div>
                              )}
                            </div>
                            <Card.Body>
                              <Card.Title>{room.name}</Card.Title>
                              <Card.Text className="mb-2">{room.desc}</Card.Text>
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <span>
                                  <i className="bi bi-people-fill me-1"></i>
                                  Max {room.maxPeople} people
                                </span>
                                <span className="fs-5 fw-bold text-primary">{formatPrice(room.price)}</span>
                              </div>
                              <div className="d-grid">
                                {room.available ? (
                                  <Link to={`/rooms/${room._id}`} className="btn btn-primary">
                                    Select Room
                                  </Link>
                                ) : (
                                  <Button variant="outline-secondary" disabled>
                                    Unavailable
                                  </Button>
                                )}
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </Card.Body>
                </Card>
              </Tab>
              
              <Tab eventKey="reviews" title="Reviews">
                <Card className="border-0 shadow-sm">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h3 className="mb-0">Guest Reviews</h3>
                      <Badge bg="success" className="fs-5 py-2 px-3">
                        <i className="bi bi-star-fill me-1"></i>
                        {hotel.rating.toFixed(1)}
                      </Badge>
                    </div>
                    <ListGroup variant="flush">
                      {hotel.reviews.map((review) => (
                        <ListGroup.Item key={review._id} className="py-4 px-0 border-bottom">
                          <div className="d-flex justify-content-between mb-2">
                            <h5 className="mb-0">{review.user}</h5>
                            <div className="d-flex align-items-center">
                              <Badge bg="primary" className="d-flex align-items-center me-2">
                                <i className="bi bi-star-fill me-1"></i>
                                {review.rating.toFixed(1)}
                              </Badge>
                              <small className="text-muted">{review.date}</small>
                            </div>
                          </div>
                          <p className="mb-0">{review.comment}</p>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Tab>
            </Tabs>
          </Col>
        </Row>
        
        {/* Call to Action */}
        <Row className="mb-4">
          <Col>
            <Card className="bg-primary text-white border-0 shadow-sm">
              <Card.Body className="p-4 text-center">
                <h3 className="mb-3">Ready to Book Your Stay?</h3>
                <p className="mb-4">Experience luxury and comfort at {hotel.name}. Book now for the best rates!</p>
                <Button variant="light" size="lg">
                  Book Now
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      
      <Footer />
    </div>
  );
};

export default HotelDetail;
