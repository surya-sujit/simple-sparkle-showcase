
import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white pt-5 pb-4">
      <Container>
        <Row className="mb-4">
          <Col lg={4} md={6} className="mb-4 mb-lg-0">
            <h4 className="text-primary fw-bold mb-4">StayHaven</h4>
            <p className="mb-4">
              Find your perfect accommodations with StayHaven. We offer a wide selection of hotels, 
              resorts, and vacation rentals to make your travel dreams a reality.
            </p>
            <div className="d-flex gap-2">
              <Button variant="outline-light" size="sm" className="rounded-circle">
                <i className="bi bi-facebook"></i>
              </Button>
              <Button variant="outline-light" size="sm" className="rounded-circle">
                <i className="bi bi-twitter"></i>
              </Button>
              <Button variant="outline-light" size="sm" className="rounded-circle">
                <i className="bi bi-instagram"></i>
              </Button>
              <Button variant="outline-light" size="sm" className="rounded-circle">
                <i className="bi bi-linkedin"></i>
              </Button>
            </div>
          </Col>
          
          <Col lg={2} md={6} className="mb-4 mb-lg-0">
            <h5 className="mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-white text-decoration-none hover-link">
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/hotels" className="text-white text-decoration-none hover-link">
                  Hotels
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/about" className="text-white text-decoration-none hover-link">
                  About Us
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/pricing" className="text-white text-decoration-none hover-link">
                  Pricing
                </Link>
              </li>
            </ul>
          </Col>
          
          <Col lg={2} md={6} className="mb-4 mb-lg-0">
            <h5 className="mb-3">Support</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/contact" className="text-white text-decoration-none hover-link">
                  Contact Us
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/faq" className="text-white text-decoration-none hover-link">
                  FAQ
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/terms" className="text-white text-decoration-none hover-link">
                  Terms of Service
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/privacy" className="text-white text-decoration-none hover-link">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </Col>
          
          <Col lg={4} md={6}>
            <h5 className="mb-3">Subscribe to Our Newsletter</h5>
            <p className="mb-3">Stay updated with our latest offers and news</p>
            <div className="input-group mb-3">
              <input 
                type="email" 
                className="form-control" 
                placeholder="Your email address" 
                aria-label="Your email address" 
              />
              <Button variant="primary">
                Subscribe
              </Button>
            </div>
            <p className="small text-muted mb-0">
              By subscribing, you agree to our <Link to="/privacy" className="text-decoration-none">Privacy Policy</Link>.
            </p>
          </Col>
        </Row>
        
        <hr className="my-4 bg-light" />
        
        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start mb-3 mb-md-0">
            <p className="mb-0">&copy; {currentYear} StayHaven. All rights reserved.</p>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end gap-3">
              <Link to="/terms" className="text-white text-decoration-none small">
                Terms
              </Link>
              <Link to="/privacy" className="text-white text-decoration-none small">
                Privacy
              </Link>
              <Link to="/cookies" className="text-white text-decoration-none small">
                Cookies
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
