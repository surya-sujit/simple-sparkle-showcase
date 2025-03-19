
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Register = () => {
  const { register, state } = useAuth();
  const { isAuthenticated, loading, error } = state;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
    city: '',
    phone: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Check password strength
  useEffect(() => {
    const errors = [];
    let strength = 0;
    
    if (formData.password.length === 0) {
      setPasswordStrength(0);
      return;
    }
    
    // Length check
    if (formData.password.length < 8) {
      errors.push("Password must be at least 8 characters");
    } else {
      strength += 1;
    }
    
    // Uppercase check
    if (!/[A-Z]/.test(formData.password)) {
      errors.push("Password must contain at least one uppercase letter");
    } else {
      strength += 1;
    }
    
    // Lowercase check
    if (!/[a-z]/.test(formData.password)) {
      errors.push("Password must contain at least one lowercase letter");
    } else {
      strength += 1;
    }
    
    // Number check
    if (!/[0-9]/.test(formData.password)) {
      errors.push("Password must contain at least one number");
    } else {
      strength += 1;
    }
    
    setPasswordErrors(errors);
    setPasswordStrength(strength);
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear field error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear field error
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Username validation
    if (formData.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    // Password validation
    if (passwordErrors.length > 0) {
      errors.password = "Please fix password issues";
    }
    
    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    // Country validation
    if (!formData.country) {
      errors.country = "Please select a country";
    }
    
    // City validation
    if (!formData.city) {
      errors.city = "Please enter a city";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const { confirmPassword, ...userData } = formData;
    await register(userData);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      
      <main className="flex-grow-1 py-5 bg-light">
        <Container>
          <Row className="justify-content-center">
            <Col md={10} lg={8}>
              <Card className="shadow border-0 animate-fade-in-up">
                {/* Header */}
                <Card.Header className="bg-primary text-white text-center p-4">
                  <i className="bi bi-building mb-2 d-block fs-3"></i>
                  <h2 className="mb-1">Create an Account</h2>
                  <p className="mb-0">Join StayHaven to start booking your perfect stays</p>
                </Card.Header>
                
                {/* Form */}
                <Card.Body className="p-4">
                  {error && (
                    <Alert variant="danger">
                      {error}
                    </Alert>
                  )}
                  
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      {/* Username */}
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Username</Form.Label>
                          <Form.Control
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter your username"
                            required
                            isInvalid={!!formErrors.username}
                          />
                          <Form.Control.Feedback type="invalid">
                            {formErrors.username}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      
                      {/* Email */}
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                            isInvalid={!!formErrors.email}
                          />
                          <Form.Control.Feedback type="invalid">
                            {formErrors.email}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      
                      {/* Password */}
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Password</Form.Label>
                          <div className="position-relative">
                            <Form.Control
                              name="password"
                              type={showPassword ? "text" : "password"}
                              value={formData.password}
                              onChange={handleChange}
                              placeholder="Create a password"
                              required
                              isInvalid={!!formErrors.password}
                            />
                            <Button 
                              variant="link" 
                              className="position-absolute end-0 top-0 text-secondary border-0" 
                              onClick={toggleShowPassword}
                              style={{ padding: '0.4rem 0.75rem', height: '100%' }}
                            >
                              <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                            </Button>
                            <Form.Control.Feedback type="invalid">
                              {formErrors.password}
                            </Form.Control.Feedback>
                          </div>
                          
                          {/* Password strength indicator */}
                          {formData.password && (
                            <div className="mt-2">
                              <div className="d-flex gap-1 mb-1" style={{ height: '4px' }}>
                                <div 
                                  className={`flex-grow-1 rounded ${
                                    passwordStrength > 0 ? 'bg-danger' : 'bg-secondary opacity-25'
                                  }`}
                                ></div>
                                <div 
                                  className={`flex-grow-1 rounded ${
                                    passwordStrength > 1 ? 'bg-warning' : 'bg-secondary opacity-25'
                                  }`}
                                ></div>
                                <div 
                                  className={`flex-grow-1 rounded ${
                                    passwordStrength > 2 ? 'bg-warning' : 'bg-secondary opacity-25'
                                  }`}
                                ></div>
                                <div 
                                  className={`flex-grow-1 rounded ${
                                    passwordStrength > 3 ? 'bg-success' : 'bg-secondary opacity-25'
                                  }`}
                                ></div>
                              </div>
                              
                              {passwordErrors.length > 0 && (
                                <ul className="small text-muted ps-3 mb-0">
                                  {passwordErrors.map((error, index) => (
                                    <li key={index} className="d-flex align-items-start">
                                      <i className="bi bi-exclamation-circle text-danger me-1 mt-1 small"></i>
                                      <span>{error}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                              
                              {passwordErrors.length === 0 && (
                                <p className="small text-success d-flex align-items-center mb-0">
                                  <i className="bi bi-check-circle me-1"></i>
                                  Password meets all requirements
                                </p>
                              )}
                            </div>
                          )}
                        </Form.Group>
                      </Col>
                      
                      {/* Confirm Password */}
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Confirm Password</Form.Label>
                          <div className="position-relative">
                            <Form.Control
                              name="confirmPassword"
                              type={showPassword ? "text" : "password"}
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              placeholder="Confirm your password"
                              required
                              isInvalid={!!formErrors.confirmPassword}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formErrors.confirmPassword}
                            </Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>
                      
                      {/* Country */}
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Country</Form.Label>
                          <Form.Select
                            name="country"
                            value={formData.country}
                            onChange={(e) => handleSelectChange('country', e.target.value)}
                            isInvalid={!!formErrors.country}
                          >
                            <option value="">Select your country</option>
                            <option value="United States">United States</option>
                            <option value="Canada">Canada</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Australia">Australia</option>
                            <option value="Germany">Germany</option>
                            <option value="France">France</option>
                            <option value="Japan">Japan</option>
                            <option value="China">China</option>
                            <option value="India">India</option>
                            <option value="Brazil">Brazil</option>
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {formErrors.country}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      
                      {/* City */}
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>City</Form.Label>
                          <Form.Control
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="Enter your city"
                            required
                            isInvalid={!!formErrors.city}
                          />
                          <Form.Control.Feedback type="invalid">
                            {formErrors.city}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      
                      {/* Phone */}
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Phone (optional)</Form.Label>
                          <Form.Control
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Button
                      type="submit"
                      variant="primary"
                      className="w-100 mt-3 py-2"
                      disabled={loading}
                    >
                      {loading ? "Creating Account..." : "Create Account"}
                    </Button>
                    
                    <p className="text-center mt-3 mb-0">
                      Already have an account?{' '}
                      <Link to="/login" className="text-primary">
                        Sign in
                      </Link>
                    </p>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
