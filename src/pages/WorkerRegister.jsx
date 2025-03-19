
import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';

const WorkerRegister = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    registrationCode: '',
    hotelId: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    
    // Clear error for the field when user types
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.registrationCode) {
      newErrors.registrationCode = 'Registration code is required';
    } else if (formData.registrationCode !== 'WORKER123') { // Simple mock validation
      newErrors.registrationCode = 'Invalid registration code';
    }
    
    if (!formData.hotelId) {
      newErrors.hotelId = 'Hotel ID is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // This is a mock worker registration for demonstration
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Include worker role in user data
      const userData = {
        username: formData.username,
        email: formData.email,
        isAdmin: false,
        isWorker: true,
        isModerator: false,
        hotelId: formData.hotelId
      };
      
      await register(userData);
      toast.success('Worker registration successful');
      navigate('/worker');
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({
        form: 'Registration failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      
      <Container className="flex-grow-1 py-5 mt-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <h2 className="h3 mb-1">Hotel Worker Registration</h2>
                  <p className="text-muted">Create a new worker account</p>
                </div>
                
                {errors.form && <Alert variant="danger">{errors.form}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Choose a username"
                      isInvalid={!!errors.username}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.username}
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      isInvalid={!!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      isInvalid={!!errors.confirmPassword}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.confirmPassword}
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Hotel ID</Form.Label>
                    <Form.Control
                      type="text"
                      name="hotelId"
                      value={formData.hotelId}
                      onChange={handleChange}
                      placeholder="Enter hotel ID"
                      isInvalid={!!errors.hotelId}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.hotelId}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      Enter the ID of the hotel you work for.
                    </Form.Text>
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label>Worker Registration Code</Form.Label>
                    <Form.Control
                      type="text"
                      name="registrationCode"
                      value={formData.registrationCode}
                      onChange={handleChange}
                      placeholder="Enter registration code"
                      isInvalid={!!errors.registrationCode}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.registrationCode}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      This code is provided by hotel managers.
                    </Form.Text>
                  </Form.Group>
                  
                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100 py-2 mb-3"
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Register as Worker'}
                  </Button>
                  
                  <div className="text-center">
                    <p className="text-muted mb-0">Already have an account?{' '}
                      <Link to="/worker-login" className="text-decoration-none">
                        Worker Login
                      </Link>
                    </p>
                  </div>
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

export default WorkerRegister;
