
import React from 'react';
import { Container, Row, Col, Card, Button, Table, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';

const Pricing = () => {
  const { state } = useAuth();
  const { isAuthenticated } = state;
  
  // Pricing tiers data
  const pricingTiers = [
    {
      name: 'Basic',
      price: 0,
      period: 'Forever',
      description: 'Everything you need to get started booking accommodations.',
      features: [
        'Browse all hotels and resorts',
        'Read and write reviews',
        'Basic customer support',
        'Secure booking process',
        'Email confirmations'
      ],
      cta: 'Sign Up Free',
      popular: false,
      color: 'primary'
    },
    {
      name: 'Premium',
      price: 9.99,
      period: 'per month',
      description: 'Enhanced features for frequent travelers.',
      features: [
        'All Basic features',
        'Early access to deals',
        'Price alerts',
        'Priority customer support',
        'Loyalty points (2x)',
        'Free cancellations',
        'Exclusive partner discounts'
      ],
      cta: 'Get Premium',
      popular: true,
      color: 'primary'
    },
    {
      name: 'Business',
      price: 49.99,
      period: 'per month',
      description: 'Perfect for business travelers and small teams.',
      features: [
        'All Premium features',
        'Business travel reports',
        'Team management',
        'VAT invoices',
        'Corporate billing',
        'Dedicated account manager',
        'API access',
        '24/7 phone support'
      ],
      cta: 'Contact Sales',
      popular: false,
      color: 'primary'
    }
  ];
  
  // FAQs data
  const faqs = [
    {
      question: 'What is included in the free plan?',
      answer: 'The Basic free plan includes everything you need to search, book, and review accommodations on StayHaven. You can browse all listings, access standard customer support, and enjoy our secure booking process.'
    },
    {
      question: 'Can I cancel my subscription at any time?',
      answer: 'Yes, you can cancel your Premium or Business subscription at any time. Your benefits will continue until the end of your billing period, after which you\'ll be downgraded to the Basic plan.'
    },
    {
      question: 'Is there a discount for annual billing?',
      answer: 'Yes! You can save 20% by choosing annual billing for either the Premium or Business plans. This discount will be applied automatically when you select the annual billing option.'
    },
    {
      question: 'How do loyalty points work?',
      answer: 'Loyalty points are earned with every booking. Basic members earn 1 point per dollar spent, while Premium members earn 2 points per dollar. These points can be redeemed for discounts on future bookings, room upgrades, and other perks.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, and Apple Pay. For Business plan customers, we also offer invoice payment options.'
    },
    {
      question: 'How does the price match guarantee work?',
      answer: 'If you find a lower price for the same accommodation with the same booking conditions on another website within 24 hours of booking, we\'ll refund the difference. Premium and Business members also receive an additional 10% discount on their next booking.'
    }
  ];
  
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-primary text-white pt-5 mt-5">
        <Container className="py-5 text-center">
          <h1 className="display-4 fw-bold mb-3">Simple, Transparent Pricing</h1>
          <p className="lead mx-auto mb-4" style={{ maxWidth: '700px' }}>
            Choose the plan that's right for you and start enjoying enhanced booking features and benefits.
          </p>
          <div className="d-inline-block bg-white bg-opacity-10 rounded-pill p-2 mb-4">
            <Button variant="light" className="rounded-pill px-4 me-2 fw-semibold">
              Monthly
            </Button>
            <Button variant="transparent" className="rounded-pill px-4 text-white">
              Annual <Badge bg="success" className="ms-2">Save 20%</Badge>
            </Button>
          </div>
        </Container>
      </div>
      
      {/* Pricing Cards */}
      <Container className="py-5 mt-n5">
        <Row className="g-4">
          {pricingTiers.map((tier, index) => (
            <Col lg={4} key={index}>
              <Card 
                className={`h-100 border-0 shadow-lg ${tier.popular ? 'transform-scale' : ''}`}
                style={{ 
                  transform: tier.popular ? 'translateY(-20px)' : 'none',
                  zIndex: tier.popular ? 1 : 0,
                  borderTop: tier.popular ? `5px solid var(--hotel-${tier.color})` : 'none'
                }}
              >
                {tier.popular && (
                  <div className="position-absolute top-0 start-50 translate-middle">
                    <Badge bg="primary" className="px-3 py-2 rounded-pill fw-semibold">Most Popular</Badge>
                  </div>
                )}
                <Card.Body className="p-5">
                  <div className="text-center mb-4">
                    <h3 className="mb-1">{tier.name}</h3>
                    <p className="text-muted mb-3">{tier.description}</p>
                    <div className="d-flex align-items-center justify-content-center">
                      {tier.price > 0 && <span className="h4 mb-0 me-1">$</span>}
                      <span className="display-4 fw-bold">{tier.price > 0 ? tier.price : 'Free'}</span>
                      {tier.price > 0 && <span className="text-muted ms-2">{tier.period}</span>}
                    </div>
                  </div>
                  
                  <ul className="list-unstyled mb-4">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="mb-3 d-flex align-items-center">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="d-grid">
                    <Link to={isAuthenticated ? '/dashboard' : '/register'}>
                      <Button
                        variant={tier.popular ? tier.color : 'outline-primary'}
                        size="lg"
                        className="fw-semibold"
                      >
                        {tier.cta}
                      </Button>
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      
      {/* Feature Comparison */}
      <div className="bg-light py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="mb-3">Compare Plans</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '700px' }}>
              A detailed breakdown of all features available in each plan to help you make the right choice.
            </p>
          </div>
          
          <div className="table-responsive">
            <Table className="border-0 bg-white shadow-sm rounded-3 overflow-hidden">
              <thead>
                <tr className="bg-light">
                  <th style={{ width: '40%' }}>Feature</th>
                  <th className="text-center">Basic</th>
                  <th className="text-center">Premium</th>
                  <th className="text-center">Business</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Hotel & Resort Browsing</td>
                  <td className="text-center"><i className="bi bi-check-lg text-success"></i></td>
                  <td className="text-center"><i className="bi bi-check-lg text-success"></i></td>
                  <td className="text-center"><i className="bi bi-check-lg text-success"></i></td>
                </tr>
                <tr>
                  <td>Reviews Access</td>
                  <td className="text-center"><i className="bi bi-check-lg text-success"></i></td>
                  <td className="text-center"><i className="bi bi-check-lg text-success"></i></td>
                  <td className="text-center"><i className="bi bi-check-lg text-success"></i></td>
                </tr>
                <tr>
                  <td>Loyalty Points</td>
                  <td className="text-center">1x</td>
                  <td className="text-center">2x</td>
                  <td className="text-center">3x</td>
                </tr>
                <tr>
                  <td>Early Access to Deals</td>
                  <td className="text-center"><i className="bi bi-x-lg text-danger"></i></td>
                  <td className="text-center"><i className="bi bi-check-lg text-success"></i></td>
                  <td className="text-center"><i className="bi bi-check-lg text-success"></i></td>
                </tr>
                <tr>
                  <td>Price Alerts</td>
                  <td className="text-center"><i className="bi bi-x-lg text-danger"></i></td>
                  <td className="text-center"><i className="bi bi-check-lg text-success"></i></td>
                  <td className="text-center"><i className="bi bi-check-lg text-success"></i></td>
                </tr>
                <tr>
                  <td>Free Cancellations</td>
                  <td className="text-center"><i className="bi bi-x-lg text-danger"></i></td>
                  <td className="text-center"><i className="bi bi-check-lg text-success"></i></td>
                  <td className="text-center"><i className="bi bi-check-lg text-success"></i></td>
                </tr>
                <tr>
                  <td>Priority Support</td>
                  <td className="text-center"><i className="bi bi-x-lg text-danger"></i></td>
                  <td className="text-center"><i className="bi bi-check-lg text-success"></i></td>
                  <td className="text-center"><i className="bi bi-check-lg text-success"></i></td>
                </tr>
                <tr>
                  <td>Team Management</td>
                  <td className="text-center"><i className="bi bi-x-lg text-danger"></i></td>
                  <td className="text-center"><i className="bi bi-x-lg text-danger"></i></td>
                  <td className="text-center"><i className="bi bi-check-lg text-success"></i></td>
                </tr>
                <tr>
                  <td>Dedicated Account Manager</td>
                  <td className="text-center"><i className="bi bi-x-lg text-danger"></i></td>
                  <td className="text-center"><i className="bi bi-x-lg text-danger"></i></td>
                  <td className="text-center"><i className="bi bi-check-lg text-success"></i></td>
                </tr>
                <tr>
                  <td>API Access</td>
                  <td className="text-center"><i className="bi bi-x-lg text-danger"></i></td>
                  <td className="text-center"><i className="bi bi-x-lg text-danger"></i></td>
                  <td className="text-center"><i className="bi bi-check-lg text-success"></i></td>
                </tr>
                <tr>
                  <td>Business Travel Reports</td>
                  <td className="text-center"><i className="bi bi-x-lg text-danger"></i></td>
                  <td className="text-center"><i className="bi bi-x-lg text-danger"></i></td>
                  <td className="text-center"><i className="bi bi-check-lg text-success"></i></td>
                </tr>
              </tbody>
            </Table>
          </div>
        </Container>
      </div>
      
      {/* FAQs Section */}
      <Container className="py-5">
        <div className="text-center mb-5">
          <h2 className="mb-3">Frequently Asked Questions</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '700px' }}>
            Find answers to common questions about our pricing plans and features.
          </p>
        </div>
        
        <Row className="g-4">
          {faqs.map((faq, index) => (
            <Col md={6} key={index}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <h5 className="mb-3">{faq.question}</h5>
                  <p className="text-muted mb-0">{faq.answer}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      
      {/* Call to Action */}
      <div className="py-5 bg-primary text-white">
        <Container className="py-4 text-center">
          <h2 className="mb-4">Ready to experience StayHaven?</h2>
          <p className="lead mb-4 mx-auto" style={{ maxWidth: '700px' }}>
            Start your journey with a free account today. No credit card required.
          </p>
          <div>
            <Link to="/register">
              <Button variant="light" size="lg" className="fw-semibold me-3">
                Create Free Account
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline-light" size="lg">
                Contact Sales
              </Button>
            </Link>
          </div>
        </Container>
      </div>
      
      <Footer />
    </div>
  );
};

export default Pricing;
