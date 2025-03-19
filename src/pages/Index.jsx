
import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchForm from '@/components/SearchForm';

const Index = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-primary bg-opacity-10 pt-5 mt-5">
        <Container className="py-5">
          <Row className="align-items-center">
            <Col md={6} className="mb-4 mb-md-0">
              <h1 className="display-4 fw-bold mb-3">
                Find Your Perfect Stay with StayHaven
              </h1>
              <p className="lead text-muted mb-4">
                Discover amazing hotels, resorts, and vacation rentals from around the world. 
                Book with confidence and enjoy your stay.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-2">
                <Link to="/hotels">
                  <Button variant="primary" size="lg">
                    Browse Hotels
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline-primary" size="lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </Col>
            <Col md={6}>
              <img 
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945" 
                alt="Luxury Hotel" 
                className="img-fluid rounded shadow"
              />
            </Col>
          </Row>
        </Container>
      </div>
      
      {/* Search Section */}
      <Container className="my-n5 position-relative z-index-1">
        <div className="p-4 bg-white rounded-3 shadow">
          <h3 className="h4 mb-4 text-center">Search Your Perfect Hotel</h3>
          <SearchForm />
        </div>
      </Container>
      
      {/* Featured Section */}
      <Container className="py-5 mt-5">
        <div className="text-center mb-5">
          <h2 className="h2 mb-3">Featured Destinations</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '700px' }}>
            Explore our handpicked selection of stunning hotels and resorts in the most desirable locations around the world.
          </p>
        </div>
        
        <Row>
          <Col md={4} className="mb-4">
            <Card className="h-100 border-0 shadow-sm hotel-card">
              <div className="position-relative">
                <Card.Img 
                  variant="top" 
                  src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb" 
                  alt="New York"
                  className="card-img-top"
                />
                <div className="position-absolute bottom-0 start-0 end-0 p-3 text-white bg-dark bg-opacity-50">
                  <h3 className="h5 mb-1">New York</h3>
                  <p className="mb-0 small">125 Properties</p>
                </div>
              </div>
            </Card>
          </Col>
          
          <Col md={4} className="mb-4">
            <Card className="h-100 border-0 shadow-sm hotel-card">
              <div className="position-relative">
                <Card.Img 
                  variant="top" 
                  src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa" 
                  alt="Miami"
                  className="card-img-top"
                />
                <div className="position-absolute bottom-0 start-0 end-0 p-3 text-white bg-dark bg-opacity-50">
                  <h3 className="h5 mb-1">Miami</h3>
                  <p className="mb-0 small">98 Properties</p>
                </div>
              </div>
            </Card>
          </Col>
          
          <Col md={4} className="mb-4">
            <Card className="h-100 border-0 shadow-sm hotel-card">
              <div className="position-relative">
                <Card.Img 
                  variant="top" 
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945" 
                  alt="San Francisco"
                  className="card-img-top"
                />
                <div className="position-absolute bottom-0 start-0 end-0 p-3 text-white bg-dark bg-opacity-50">
                  <h3 className="h5 mb-1">San Francisco</h3>
                  <p className="mb-0 small">72 Properties</p>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
        
        <div className="text-center mt-4">
          <Link to="/hotels">
            <Button variant="outline-primary">
              View All Destinations
            </Button>
          </Link>
        </div>
      </Container>
      
      {/* Benefits Section */}
      <div className="py-5 bg-light">
        <Container>
          <div className="text-center mb-5">
            <h2 className="h2 mb-3">Why Choose StayHaven</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '700px' }}>
              We're committed to making your travel experience as seamless and enjoyable as possible.
            </p>
          </div>
          
          <Row className="g-4">
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm p-4">
                <div className="text-primary mb-3">
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
            
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm p-4">
                <div className="text-primary mb-3">
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
            
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm p-4">
                <div className="text-primary mb-3">
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
          </Row>
        </Container>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
