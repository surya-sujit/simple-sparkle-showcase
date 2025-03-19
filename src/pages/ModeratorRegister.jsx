
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Card, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { toast } from 'sonner';
import { authAPI, moderatorAPI, hotelAPI } from '../services/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ModeratorRegister = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    country: '',
    city: '',
    phone: '',
    assignedHotels: []
  });
  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHotels, setIsLoadingHotels] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setIsLoadingHotels(true);
        const hotelsData = await hotelAPI.getAllHotels();
        setHotels(hotelsData);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      } finally {
        setIsLoadingHotels(false);
      }
    };

    fetchHotels();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleHotelChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setFormData({
      ...formData,
      assignedHotels: selectedOptions
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { username, email, password, country, city, phone, assignedHotels } = formData;
    
    if (!username || !email || !password || !country || !city) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      // First register user
      const userResponse = await authAPI.register({
        username,
        email,
        password,
        country,
        city,
        phone
      });
      
      if (userResponse.user && userResponse.user._id) {
        // Then create moderator profile
        await moderatorAPI.createModerator({
          userId: userResponse.user._id,
          isActive: true,
          assignedHotels,
          permissions: {
            canManageWorkers: true,
            canManageRooms: true,
            canViewBookings: true
          }
        });
        
        toast.success('Moderator registered successfully');
        navigate('/moderator-login');
      }
    } catch (error) {
      setError(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      
      <div className="flex-grow-1 d-flex align-items-center justify-content-center bg-light py-5">
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <Card className="shadow border-0">
                <Card.Body className="p-4">
                  <h2 className="text-center mb-4">Moderator Registration</h2>
                  
                  {error && (
                    <Alert variant="danger" className="mb-4">
                      {error}
                    </Alert>
                  )}
                  
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Username*</Form.Label>
                          <Form.Control
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email*</Form.Label>
                          <Form.Control
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Password*</Form.Label>
                      <Form.Control
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Country*</Form.Label>
                          <Form.Control
                            name="country"
                            type="text"
                            value={formData.country}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>City*</Form.Label>
                          <Form.Control
                            name="city"
                            type="text"
                            value={formData.city}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        name="phone"
                        type="text"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-4">
                      <Form.Label>
                        Assigned Hotels
                        {isLoadingHotels && (
                          <Spinner 
                            animation="border" 
                            size="sm" 
                            className="ms-2" 
                          />
                        )}
                      </Form.Label>
                      <Form.Select
                        name="assignedHotels"
                        multiple
                        value={formData.assignedHotels}
                        onChange={handleHotelChange}
                        style={{ height: '150px' }}
                      >
                        {hotels.map(hotel => (
                          <option key={hotel._id} value={hotel._id}>
                            {hotel.name} - {hotel.city}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Text className="text-muted">
                        Hold Ctrl/Cmd to select multiple hotels
                      </Form.Text>
                    </Form.Group>
                    
                    <Button
                      type="submit"
                      variant="primary"
                      className="w-100"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Registering...
                        </>
                      ) : (
                        'Register Moderator'
                      )}
                    </Button>
                  </Form>
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

export default ModeratorRegister;
