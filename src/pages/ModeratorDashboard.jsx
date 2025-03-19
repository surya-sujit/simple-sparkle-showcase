
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { hotelAPI, roomAPI, userAPI, workerAPI, bookingAPI } from '@/services/api';
import { toast } from 'sonner';

const ModeratorDashboard = () => {
  const { state } = useAuth();
  const { user } = state;
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Worker state
  const [isWorkerDialogOpen, setIsWorkerDialogOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [workerFormData, setWorkerFormData] = useState({
    name: '',
    role: '',
    hotelId: '',
    email: '',
    phone: '',
    isActive: true,
    userId: user?._id || '',
    assignedRooms: []
  });
  
  // Room state
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomFormData, setRoomFormData] = useState({
    title: '',
    price: 0,
    maxPeople: 1,
    desc: '',
    hotelId: '',
    roomNumbers: []
  });
  const [roomNumberInput, setRoomNumberInput] = useState('');

  // Load dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        const [hotelsData, workersData, bookingsData] = await Promise.all([
          hotelAPI.getAllHotels(),
          workerAPI.getAllWorkers(),
          bookingAPI.getAllBookings()
        ]);
        
        setHotels(hotelsData || []);
        setBookings(bookingsData || []);
        
        if (Array.isArray(workersData)) {
          setWorkers(workersData);
        }
        
        let allRooms = [];
        
        for (const hotel of hotelsData) {
          if (hotel._id) {
            const hotelRooms = await roomAPI.getRoomsForHotel(hotel._id);
            if (hotelRooms && hotelRooms.length > 0) {
              allRooms = [...allRooms, ...hotelRooms];
            }
          }
        }
        
        setRooms(allRooms);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Worker form handlers
  const handleWorkerInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setWorkerFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleAddWorker = () => {
    setSelectedWorker(null);
    setWorkerFormData({
      name: '',
      role: '',
      hotelId: hotels.length > 0 ? hotels[0]._id || '' : '',
      email: '',
      phone: '',
      isActive: true,
      userId: user?._id || '',
      assignedRooms: []
    });
    setIsWorkerDialogOpen(true);
  };
  
  const handleEditWorker = (worker) => {
    setSelectedWorker(worker);
    setWorkerFormData({
      name: worker.name,
      role: worker.role,
      hotelId: worker.hotelId,
      email: worker.email,
      phone: worker.phone || '',
      isActive: worker.isActive,
      userId: worker.userId,
      assignedRooms: worker.assignedRooms
    });
    setIsWorkerDialogOpen(true);
  };
  
  const handleSubmitWorkerForm = async (e) => {
    e.preventDefault();
    
    try {
      if (selectedWorker) {
        const updatedWorker = await workerAPI.updateWorker(selectedWorker._id || '', workerFormData);
        setWorkers(workers.map(w => w._id === selectedWorker._id ? updatedWorker : w));
        toast.success('Worker updated successfully');
      } else {
        const newWorker = await workerAPI.createWorker(workerFormData);
        setWorkers([...workers, newWorker]);
        toast.success('Worker added successfully');
      }
      
      setIsWorkerDialogOpen(false);
    } catch (error) {
      console.error('Error saving worker:', error);
      toast.error('Failed to save worker');
    }
  };
  
  const handleDeleteWorker = async (workerId) => {
    try {
      await workerAPI.deleteWorker(workerId);
      setWorkers(workers.filter(w => w._id !== workerId));
      toast.success('Worker deleted successfully');
    } catch (error) {
      console.error('Error deleting worker:', error);
      toast.error('Failed to delete worker');
    }
  };
  
  // Room form handlers
  const handleRoomInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setRoomFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? checked 
        : type === 'number' 
          ? Number(value) 
          : value
    }));
  };
  
  const handleAddRoom = () => {
    setSelectedRoom(null);
    setRoomFormData({
      title: '',
      price: 0,
      maxPeople: 1,
      desc: '',
      hotelId: hotels.length > 0 ? hotels[0]._id || '' : '',
      roomNumbers: []
    });
    setRoomNumberInput('');
    setIsRoomDialogOpen(true);
  };
  
  const handleEditRoom = (room) => {
    setSelectedRoom(room);
    setRoomFormData({
      title: room.title,
      price: room.price,
      maxPeople: room.maxPeople,
      desc: room.desc,
      hotelId: room.hotelId,
      roomNumbers: room.roomNumbers
    });
    setRoomNumberInput('');
    setIsRoomDialogOpen(true);
  };
  
  const handleAddRoomNumber = () => {
    if (roomNumberInput && !isNaN(Number(roomNumberInput))) {
      const roomNumber = Number(roomNumberInput);
      
      // Check if the room number already exists
      const exists = roomFormData.roomNumbers.some(r => r.number === roomNumber);
      
      if (!exists) {
        setRoomFormData(prev => ({
          ...prev,
          roomNumbers: [...prev.roomNumbers, { number: roomNumber, unavailableDates: [] }]
        }));
        setRoomNumberInput('');
      } else {
        toast.error('This room number already exists');
      }
    }
  };
  
  const handleRemoveRoomNumber = (number) => {
    setRoomFormData(prev => ({
      ...prev,
      roomNumbers: prev.roomNumbers.filter(r => r.number !== number)
    }));
  };
  
  const handleSubmitRoomForm = async (e) => {
    e.preventDefault();
    
    if (roomFormData.roomNumbers.length === 0) {
      toast.error('Please add at least one room number');
      return;
    }
    
    try {
      if (selectedRoom) {
        const updatedRoom = await roomAPI.updateRoom(selectedRoom._id || '', roomFormData);
        setRooms(rooms.map(r => r._id === selectedRoom._id ? updatedRoom : r));
        toast.success('Room updated successfully');
      } else {
        const newRoom = await roomAPI.createRoom(roomFormData);
        setRooms([...rooms, newRoom]);
        toast.success('Room added successfully');
      }
      
      setIsRoomDialogOpen(false);
    } catch (error) {
      console.error('Error saving room:', error);
      toast.error('Failed to save room');
    }
  };
  
  const handleDeleteRoom = async (roomId) => {
    try {
      await roomAPI.deleteRoom(roomId);
      setRooms(rooms.filter(r => r._id !== roomId));
      toast.success('Room deleted successfully');
    } catch (error) {
      console.error('Error deleting room:', error);
      toast.error('Failed to delete room');
    }
  };
  
  // Toggle room cleaning status
  const handleToggleRoomCleaned = async (room) => {
    if (!room._id) return;
    
    try {
      const updatedRoom = await roomAPI.toggleRoomCleaningStatus(room._id, !room.isCleaned);
      
      setRooms(rooms.map(r => r._id === room._id ? updatedRoom : r));
      
      toast.success(`Room marked as ${updatedRoom.isCleaned ? 'cleaned' : 'needs cleaning'}`);
    } catch (error) {
      console.error('Error updating room:', error);
      toast.error('Failed to update room status');
    }
  };
  
  return (
    <AuthGuard requireModerator>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        
        <main className="flex-grow-1 py-5 bg-light">
          <div className="container">
            <header className="mb-4">
              <h1 className="display-5 fw-bold">Moderator Dashboard</h1>
              <p className="text-muted">
                Manage workers, rooms, and bookings
              </p>
            </header>
            
            <div className="row mb-4">
              <div className="col-md-3 mb-3 mb-md-0">
                <div className="card h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="card-subtitle text-muted">Assigned Hotels</h6>
                      <i className="bi bi-building"></i>
                    </div>
                    <h2 className="card-title">{hotels.length}</h2>
                  </div>
                </div>
              </div>
              
              <div className="col-md-3 mb-3 mb-md-0">
                <div className="card h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="card-subtitle text-muted">Workers</h6>
                      <i className="bi bi-people"></i>
                    </div>
                    <h2 className="card-title">{workers.length}</h2>
                    <p className="card-text text-muted small">
                      {workers.filter(w => w.isActive).length} active
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-3 mb-3 mb-md-0">
                <div className="card h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="card-subtitle text-muted">Rooms to Clean</h6>
                      <i className="bi bi-house-door"></i>
                    </div>
                    <h2 className="card-title">{rooms.filter(r => !r.isCleaned).length}</h2>
                    <p className="card-text text-muted small">
                      out of {rooms.length} total rooms
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-3">
                <div className="card h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="card-subtitle text-muted">Active Bookings</h6>
                      <i className="bi bi-calendar-check"></i>
                    </div>
                    <h2 className="card-title">
                      {bookings.filter(b => b.status === 'active' || b.status === 'confirmed').length}
                    </h2>
                    <p className="card-text text-muted small">
                      out of {bookings.length} total bookings
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <ul className="nav nav-tabs mb-4">
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                  onClick={() => setActiveTab('dashboard')}
                >
                  Dashboard
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'workers' ? 'active' : ''}`}
                  onClick={() => setActiveTab('workers')}
                >
                  Workers
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'rooms' ? 'active' : ''}`}
                  onClick={() => setActiveTab('rooms')}
                >
                  Rooms
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'bookings' ? 'active' : ''}`}
                  onClick={() => setActiveTab('bookings')}
                >
                  Bookings
                </button>
              </li>
            </ul>
            
            <div className="tab-content">
              <div className={`tab-pane fade ${activeTab === 'dashboard' ? 'show active' : ''}`}>
                <h2 className="h4 mb-4">Overview</h2>
                <p className="text-muted mb-4">
                  Welcome to the StayHaven moderator dashboard. Here you can manage workers, room cleaning status, and view bookings.
                </p>
                
                <h3 className="h5 mb-3">Assigned Hotels</h3>
                <div className="row mb-4">
                  {hotels.map(hotel => (
                    <div key={hotel._id} className="col-md-6 col-lg-4 mb-3">
                      <div className="card h-100">
                        <div className="card-img-top bg-light" style={{ height: '160px' }}>
                          {hotel.photos && hotel.photos.length > 0 ? (
                            <img 
                              src={hotel.photos[0]} 
                              alt={hotel.name} 
                              className="w-100 h-100 object-fit-cover"
                            />
                          ) : (
                            <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                              <i className="bi bi-building fs-1 text-secondary"></i>
                            </div>
                          )}
                        </div>
                        <div className="card-body">
                          <h4 className="card-title h5">{hotel.name}</h4>
                          <p className="card-text text-muted small">{hotel.city}</p>
                          <div className="d-flex justify-content-between mt-2 small">
                            <span>Rooms: {hotel.rooms?.length || 0}</span>
                            <span>Rating: {hotel.rating || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <h3 className="h5 mb-3">Recent Activity</h3>
                <div className="card">
                  <div className="card-body">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex align-items-center py-2 px-0">
                        <i className="bi bi-check-circle text-success me-2"></i>
                        <span>Room 101 marked as cleaned</span>
                        <span className="ms-auto text-muted small">2 hours ago</span>
                      </li>
                      <li className="list-group-item d-flex align-items-center py-2 px-0">
                        <i className="bi bi-person-check text-primary me-2"></i>
                        <span>New worker Sarah Johnson added</span>
                        <span className="ms-auto text-muted small">Yesterday</span>
                      </li>
                      <li className="list-group-item d-flex align-items-center py-2 px-0">
                        <i className="bi bi-x-circle text-danger me-2"></i>
                        <span>Room 205 marked as needs cleaning</span>
                        <span className="ms-auto text-muted small">2 days ago</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className={`tab-pane fade ${activeTab === 'workers' ? 'show active' : ''}`}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="h4 mb-0">Workers</h2>
                  <button className="btn btn-primary" onClick={handleAddWorker}>
                    <i className="bi bi-plus me-1"></i>
                    Add Worker
                  </button>
                </div>
                
                <div className="row">
                  {workers.map(worker => (
                    <div key={worker._id} className="col-12 mb-3">
                      <div className="card">
                        <div className="card-body">
                          <div className="d-flex justify-content-between">
                            <div className="d-flex align-items-center">
                              <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3" style={{ width: '48px', height: '48px' }}>
                                <i className="bi bi-person text-secondary fs-4"></i>
                              </div>
                              <div>
                                <h3 className="card-title h5 mb-0">{worker.name}</h3>
                                <div className="d-flex align-items-center">
                                  <span className="text-muted small me-2">{worker.role}</span>
                                  {worker.isActive ? (
                                    <span className="badge bg-success-subtle text-success rounded-pill">Active</span>
                                  ) : (
                                    <span className="badge bg-danger-subtle text-danger rounded-pill">Inactive</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div>
                              <button 
                                className="btn btn-sm btn-outline-primary me-2"
                                onClick={() => handleEditWorker(worker)}
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteWorker(worker._id || '')}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </div>
                          <div className="row mt-3 text-muted small">
                            <div className="col-md-4 mb-2 mb-md-0">
                              <strong>Email:</strong> {worker.email}
                            </div>
                            <div className="col-md-4 mb-2 mb-md-0">
                              <strong>Phone:</strong> {worker.phone || 'N/A'}
                            </div>
                            <div className="col-md-4">
                              <strong>Hotel:</strong> {hotels.find(h => h._id === worker.hotelId)?.name || 'Unknown Hotel'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {workers.length === 0 && (
                    <div className="col-12">
                      <div className="card py-5">
                        <div className="card-body text-center">
                          <p className="text-muted">No workers found. Add a worker to get started.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className={`tab-pane fade ${activeTab === 'rooms' ? 'show active' : ''}`}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="h4 mb-0">Room Management</h2>
                  <button className="btn btn-primary" onClick={handleAddRoom}>
                    <i className="bi bi-plus me-1"></i>
                    Add Room
                  </button>
                </div>
                
                <div className="row">
                  {rooms.map(room => {
                    const hotel = hotels.find(h => h._id === room.hotelId || h.rooms?.includes(room._id || ''));
                    
                    return (
                      <div key={room._id} className="col-12 mb-3">
                        <div className="card">
                          <div className="card-body">
                            <div className="d-flex justify-content-between">
                              <div>
                                <h3 className="card-title h5 mb-0">{room.title}</h3>
                                <p className="text-muted small">{hotel?.name || 'Unknown Hotel'}</p>
                              </div>
                              <div>
                                <button 
                                  className={`btn btn-sm ${room.isCleaned ? 'btn-outline-danger' : 'btn-outline-success'} me-2`}
                                  onClick={() => handleToggleRoomCleaned(room)}
                                >
                                  {room.isCleaned ? (
                                    <>
                                      <i className="bi bi-x-circle me-1"></i>
                                      Needs Cleaning
                                    </>
                                  ) : (
                                    <>
                                      <i className="bi bi-check-circle me-1"></i>
                                      Mark Clean
                                    </>
                                  )}
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-primary me-2"
                                  onClick={() => handleEditRoom(room)}
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDeleteRoom(room._id || '')}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </div>
                            <div className="row mt-3 text-muted small">
                              <div className="col-md-4 mb-2 mb-md-0">
                                <strong>Room Numbers:</strong> {room.roomNumbers?.map(r => r.number).join(', ')}
                              </div>
                              <div className="col-md-4 mb-2 mb-md-0">
                                <strong>Price:</strong> ${room.price} per night
                              </div>
                              <div className="col-md-4">
                                <strong>Max People:</strong> {room.maxPeople}
                              </div>
                            </div>
                            <div className="mt-2">
                              <p className="text-muted small">{room.desc}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {rooms.length === 0 && (
                    <div className="col-12">
                      <div className="card py-5">
                        <div className="card-body text-center">
                          <p className="text-muted">No rooms found. Add a room to get started.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className={`tab-pane fade ${activeTab === 'bookings' ? 'show active' : ''}`}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="h4 mb-0">Bookings</h2>
                </div>
                
                <div className="row">
                  {bookings.map(booking => {
                    const hotel = hotels.find(h => h._id === booking.hotelId);
                    
                    return (
                      <div key={booking._id} className="col-12 mb-3">
                        <div className="card">
                          <div className="card-body">
                            <div className="d-flex justify-content-between">
                              <div>
                                <h3 className="card-title h5 mb-0">Booking #{booking._id?.substring(0, 8)}...</h3>
                                <p className="text-muted small">
                                  Room {booking.roomNumber} at {hotel?.name || 'Unknown Hotel'}
                                </p>
                              </div>
                              <div>
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => {
                                    const newStatus = booking.status === 'active' || booking.status === 'confirmed' ? 'completed' : 'active';
                                    bookingAPI.updateBooking(booking._id || '', { status: newStatus })
                                      .then(updatedBooking => {
                                        setBookings(bookings.map(b => b._id === booking._id ? updatedBooking : b));
                                        toast.success(`Booking marked as ${newStatus}`);
                                      })
                                      .catch(error => {
                                        console.error('Error updating booking:', error);
                                        toast.error('Failed to update booking');
                                      });
                                  }}
                                >
                                  {booking.status === 'active' || booking.status === 'confirmed' ? 'Mark Completed' : 'Mark Active'}
                                </button>
                              </div>
                            </div>
                            <div className="row mt-3 text-muted small">
                              <div className="col-md-3 mb-2 mb-md-0">
                                <strong>Check In:</strong> {new Date(booking.dateStart).toLocaleDateString()}
                              </div>
                              <div className="col-md-3 mb-2 mb-md-0">
                                <strong>Check Out:</strong> {new Date(booking.dateEnd).toLocaleDateString()}
                              </div>
                              <div className="col-md-3 mb-2 mb-md-0">
                                <strong>Price:</strong> ${booking.totalPrice}
                              </div>
                              <div className="col-md-3">
                                <strong>Status:</strong> <span className="text-capitalize">{booking.status}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {bookings.length === 0 && (
                    <div className="col-12">
                      <div className="card py-5">
                        <div className="card-body text-center">
                          <p className="text-muted">No bookings found.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
        
        {/* Worker Modal */}
        <div className={`modal fade ${isWorkerDialogOpen ? 'show' : ''}`} style={{display: isWorkerDialogOpen ? 'block' : 'none'}} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedWorker ? 'Edit Worker' : 'Add New Worker'}</h5>
                <button type="button" className="btn-close" onClick={() => setIsWorkerDialogOpen(false)}></button>
              </div>
              
              <form onSubmit={handleSubmitWorkerForm}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={workerFormData.name}
                      onChange={handleWorkerInputChange}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="role" className="form-label">Role</label>
                    <select
                      className="form-select"
                      id="role"
                      name="role"
                      value={workerFormData.role}
                      onChange={handleWorkerInputChange}
                      required
                    >
                      <option value="">Select Role</option>
                      <option value="Housekeeper">Housekeeper</option>
                      <option value="Receptionist">Receptionist</option>
                      <option value="Manager">Manager</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Security">Security</option>
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="hotelId" className="form-label">Hotel</label>
                    <select
                      className="form-select"
                      id="hotelId"
                      name="hotelId"
                      value={workerFormData.hotelId}
                      onChange={handleWorkerInputChange}
                      required
                    >
                      {hotels.map(hotel => (
                        <option key={hotel._id} value={hotel._id}>
                          {hotel.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={workerFormData.email}
                      onChange={handleWorkerInputChange}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Phone (optional)</label>
                    <input
                      type="text"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={workerFormData.phone}
                      onChange={handleWorkerInputChange}
                    />
                  </div>
                  
                  <div className="form-check mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="isActive"
                      name="isActive"
                      checked={workerFormData.isActive}
                      onChange={handleWorkerInputChange}
                    />
                    <label className="form-check-label" htmlFor="isActive">Active</label>
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setIsWorkerDialogOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {selectedWorker ? 'Update Worker' : 'Add Worker'}
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
        
        {/* Room Modal */}
        <div className={`modal fade ${isRoomDialogOpen ? 'show' : ''}`} style={{display: isRoomDialogOpen ? 'block' : 'none'}} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedRoom ? 'Edit Room' : 'Add New Room'}</h5>
                <button type="button" className="btn-close" onClick={() => setIsRoomDialogOpen(false)}></button>
              </div>
              
              <form onSubmit={handleSubmitRoomForm}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">Room Title</label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      name="title"
                      value={roomFormData.title}
                      onChange={handleRoomInputChange}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="hotelId" className="form-label">Hotel</label>
                    <select
                      className="form-select"
                      id="hotelId"
                      name="hotelId"
                      value={roomFormData.hotelId}
                      onChange={handleRoomInputChange}
                      required
                    >
                      {hotels.map(hotel => (
                        <option key={hotel._id} value={hotel._id}>
                          {hotel.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="price" className="form-label">Price Per Night ($)</label>
                      <input
                        type="number"
                        className="form-control"
                        id="price"
                        name="price"
                        min="0"
                        step="1"
                        value={roomFormData.price}
                        onChange={handleRoomInputChange}
                        required
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label htmlFor="maxPeople" className="form-label">Max People</label>
                      <input
                        type="number"
                        className="form-control"
                        id="maxPeople"
                        name="maxPeople"
                        min="1"
                        value={roomFormData.maxPeople}
                        onChange={handleRoomInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="desc" className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      id="desc"
                      name="desc"
                      rows="3"
                      value={roomFormData.desc}
                      onChange={handleRoomInputChange}
                      required
                    ></textarea>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Room Numbers</label>
                    <div className="input-group mb-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter room number"
                        value={roomNumberInput}
                        onChange={(e) => setRoomNumberInput(e.target.value)}
                      />
                      <button 
                        type="button" 
                        className="btn btn-outline-primary"
                        onClick={handleAddRoomNumber}
                      >
                        Add
                      </button>
                    </div>
                    
                    <div className="d-flex flex-wrap gap-2 mt-2">
                      {roomFormData.roomNumbers.map(room => (
                        <span key={room.number} className="badge bg-light text-dark py-2 px-3">
                          Room {room.number}
                          <button 
                            type="button"
                            className="btn-close ms-1"
                            style={{ fontSize: '0.5rem' }}
                            onClick={() => handleRemoveRoomNumber(room.number)}
                          ></button>
                        </span>
                      ))}
                      
                      {roomFormData.roomNumbers.length === 0 && (
                        <p className="text-muted small">No room numbers added yet</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setIsRoomDialogOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {selectedRoom ? 'Update Room' : 'Add Room'}
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default ModeratorDashboard;
