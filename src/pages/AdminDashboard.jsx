
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Container, Row, Col, Nav, Tab, Button, Spinner, Table, Form, Modal } from 'react-bootstrap';
import { hotelAPI, moderatorAPI, userAPI } from '@/services/api';
import AuthGuard from '@/components/AuthGuard';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const { state } = useAuth();
  const { user, loading } = state;
  const [activeTab, setActiveTab] = useState('users');
  
  // State for CRUD operations
  const [users, setUsers] = useState([]);
  const [moderators, setModerators] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  
  // Modal states
  const [userModalShow, setUserModalShow] = useState(false);
  const [moderatorModalShow, setModeratorModalShow] = useState(false);
  const [hotelModalShow, setHotelModalShow] = useState(false);
  
  // Form states
  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    password: '',
    country: '',
    city: '',
    phone: '',
    isAdmin: false,
    isModerator: false
  });
  
  const [moderatorForm, setModeratorForm] = useState({
    userId: '',
    hotelId: '',
    permissions: {
      canManageWorkers: true,
      canManageRooms: true,
      canViewBookings: true
    }
  });
  
  const [hotelForm, setHotelForm] = useState({
    name: '',
    type: 'Hotel',
    city: '',
    address: '',
    distance: '',
    title: '',
    desc: '',
    cheapestPrice: 0,
    featured: false
  });
  
  // Edit states
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingModeratorId, setEditingModeratorId] = useState(null);
  const [editingHotelId, setEditingHotelId] = useState(null);

  // Load data when tab changes
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      
      try {
        if (activeTab === 'users' || activeTab === 'moderators') {
          const usersData = await userAPI.getAllUsers();
          setUsers(usersData);
        }
        
        if (activeTab === 'moderators' || activeTab === 'hotels') {
          const moderatorsData = await moderatorAPI.getAllModerators();
          setModerators(moderatorsData);
        }
        
        if (activeTab === 'hotels' || activeTab === 'moderators') {
          const hotelsData = await hotelAPI.getAllHotels();
          setHotels(hotelsData);
        }
      } catch (error) {
        console.error(`Error fetching ${activeTab} data:`, error);
        toast.error(`Failed to load ${activeTab} data`);
      } finally {
        setLoadingData(false);
      }
    };
    
    fetchData();
  }, [activeTab]);

  // Handle user form input changes
  const handleUserFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserForm({
      ...userForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle moderator form input changes
  const handleModeratorFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('permissions.')) {
      const permissionName = name.split('.')[1];
      setModeratorForm({
        ...moderatorForm,
        permissions: {
          ...moderatorForm.permissions,
          [permissionName]: checked
        }
      });
    } else {
      setModeratorForm({
        ...moderatorForm,
        [name]: value
      });
    }
  };

  // Handle hotel form input changes
  const handleHotelFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setHotelForm({
      ...hotelForm,
      [name]: type === 'checkbox' ? checked : 
              name === 'cheapestPrice' ? Number(value) : value
    });
  };

  // Submit user form
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingUserId) {
        // Update user
        const { password, ...userData } = userForm;
        await userAPI.updateUser(editingUserId, userData);
        setUsers(users.map(u => u._id === editingUserId ? { ...u, ...userData } : u));
        toast.success('User updated successfully');
      } else {
        // Create user
        const result = await userAPI.createUser(userForm);
        setUsers([...users, result]);
        toast.success('User created successfully');
      }
      
      setUserModalShow(false);
      setEditingUserId(null);
      setUserForm({
        username: '',
        email: '',
        password: '',
        country: '',
        city: '',
        phone: '',
        isAdmin: false,
        isModerator: false
      });
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('Failed to save user');
    }
  };

  // Submit moderator form
  const handleModeratorSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingModeratorId) {
        // Update moderator
        await moderatorAPI.updateModerator(editingModeratorId, moderatorForm);
        setModerators(moderators.map(m => m._id === editingModeratorId ? { ...m, ...moderatorForm } : m));
        toast.success('Moderator updated successfully');
      } else {
        // Create moderator
        const result = await moderatorAPI.createModerator(moderatorForm);
        setModerators([...moderators, result]);
        toast.success('Moderator created successfully');
      }
      
      setModeratorModalShow(false);
      setEditingModeratorId(null);
      setModeratorForm({
        userId: '',
        hotelId: '',
        permissions: {
          canManageWorkers: true,
          canManageRooms: true,
          canViewBookings: true
        }
      });
    } catch (error) {
      console.error('Error saving moderator:', error);
      toast.error('Failed to save moderator');
    }
  };

  // Submit hotel form
  const handleHotelSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingHotelId) {
        // Update hotel
        await hotelAPI.updateHotel(editingHotelId, hotelForm);
        setHotels(hotels.map(h => h._id === editingHotelId ? { ...h, ...hotelForm } : h));
        toast.success('Hotel updated successfully');
      } else {
        // Create hotel
        const result = await hotelAPI.createHotel(hotelForm);
        setHotels([...hotels, result]);
        toast.success('Hotel created successfully');
      }
      
      setHotelModalShow(false);
      setEditingHotelId(null);
      setHotelForm({
        name: '',
        type: 'Hotel',
        city: '',
        address: '',
        distance: '',
        title: '',
        desc: '',
        cheapestPrice: 0,
        featured: false
      });
    } catch (error) {
      console.error('Error saving hotel:', error);
      toast.error('Failed to save hotel');
    }
  };

  // Edit user
  const handleEditUser = (userData) => {
    setUserForm({
      username: userData.username,
      email: userData.email,
      password: '', // Don't set password for security
      country: userData.country,
      city: userData.city,
      phone: userData.phone || '',
      isAdmin: userData.isAdmin,
      isModerator: userData.isModerator
    });
    
    setEditingUserId(userData._id);
    setUserModalShow(true);
  };

  // Edit moderator
  const handleEditModerator = (moderatorData) => {
    setModeratorForm({
      userId: moderatorData.userId,
      hotelId: moderatorData.hotelId,
      permissions: {
        canManageWorkers: moderatorData.permissions?.canManageWorkers || true,
        canManageRooms: moderatorData.permissions?.canManageRooms || true,
        canViewBookings: moderatorData.permissions?.canViewBookings || true
      }
    });
    
    setEditingModeratorId(moderatorData._id);
    setModeratorModalShow(true);
  };

  // Edit hotel
  const handleEditHotel = (hotelData) => {
    setHotelForm({
      name: hotelData.name,
      type: hotelData.type,
      city: hotelData.city,
      address: hotelData.address,
      distance: hotelData.distance,
      title: hotelData.title,
      desc: hotelData.desc,
      cheapestPrice: hotelData.cheapestPrice,
      featured: hotelData.featured
    });
    
    setEditingHotelId(hotelData._id);
    setHotelModalShow(true);
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    try {
      await userAPI.deleteUser(userId);
      setUsers(users.filter(u => u._id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  // Delete moderator
  const handleDeleteModerator = async (moderatorId) => {
    try {
      await moderatorAPI.deleteModerator(moderatorId);
      setModerators(moderators.filter(m => m._id !== moderatorId));
      toast.success('Moderator deleted successfully');
    } catch (error) {
      console.error('Error deleting moderator:', error);
      toast.error('Failed to delete moderator');
    }
  };

  // Delete hotel
  const handleDeleteHotel = async (hotelId) => {
    try {
      await hotelAPI.deleteHotel(hotelId);
      setHotels(hotels.filter(h => h._id !== hotelId));
      toast.success('Hotel deleted successfully');
    } catch (error) {
      console.error('Error deleting hotel:', error);
      toast.error('Failed to delete hotel');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <AuthGuard requireAdmin={true}>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        
        <main className="flex-grow-1 py-5 bg-light">
          <Container>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
              <div>
                <h1 className="mb-2">Admin Dashboard</h1>
                <p className="text-muted">Manage all aspects of your hotel system.</p>
              </div>
              
              <div className="d-flex mt-3 mt-md-0">
                <Button variant="outline-primary" className="me-2">Export Data</Button>
                <Button variant="primary">System Settings</Button>
              </div>
            </div>
            
            <Tab.Container id="admin-tabs" activeKey={activeTab} onSelect={setActiveTab}>
              <Nav variant="tabs" className="mb-4">
                <Nav.Item>
                  <Nav.Link eventKey="users">Users</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="hotels">Hotels</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="rooms">Rooms</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="bookings">Bookings</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="moderators">Moderators</Nav.Link>
                </Nav.Item>
              </Nav>
              <Tab.Content>
                <Tab.Pane eventKey="users">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>User Management</h2>
                    <Button 
                      variant="primary"
                      onClick={() => {
                        setEditingUserId(null);
                        setUserForm({
                          username: '',
                          email: '',
                          password: '',
                          country: '',
                          city: '',
                          phone: '',
                          isAdmin: false,
                          isModerator: false
                        });
                        setUserModalShow(true);
                      }}
                    >
                      <i className="bi bi-person-plus me-2"></i>
                      Add User
                    </Button>
                  </div>
                  
                  {loadingData ? (
                    <div className="d-flex justify-content-center align-items-center py-5">
                      <Spinner animation="border" variant="primary" size="sm" className="me-2" />
                      <span>Loading users...</span>
                    </div>
                  ) : (
                    <div className="bg-white rounded shadow-sm">
                      <Table hover responsive>
                        <thead className="table-light">
                          <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Location</th>
                            <th>Role</th>
                            <th className="text-end">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user) => (
                            <tr key={user._id}>
                              <td className="align-middle">{user.username}</td>
                              <td className="align-middle">{user.email}</td>
                              <td className="align-middle">{user.city}, {user.country}</td>
                              <td className="align-middle">
                                {user.isAdmin ? (
                                  <span className="badge bg-danger">Admin</span>
                                ) : user.isModerator ? (
                                  <span className="badge bg-info">Moderator</span>
                                ) : (
                                  <span className="badge bg-secondary">User</span>
                                )}
                              </td>
                              <td className="text-end">
                                <Button 
                                  variant="link" 
                                  className="p-1 text-primary"
                                  onClick={() => handleEditUser(user)}
                                >
                                  <i className="bi bi-pencil-square"></i>
                                </Button>
                                <Button 
                                  variant="link" 
                                  className="p-1 text-danger"
                                  onClick={() => handleDeleteUser(user._id)}
                                >
                                  <i className="bi bi-trash"></i>
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </Tab.Pane>
                
                <Tab.Pane eventKey="hotels">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Hotel Management</h2>
                    <Button 
                      variant="primary"
                      onClick={() => {
                        setEditingHotelId(null);
                        setHotelForm({
                          name: '',
                          type: 'Hotel',
                          city: '',
                          address: '',
                          distance: '',
                          title: '',
                          desc: '',
                          cheapestPrice: 0,
                          featured: false
                        });
                        setHotelModalShow(true);
                      }}
                    >
                      <i className="bi bi-plus-lg me-2"></i>
                      Add Hotel
                    </Button>
                  </div>
                  
                  {loadingData ? (
                    <div className="d-flex justify-content-center align-items-center py-5">
                      <Spinner animation="border" variant="primary" size="sm" className="me-2" />
                      <span>Loading hotels...</span>
                    </div>
                  ) : (
                    <div className="bg-white rounded shadow-sm">
                      <Table hover responsive>
                        <thead className="table-light">
                          <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Location</th>
                            <th>Price</th>
                            <th>Rating</th>
                            <th className="text-end">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {hotels.map((hotel) => (
                            <tr key={hotel._id}>
                              <td className="align-middle">{hotel.name}</td>
                              <td className="align-middle">{hotel.type}</td>
                              <td className="align-middle">{hotel.city}</td>
                              <td className="align-middle">${hotel.cheapestPrice}</td>
                              <td className="align-middle">{hotel.rating}/5</td>
                              <td className="text-end">
                                <Button 
                                  variant="link" 
                                  className="p-1 text-primary"
                                  onClick={() => handleEditHotel(hotel)}
                                >
                                  <i className="bi bi-pencil-square"></i>
                                </Button>
                                <Button 
                                  variant="link" 
                                  className="p-1 text-danger"
                                  onClick={() => handleDeleteHotel(hotel._id)}
                                >
                                  <i className="bi bi-trash"></i>
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </Tab.Pane>
                
                <Tab.Pane eventKey="rooms">
                  <div className="py-5 text-center">
                    <h2 className="mb-4">Room Management</h2>
                    <p>Room management interface will be implemented here.</p>
                  </div>
                </Tab.Pane>
                
                <Tab.Pane eventKey="bookings">
                  <div className="py-5 text-center">
                    <h2 className="mb-4">Booking Management</h2>
                    <p>Booking management interface will be implemented here.</p>
                  </div>
                </Tab.Pane>
                
                <Tab.Pane eventKey="moderators">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Moderator Management</h2>
                    <Button 
                      variant="primary"
                      onClick={() => {
                        setEditingModeratorId(null);
                        setModeratorForm({
                          userId: '',
                          hotelId: '',
                          permissions: {
                            canManageWorkers: true,
                            canManageRooms: true,
                            canViewBookings: true
                          }
                        });
                        setModeratorModalShow(true);
                      }}
                    >
                      <i className="bi bi-shield-check me-2"></i>
                      Add Moderator
                    </Button>
                  </div>
                  
                  {loadingData ? (
                    <div className="d-flex justify-content-center align-items-center py-5">
                      <Spinner animation="border" variant="primary" size="sm" className="me-2" />
                      <span>Loading moderators...</span>
                    </div>
                  ) : (
                    <div className="bg-white rounded shadow-sm">
                      <Table hover responsive>
                        <thead className="table-light">
                          <tr>
                            <th>User</th>
                            <th>Assigned Hotel</th>
                            <th>Status</th>
                            <th>Permissions</th>
                            <th className="text-end">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {moderators.map((moderator) => {
                            const assignedHotel = hotels.find(h => h._id === moderator.hotelId);
                            const modUser = users.find(u => u._id === moderator.userId);
                            
                            return (
                              <tr key={moderator._id}>
                                <td className="align-middle">
                                  {modUser ? modUser.username : moderator.userId}
                                </td>
                                <td className="align-middle">
                                  {assignedHotel ? assignedHotel.name : moderator.hotelId}
                                </td>
                                <td className="align-middle">
                                  {moderator.isActive ? (
                                    <span className="badge bg-success">Active</span>
                                  ) : (
                                    <span className="badge bg-secondary">Inactive</span>
                                  )}
                                </td>
                                <td className="align-middle">
                                  <div className="d-flex flex-wrap gap-1">
                                    {moderator.permissions?.canManageWorkers && (
                                      <span className="badge bg-info">Workers</span>
                                    )}
                                    {moderator.permissions?.canManageRooms && (
                                      <span className="badge bg-primary">Rooms</span>
                                    )}
                                    {moderator.permissions?.canViewBookings && (
                                      <span className="badge bg-warning">Bookings</span>
                                    )}
                                  </div>
                                </td>
                                <td className="text-end">
                                  <Button 
                                    variant="link" 
                                    className="p-1 text-primary"
                                    onClick={() => handleEditModerator(moderator)}
                                  >
                                    <i className="bi bi-pencil-square"></i>
                                  </Button>
                                  <Button 
                                    variant="link" 
                                    className="p-1 text-danger"
                                    onClick={() => handleDeleteModerator(moderator._id)}
                                  >
                                    <i className="bi bi-trash"></i>
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Container>
        </main>
        
        <Footer />
        
        {/* User Modal */}
        <Modal show={userModalShow} onHide={() => setUserModalShow(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{editingUserId ? 'Edit User' : 'Add New User'}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleUserSubmit}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  name="username"
                  value={userForm.username}
                  onChange={handleUserFormChange}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  name="email"
                  type="email"
                  value={userForm.email}
                  onChange={handleUserFormChange}
                  required
                />
              </Form.Group>
              
              {!editingUserId && (
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    name="password"
                    type="password"
                    value={userForm.password}
                    onChange={handleUserFormChange}
                    required={!editingUserId}
                  />
                </Form.Group>
              )}
              
              <Form.Group className="mb-3">
                <Form.Label>Country</Form.Label>
                <Form.Control
                  name="country"
                  value={userForm.country}
                  onChange={handleUserFormChange}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>City</Form.Label>
                <Form.Control
                  name="city"
                  value={userForm.city}
                  onChange={handleUserFormChange}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  name="phone"
                  type="tel"
                  value={userForm.phone}
                  onChange={handleUserFormChange}
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Roles</Form.Label>
                <div>
                  <Form.Check
                    type="checkbox"
                    label="Admin"
                    name="isAdmin"
                    checked={userForm.isAdmin}
                    onChange={handleUserFormChange}
                    className="mb-2"
                  />
                  <Form.Check
                    type="checkbox"
                    label="Moderator"
                    name="isModerator"
                    checked={userForm.isModerator}
                    onChange={handleUserFormChange}
                  />
                </div>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setUserModalShow(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {editingUserId ? 'Update User' : 'Add User'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
        
        {/* Moderator Modal */}
        <Modal show={moderatorModalShow} onHide={() => setModeratorModalShow(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{editingModeratorId ? 'Edit Moderator' : 'Add New Moderator'}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleModeratorSubmit}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>User</Form.Label>
                <Form.Select
                  name="userId"
                  value={moderatorForm.userId}
                  onChange={handleModeratorFormChange}
                  required
                >
                  <option value="">Select a user</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.username} ({user.email})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Hotel</Form.Label>
                <Form.Select
                  name="hotelId"
                  value={moderatorForm.hotelId}
                  onChange={handleModeratorFormChange}
                  required
                >
                  <option value="">Select a hotel</option>
                  {hotels.map((hotel) => (
                    <option key={hotel._id} value={hotel._id}>
                      {hotel.name} ({hotel.city})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Permissions</Form.Label>
                <div>
                  <Form.Check
                    type="checkbox"
                    label="Manage Workers"
                    name="permissions.canManageWorkers"
                    checked={moderatorForm.permissions.canManageWorkers}
                    onChange={handleModeratorFormChange}
                    className="mb-2"
                  />
                  <Form.Check
                    type="checkbox"
                    label="Manage Rooms"
                    name="permissions.canManageRooms"
                    checked={moderatorForm.permissions.canManageRooms}
                    onChange={handleModeratorFormChange}
                    className="mb-2"
                  />
                  <Form.Check
                    type="checkbox"
                    label="View Bookings"
                    name="permissions.canViewBookings"
                    checked={moderatorForm.permissions.canViewBookings}
                    onChange={handleModeratorFormChange}
                  />
                </div>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setModeratorModalShow(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {editingModeratorId ? 'Update Moderator' : 'Add Moderator'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
        
        {/* Hotel Modal */}
        <Modal show={hotelModalShow} onHide={() => setHotelModalShow(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{editingHotelId ? 'Edit Hotel' : 'Add New Hotel'}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleHotelSubmit}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  name="name"
                  value={hotelForm.name}
                  onChange={handleHotelFormChange}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Type</Form.Label>
                <Form.Select
                  name="type"
                  value={hotelForm.type}
                  onChange={handleHotelFormChange}
                  required
                >
                  <option value="Hotel">Hotel</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Resort">Resort</option>
                  <option value="Villa">Villa</option>
                  <option value="Cabin">Cabin</option>
                </Form.Select>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>City</Form.Label>
                <Form.Control
                  name="city"
                  value={hotelForm.city}
                  onChange={handleHotelFormChange}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  name="address"
                  value={hotelForm.address}
                  onChange={handleHotelFormChange}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Distance</Form.Label>
                <Form.Control
                  name="distance"
                  value={hotelForm.distance}
                  onChange={handleHotelFormChange}
                  placeholder="e.g. 500m from center"
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  name="title"
                  value={hotelForm.title}
                  onChange={handleHotelFormChange}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="desc"
                  value={hotelForm.desc}
                  onChange={handleHotelFormChange}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  name="cheapestPrice"
                  type="number"
                  value={hotelForm.cheapestPrice}
                  onChange={handleHotelFormChange}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Featured Hotel"
                  name="featured"
                  checked={hotelForm.featured}
                  onChange={handleHotelFormChange}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setHotelModalShow(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {editingHotelId ? 'Update Hotel' : 'Add Hotel'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    </AuthGuard>
  );
};

export default AdminDashboard;
