
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Card, Spinner, Alert } from 'react-bootstrap';
import { toast } from 'sonner';
import { authAPI } from '../services/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ModeratorLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      const response = await authAPI.login(email, password);
      
      if (response.user && (response.user.isModerator || response.user.isAdmin)) {
        toast.success('Moderator login successful');
        navigate('/moderator');
      } else {
        setError('You do not have moderator privileges');
      }
    } catch (error) {
      setError(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      
      <div className="flex-grow-1 d-flex align-items-center justify-content-center bg-light py-5">
        <Container className="py-5">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <Card className="shadow border-0">
                <Card.Body className="p-4">
                  <h2 className="text-center mb-4">Moderator Login</h2>
                  
                  {error && (
                    <Alert variant="danger" className="mb-4">
                      {error}
                    </Alert>
                  )}
                  
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="moderator@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-4">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
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
                          Logging in...
                        </>
                      ) : (
                        'Login as Moderator'
                      )}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </div>
          </div>
        </Container>
      </div>
      
      <Footer />
    </div>
  );
};

export default ModeratorLogin;
