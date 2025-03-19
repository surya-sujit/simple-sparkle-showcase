
import React from 'react';
import { Container, Row, Col, Button, Card, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchForm from '@/components/SearchForm';

const Index = () => {
  // Featured destinations data
  const featuredDestinations = [
    {
      id: 1,
      name: 'New York',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
      properties: 125
    },
    {
      id: 2,
      name: 'Miami',
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa',
      properties: 98
    },
    {
      id: 3,
      name: 'San Francisco',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      properties: 72
    }
  ];

  // Testimonial data
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      location: 'New York, USA',
      text: 'StayHaven made our family vacation so easy to plan. We found the perfect hotel with all the amenities we needed. The booking process was quick and smooth, and we received excellent service during our stay!',
      image: 'https://randomuser.me/api/portraits/women/12.jpg'
    },
    {
      id: 2,
      name: 'Michael Rodriguez',
      location: 'Miami, USA',
      text: 'I travel frequently for business, and StayHaven has become my go-to platform for finding hotels. The loyalty program is fantastic, and the customer service team has been incredibly helpful whenever I\'ve needed assistance.',
      image: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: 3,
      name: 'Emily Chen',
      location: 'San Francisco, USA',
      text: 'I was able to find a luxury hotel at an amazing discount through StayHaven. The platform is user-friendly, and I love the detailed descriptions and high-quality photos that really help you get a feel for each property.',
      image: 'https://randomuser.me/api/portraits/women/44.jpg'
    }
  ];

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      
      {/* Hero Section with animated gradient background */}
      <div className="position-relative overflow-hidden pt-5 mt-5">
        <div 
          className="position-absolute top-0 start-0 w-100 h-100" 
          style={{ 
            background: 'linear-gradient(135deg, #0d6efd 0%, #6610f2 100%)',
            opacity: 0.9,
            zIndex: -1
          }}
        ></div>
        <Container className="py-5">
          <Row className="align-items-center">
            <Col lg={6} className="text-white mb-5 mb-lg-0 animate-fade-in-up">
              <h1 className="display-4 fw-bold mb-3">
                Find Your Perfect Stay with StayHaven
              </h1>
              <p className="lead mb-4 opacity-90">
                Discover amazing hotels, resorts, and vacation rentals from around the world. 
                Book with confidence and enjoy your stay.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3">
                <Link to="/hotels">
                  <Button variant="light" size="lg" className="fw-semibold text-primary">
                    Browse Hotels
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline-light" size="lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </Col>
            <Col lg={6}>
              <div className="position-relative">
                <img 
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945" 
                  alt="Luxury Hotel" 
                  className="img-fluid rounded-4 shadow-lg animate-fade-in-up"
                  style={{ 
                    objectFit: 'cover', 
                    height: '500px',
                    width: '100%'
                  }}
                />
                <div className="position-absolute bottom-0 end-0 mb-4 me-4 bg-white p-3 rounded-3 shadow animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  <div className="d-flex align-items-center">
                    <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                      <i className="bi bi-star-fill text-white"></i>
                    </div>
                    <div>
                      <p className="mb-0 fw-semibold">4.9 Rating</p>
                      <p className="mb-0 small text-muted">From 2,500+ Reviews</p>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      
      {/* Search Section */}
      <Container className="my-n5 position-relative" style={{ zIndex: 10 }}>
        <div className="bg-white rounded-4 shadow-lg p-4">
          <h3 className="h4 mb-4 text-center">Find Your Perfect Stay</h3>
          <SearchForm />
        </div>
      </Container>
      
      {/* Featured Destinations Section */}
      <Container className="py-5 mt-5">
        <div className="text-center mb-5">
          <h2 className="h2 mb-3">Featured Destinations</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '700px' }}>
            Explore our handpicked selection of stunning hotels and resorts in the most desirable locations around the world.
          </p>
        </div>
        
        <Row className="g-4">
          {featuredDestinations.map((destination) => (
            <Col md={4} key={destination.id}>
              <Card className="h-100 border-0 shadow-sm hotel-card overflow-hidden">
                <div className="position-relative">
                  <Card.Img 
                    variant="top" 
                    src={destination.image} 
                    alt={destination.name}
                    className="card-img-top"
                  />
                  <div className="position-absolute bottom-0 start-0 end-0 p-3 text-white bg-dark bg-opacity-50">
                    <h3 className="h5 mb-1">{destination.name}</h3>
                    <p className="mb-0 small">{destination.properties} Properties</p>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
        
        <div className="text-center mt-4">
          <Link to="/hotels">
            <Button variant="outline-primary">
              View All Destinations
            </Button>
          </Link>
        </div>
      </Container>
      
      {/* Benefits Section with Icons */}
      <div className="py-5 bg-light">
        <Container>
          <div className="text-center mb-5">
            <h2 className="h2 mb-3">Why Choose StayHaven</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '700px' }}>
              We're committed to making your travel experience as seamless and enjoyable as possible.
            </p>
          </div>
          
          <Row className="g-4">
            <Col md={3}>
              <Card className="h-100 border-0 shadow-sm p-4 text-center">
                <div className="text-primary mb-3 mx-auto">
                  <i className="bi bi-shield-lock fs-1"></i>
                </div>
                <Card.Body className="p-0">
                  <Card.Title>Secure Booking</Card.Title>
                  <Card.Text className="text-muted">
                    Your privacy and security are our top priorities. All bookings are encrypted and secure.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={3}>
              <Card className="h-100 border-0 shadow-sm p-4 text-center">
                <div className="text-primary mb-3 mx-auto">
                  <i className="bi bi-tag fs-1"></i>
                </div>
                <Card.Body className="p-0">
                  <Card.Title>Best Price Guarantee</Card.Title>
                  <Card.Text className="text-muted">
                    Find a lower price elsewhere? We'll match it and give you an additional 10% off.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={3}>
              <Card className="h-100 border-0 shadow-sm p-4 text-center">
                <div className="text-primary mb-3 mx-auto">
                  <i className="bi bi-headset fs-1"></i>
                </div>
                <Card.Body className="p-0">
                  <Card.Title>24/7 Support</Card.Title>
                  <Card.Text className="text-muted">
                    Our customer support team is available around the clock to assist with any questions or issues.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={3}>
              <Card className="h-100 border-0 shadow-sm p-4 text-center">
                <div className="text-primary mb-3 mx-auto">
                  <i className="bi bi-trophy fs-1"></i>
                </div>
                <Card.Body className="p-0">
                  <Card.Title>Loyalty Rewards</Card.Title>
                  <Card.Text className="text-muted">
                    Earn points with every booking and redeem them for discounts on future stays.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      
      {/* Testimonials Carousel */}
      <Container className="py-5">
        <div className="text-center mb-5">
          <h2 className="h2 mb-3">What Our Customers Say</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '700px' }}>
            Hear from travelers who have booked their perfect accommodations through StayHaven.
          </p>
        </div>
        
        <Carousel 
          className="testimonial-carousel bg-white p-4 rounded-4 shadow-sm"
          indicators={true}
          controls={true}
          interval={5000}
        >
          {testimonials.map((testimonial) => (
            <Carousel.Item key={testimonial.id}>
              <div className="d-flex flex-column align-items-center text-center px-md-5 py-3">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="rounded-circle mb-4 shadow-sm"
                  width="80"
                  height="80"
                />
                <i className="bi bi-quote fs-1 text-primary mb-3"></i>
                <p className="fs-5 mb-4 testimonial-text px-md-5">{testimonial.text}</p>
                <h5 className="mb-1">{testimonial.name}</h5>
                <p className="text-muted">{testimonial.location}</p>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>
      
      {/* Call to Action Section */}
      <div className="py-5 bg-primary text-white">
        <Container className="py-4">
          <Row className="align-items-center">
            <Col lg={8} className="text-center text-lg-start mb-4 mb-lg-0">
              <h2 className="display-6 fw-bold mb-3">Ready to find your perfect stay?</h2>
              <p className="lead mb-0 opacity-90">
                Join thousands of satisfied travelers who have found their ideal accommodations with StayHaven.
              </p>
            </Col>
            <Col lg={4} className="text-center text-lg-end">
              <Link to="/register">
                <Button variant="light" size="lg" className="fw-semibold text-primary me-3">
                  Sign Up Now
                </Button>
              </Link>
              <Link to="/hotels">
                <Button variant="outline-light" size="lg">
                  Browse Hotels
                </Button>
              </Link>
            </Col>
          </Row>
        </Container>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
