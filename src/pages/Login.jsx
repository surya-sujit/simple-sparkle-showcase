
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Login = () => {
  const { login, state } = useAuth();
  const { isAuthenticated, loading, error } = state;
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData.email, formData.password);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      
      <main className="flex-grow-1 d-flex align-items-center py-5 bg-light">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="border-0 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="bg-primary text-white p-4 text-center">
                  <i className="bi bi-building fs-1 mb-2"></i>
                  <h1 className="h3 mb-1">Welcome Back</h1>
                  <p className="mb-0 opacity-75">Sign in to your StayHaven account</p>
                </div>
                
                {/* Form */}
                <Card.Body className="p-4">
                  {error && (
                    <Alert variant="danger">
                      {error}
                    </Alert>
                  )}
                  
                  <Form onSubmit={handleSubmit} className="mt-2">
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <Form.Label>Password</Form.Label>
                        <Link 
                          to="/forgot-password" 
                          className="small text-decoration-none"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      
                      <div className="input-group">
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Enter your password"
                          required
                        />
                        <Button 
                          variant="outline-secondary"
                          onClick={toggleShowPassword}
                        >
                          <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                        </Button>
                      </div>
                    </Form.Group>
                    
                    <Button
                      type="submit"
                      variant="primary"
                      className="w-100 mt-3"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Signing in...
                        </>
                      ) : "Sign In"}
                    </Button>
                    
                    <div className="text-center mt-4">
                      <p className="text-muted mb-0">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-decoration-none">
                          Sign up
                        </Link>
                      </p>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
              
              {/* Demo accounts */}
              <div className="mt-4">
                <Card className="border-0 shadow-sm">
                  <Card.Body>
                    <h5 className="card-title mb-3">Demo Accounts</h5>
                    <Row>
                      <Col md={4} className="mb-3 mb-md-0">
                        <div className="border rounded p-2">
                          <p className="fw-bold mb-1">Regular User</p>
                          <p className="small mb-0">email: user@example.com</p>
                          <p className="small mb-0">password: password123</p>
                        </div>
                      </Col>
                      <Col md={4} className="mb-3 mb-md-0">
                        <div className="border rounded p-2">
                          <p className="fw-bold mb-1">Moderator</p>
                          <p className="small mb-0">email: mod@example.com</p>
                          <p className="small mb-0">password: password123</p>
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="border rounded p-2">
                          <p className="fw-bold mb-1">Admin</p>
                          <p className="small mb-0">email: admin@example.com</p>
                          <p className="small mb-0">password: password123</p>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
                
                <Alert variant="info" className="mt-3 mb-0">
                  <div className="d-flex">
                    <i className="bi bi-info-circle me-2 fs-5"></i>
                    <div>
                      <strong>Dashboard Access:</strong> After login, admin and moderator users can access their respective dashboards from the user menu in the top-right corner or from the user dashboard.
                    </div>
                  </div>
                </Alert>
              </div>
            </Col>
          </Row>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
