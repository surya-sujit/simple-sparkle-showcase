
import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const About = () => {
  // Team members data
  const teamMembers = [
    {
      id: 1,
      name: 'James Wilson',
      position: 'CEO & Founder',
      bio: 'James has over 15 years of experience in the hospitality industry and founded StayHaven with a vision to revolutionize how people book accommodations online.',
      image: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: 2,
      name: 'Sarah Chen',
      position: 'Chief Operations Officer',
      bio: 'Sarah oversees the day-to-day operations of StayHaven, ensuring that our platform runs smoothly and our customers receive exceptional service.',
      image: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      id: 3,
      name: 'Michael Rodriguez',
      position: 'Chief Technology Officer',
      bio: 'Michael leads our technology team, developing innovative solutions that make finding and booking accommodations easier than ever.',
      image: 'https://randomuser.me/api/portraits/men/67.jpg'
    },
    {
      id: 4,
      name: 'Emily Johnson',
      position: 'Head of Customer Experience',
      bio: 'Emily is dedicated to ensuring that every interaction with StayHaven exceeds customer expectations, from browsing to booking to staying.',
      image: 'https://randomuser.me/api/portraits/women/17.jpg'
    }
  ];

  // Company stats
  const companyStats = [
    { value: '5M+', label: 'Happy Customers' },
    { value: '10K+', label: 'Hotels & Resorts' },
    { value: '250+', label: 'Destinations' },
    { value: '24/7', label: 'Customer Support' }
  ];

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-primary text-white position-relative pt-5 mt-5">
        <Container className="py-5">
          <Row className="align-items-center">
            <Col lg={6} className="mb-5 mb-lg-0">
              <h1 className="display-4 fw-bold mb-4">About StayHaven</h1>
              <p className="lead mb-4 opacity-90">
                We're on a mission to make travel accommodations accessible, affordable, and enjoyable for everyone. Learn about our journey, our team, and our commitment to revolutionizing the way people find and book their perfect stays.
              </p>
            </Col>
            <Col lg={6}>
              <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c" 
                alt="Team Meeting" 
                className="img-fluid rounded-4 shadow-lg"
              />
            </Col>
          </Row>
        </Container>
        <div className="position-absolute bottom-0 start-0 w-100" style={{ height: '50px', overflow: 'hidden' }}>
          <svg viewBox="0 0 500 150" preserveAspectRatio="none" style={{ height: '100%', width: '100%' }}>
            <path d="M0,150 L0,40 Q250,150 500,50 L500,150 Z" fill="white"></path>
          </svg>
        </div>
      </div>
      
      {/* Our Story Section */}
      <Container className="py-5">
        <Row className="align-items-center">
          <Col lg={6} className="mb-4 mb-lg-0">
            <img 
              src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa" 
              alt="Hotel" 
              className="img-fluid rounded-4 shadow-sm"
            />
          </Col>
          <Col lg={6}>
            <h2 className="mb-4">Our Story</h2>
            <p className="mb-4">
              StayHaven was founded in 2015 with a simple idea: make finding the perfect accommodation easy, transparent, and enjoyable. What started as a small startup has grown into a trusted platform used by millions of travelers worldwide.
            </p>
            <p className="mb-4">
              Our journey began when our founder, James Wilson, experienced frustration with existing booking platforms during his frequent business travels. He envisioned a more intuitive, user-friendly platform that prioritized customer experiences and offered genuine value.
            </p>
            <p>
              Today, StayHaven partners with thousands of hotels, resorts, and vacation rentals across 250+ destinations, providing travelers with a wide range of accommodation options to suit every preference and budget.
            </p>
          </Col>
        </Row>
      </Container>
      
      {/* Company Stats Section */}
      <div className="bg-light py-5">
        <Container>
          <Row>
            {companyStats.map((stat, index) => (
              <Col md={3} className="text-center mb-4 mb-md-0" key={index}>
                <h2 className="display-4 fw-bold text-primary mb-2">{stat.value}</h2>
                <p className="text-muted mb-0">{stat.label}</p>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
      
      {/* Our Mission Section */}
      <Container className="py-5">
        <Row>
          <Col lg={8} className="mx-auto text-center">
            <h2 className="mb-4">Our Mission</h2>
            <p className="lead mb-5">
              Our mission is to connect travelers with their ideal accommodations, making every stay a memorable experience. We strive to provide exceptional value, transparency, and service in everything we do.
            </p>
          </Col>
        </Row>
        <Row className="g-4">
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="p-4 text-center">
                <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '80px', height: '80px' }}>
                  <i className="bi bi-globe2 text-primary fs-2"></i>
                </div>
                <h4>Global Reach</h4>
                <p className="text-muted mb-0">
                  We offer accommodations in over 250 destinations worldwide, ensuring you can find the perfect stay no matter where your travels take you.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="p-4 text-center">
                <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '80px', height: '80px' }}>
                  <i className="bi bi-star text-primary fs-2"></i>
                </div>
                <h4>Quality Assurance</h4>
                <p className="text-muted mb-0">
                  We carefully vet all accommodations on our platform to ensure they meet our high standards for quality, comfort, and value.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="p-4 text-center">
                <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '80px', height: '80px' }}>
                  <i className="bi bi-person-check text-primary fs-2"></i>
                </div>
                <h4>Customer First</h4>
                <p className="text-muted mb-0">
                  We're committed to providing exceptional customer service, from the moment you book to the end of your stay.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      
      {/* Team Section */}
      <div className="bg-light py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="mb-3">Meet Our Team</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '700px' }}>
              The passionate individuals behind StayHaven who work tirelessly to transform how you experience travel accommodations.
            </p>
          </div>
          
          <Row className="g-4">
            {teamMembers.map((member) => (
              <Col lg={3} md={6} key={member.id}>
                <Card className="h-100 border-0 shadow-sm text-center">
                  <div className="position-relative">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="rounded-circle mx-auto mt-4"
                      width="120"
                      height="120"
                    />
                  </div>
                  <Card.Body className="p-4">
                    <h5 className="mb-1">{member.name}</h5>
                    <p className="text-primary mb-3">{member.position}</p>
                    <p className="text-muted small mb-0">{member.bio}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
      
      {/* Call to Action */}
      <div className="py-5 bg-primary text-white">
        <Container className="py-4">
          <Row className="align-items-center">
            <Col lg={8} className="text-center text-lg-start mb-4 mb-lg-0">
              <h2 className="display-6 fw-bold mb-3">Join the StayHaven Community</h2>
              <p className="lead mb-0 opacity-90">
                Start your journey with us and discover a better way to find accommodations for your travels.
              </p>
            </Col>
            <Col lg={4} className="text-center text-lg-end">
              <Link to="/register">
                <Button variant="light" size="lg" className="fw-semibold text-primary me-3">
                  Sign Up
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline-light" size="lg">
                  Contact Us
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

export default About;
