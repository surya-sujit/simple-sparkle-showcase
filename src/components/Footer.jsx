
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-dark text-light py-5 mt-auto">
      <Container>
        <Row className="mb-4">
          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="mb-3 text-primary">StayHaven</h5>
            <p className="text-muted mb-3">
              Find your perfect hotel accommodation with our premium booking platform. 
              We offer the best rates and exceptional service.
            </p>
            <div className="d-flex gap-2">
              <a href="#" className="text-white">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="text-white">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" className="text-white">
                <i className="bi bi-instagram"></i>
              </a>
            </div>
          </Col>
          
          <Col md={2} sm={6} className="mb-4 mb-md-0">
            <h6 className="mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-muted text-decoration-none">Home</Link>
              </li>
              <li className="mb-2">
                <Link to="/hotels" className="text-muted text-decoration-none">Hotels</Link>
              </li>
              <li className="mb-2">
                <Link to="/about" className="text-muted text-decoration-none">About</Link>
              </li>
              <li className="mb-2">
                <Link to="/pricing" className="text-muted text-decoration-none">Pricing</Link>
              </li>
            </ul>
          </Col>
          
          <Col md={3} sm={6} className="mb-4 mb-md-0">
            <h6 className="mb-3">For Guests</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/register" className="text-muted text-decoration-none">Register</Link>
              </li>
              <li className="mb-2">
                <Link to="/login" className="text-muted text-decoration-none">Login</Link>
              </li>
              <li className="mb-2">
                <Link to="/dashboard" className="text-muted text-decoration-none">My Bookings</Link>
              </li>
            </ul>
          </Col>
          
          <Col md={3}>
            <h6 className="mb-3">Contact Us</h6>
            <ul className="list-unstyled text-muted">
              <li className="mb-2">
                <i className="bi bi-geo-alt me-2"></i> 123 Hotel Street, City
              </li>
              <li className="mb-2">
                <i className="bi bi-telephone me-2"></i> +1 234 567 890
              </li>
              <li className="mb-2">
                <i className="bi bi-envelope me-2"></i> info@stayhaven.com
              </li>
            </ul>
          </Col>
        </Row>
        
        <hr className="my-4 bg-secondary" />
        
        <div className="text-center text-muted">
          <p className="mb-0">&copy; {currentYear} StayHaven. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
