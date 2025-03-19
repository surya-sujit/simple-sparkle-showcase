
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Navbar as BootstrapNavbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';

const Navbar = () => {
  const { state, logout } = useAuth();
  const { user, isAuthenticated } = state;
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const closeNavbar = () => setExpanded(false);

  return (
    <BootstrapNavbar 
      expand="lg" 
      className="navbar-hotel py-3 fixed-top"
      expanded={expanded} 
      onToggle={setExpanded}
    >
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="fs-4 fw-bold text-primary">
          StayHaven
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" onClick={closeNavbar}>Home</Nav.Link>
            <Nav.Link as={Link} to="/hotels" onClick={closeNavbar}>Hotels</Nav.Link>
            <Nav.Link as={Link} to="/about" onClick={closeNavbar}>About</Nav.Link>
            <Nav.Link as={Link} to="/pricing" onClick={closeNavbar}>Pricing</Nav.Link>
          </Nav>
          
          <Nav>
            {isAuthenticated ? (
              <>
                <NavDropdown 
                  title={
                    <span className="d-inline-flex align-items-center">
                      <span className="me-2">{user.username || 'User'}</span>
                    </span>
                  } 
                  id="user-dropdown"
                >
                  <NavDropdown.Item as={Link} to="/dashboard" onClick={closeNavbar}>
                    My Dashboard
                  </NavDropdown.Item>
                  
                  {/* Admin option */}
                  {user.isAdmin && (
                    <NavDropdown.Item as={Link} to="/admin" onClick={closeNavbar}>
                      Admin Panel
                    </NavDropdown.Item>
                  )}
                  
                  {/* Moderator option */}
                  {user.isModerator && (
                    <NavDropdown.Item as={Link} to="/moderator" onClick={closeNavbar}>
                      Moderator Panel
                    </NavDropdown.Item>
                  )}
                  
                  {/* Worker option */}
                  {user.isWorker && (
                    <NavDropdown.Item as={Link} to="/worker" onClick={closeNavbar}>
                      Worker Panel
                    </NavDropdown.Item>
                  )}
                  
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={() => { handleLogout(); closeNavbar(); }}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" onClick={closeNavbar}>
                  <Button variant="outline-primary" className="me-2">Login</Button>
                </Nav.Link>
                <Nav.Link as={Link} to="/register" onClick={closeNavbar}>
                  <Button variant="primary">Register</Button>
                </Nav.Link>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
