
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Loader2, Plus, PenSquare, Trash2, UserPlus, ShieldCheck, Hotel } from 'lucide-react';
import AdminBookings from './admin/AdminBookings';
import AdminUsers from './admin/AdminUsers';
import { hotelAPI, moderatorAPI, userAPI } from '@/services/api';
import AuthGuard from '@/components/AuthGuard';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminDashboard = () => {
  const { state } = useAuth();
  const { user, loading } = state;
  const [activeTab, setActiveTab] = useState('users');
  
  // State for CRUD operations
  const [users, setUsers] = useState([]);
  const [moderators, setModerators] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  
  // Dialog states
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [moderatorDialogOpen, setModeratorDialogOpen] = useState(false);
  const [hotelDialogOpen, setHotelDialogOpen] = useState(false);
  
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
        
        if (activeTab === 'moderators') {
          const moderatorsData = await moderatorAPI.getAllModerators();
          setModerators(moderatorsData);
        }
        
        if (activeTab === 'hotels') {
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
      
      setUserDialogOpen(false);
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
      
      setModeratorDialogOpen(false);
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
      
      setHotelDialogOpen(false);
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
    setUserDialogOpen(true);
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
    setModeratorDialogOpen(true);
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
    setHotelDialogOpen(true);
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
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-hotel-500" />
      </div>
    );
  }

  return (
    <AuthGuard requireAdmin={true}>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow pt-16 md:pt-20 pb-10">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage all aspects of your hotel system.</p>
              </div>
              
              <div className="flex space-x-2 mt-4 md:mt-0">
                <Button variant="outline">Export Data</Button>
                <Button className="bg-hotel-500 hover:bg-hotel-600">System Settings</Button>
              </div>
            </div>
            
            <Tabs 
              defaultValue={activeTab} 
              value={activeTab}
              onValueChange={setActiveTab}
              className="mt-6"
            >
              <TabsList className="grid grid-cols-3 md:grid-cols-5 mb-8">
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="hotels">Hotels</TabsTrigger>
                <TabsTrigger value="rooms">Rooms</TabsTrigger>
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
                <TabsTrigger value="moderators">Moderators</TabsTrigger>
              </TabsList>
              
              <TabsContent value="users" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">User Management</h2>
                  <Button 
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
                      setUserDialogOpen(true);
                    }}
                    className="bg-hotel-500 hover:bg-hotel-600"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
                
                {loadingData ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-hotel-500" />
                    <span className="ml-2">Loading users...</span>
                  </div>
                ) : (
                  <div className="bg-white rounded-md shadow-sm overflow-hidden">
                    <Table>
                      <TableCaption>List of all users in the system</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Username</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user._id}>
                            <TableCell className="font-medium">{user.username}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.city}, {user.country}</TableCell>
                            <TableCell>
                              {user.isAdmin ? (
                                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                                  Admin
                                </span>
                              ) : user.isModerator ? (
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                  Moderator
                                </span>
                              ) : (
                                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                                  User
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleEditUser(user)}
                                >
                                  <PenSquare className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => handleDeleteUser(user._id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="hotels" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Hotel Management</h2>
                  <Button 
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
                      setHotelDialogOpen(true);
                    }}
                    className="bg-hotel-500 hover:bg-hotel-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Hotel
                  </Button>
                </div>
                
                {loadingData ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-hotel-500" />
                    <span className="ml-2">Loading hotels...</span>
                  </div>
                ) : (
                  <div className="bg-white rounded-md shadow-sm overflow-hidden">
                    <Table>
                      <TableCaption>List of all hotels in the system</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Rating</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {hotels.map((hotel) => (
                          <TableRow key={hotel._id}>
                            <TableCell className="font-medium">{hotel.name}</TableCell>
                            <TableCell>{hotel.type}</TableCell>
                            <TableCell>{hotel.city}</TableCell>
                            <TableCell>${hotel.cheapestPrice}</TableCell>
                            <TableCell>{hotel.rating}/5</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleEditHotel(hotel)}
                                >
                                  <PenSquare className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => handleDeleteHotel(hotel._id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="rooms" className="space-y-4">
                <div className="grid">
                  <h2 className="text-xl font-semibold mb-4">Room Management</h2>
                  <p>Room management interface will be implemented here.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="bookings" className="space-y-4">
                <AdminBookings />
              </TabsContent>
              
              <TabsContent value="moderators" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Moderator Management</h2>
                  <Button 
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
                      setModeratorDialogOpen(true);
                    }}
                    className="bg-hotel-500 hover:bg-hotel-600"
                  >
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Add Moderator
                  </Button>
                </div>
                
                {loadingData ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-hotel-500" />
                    <span className="ml-2">Loading moderators...</span>
                  </div>
                ) : (
                  <div className="bg-white rounded-md shadow-sm overflow-hidden">
                    <Table>
                      <TableCaption>List of all moderators in the system</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Assigned Hotel</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Permissions</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {moderators.map((moderator) => {
                          const assignedHotel = hotels.find(h => h._id === moderator.hotelId);
                          const modUser = users.find(u => u._id === moderator.userId);
                          
                          return (
                            <TableRow key={moderator._id}>
                              <TableCell className="font-medium">
                                {modUser ? modUser.username : moderator.userId}
                              </TableCell>
                              <TableCell>
                                {assignedHotel ? assignedHotel.name : moderator.hotelId}
                              </TableCell>
                              <TableCell>
                                {moderator.isActive ? (
                                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                    Active
                                  </span>
                                ) : (
                                  <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                                    Inactive
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {moderator.permissions?.canManageWorkers && (
                                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded">
                                      Workers
                                    </span>
                                  )}
                                  {moderator.permissions?.canManageRooms && (
                                    <span className="bg-purple-50 text-purple-700 text-xs px-2 py-0.5 rounded">
                                      Rooms
                                    </span>
                                  )}
                                  {moderator.permissions?.canViewBookings && (
                                    <span className="bg-amber-50 text-amber-700 text-xs px-2 py-0.5 rounded">
                                      Bookings
                                    </span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end space-x-2">
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => handleEditModerator(moderator)}
                                  >
                                    <PenSquare className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => handleDeleteModerator(moderator._id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
        
        <Footer />
        
        {/* User Dialog */}
        <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingUserId ? 'Edit User' : 'Add New User'}</DialogTitle>
              <DialogDescription>
                {editingUserId ? 'Update user details' : 'Create a new user account'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUserSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Username
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    value={userForm.username}
                    onChange={handleUserFormChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={userForm.email}
                    onChange={handleUserFormChange}
                    className="col-span-3"
                    required
                  />
                </div>
                {!editingUserId && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">
                      Password
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={userForm.password}
                      onChange={handleUserFormChange}
                      className="col-span-3"
                      required={!editingUserId}
                    />
                  </div>
                )}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="country" className="text-right">
                    Country
                  </Label>
                  <Input
                    id="country"
                    name="country"
                    value={userForm.country}
                    onChange={handleUserFormChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="city" className="text-right">
                    City
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    value={userForm.city}
                    onChange={handleUserFormChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={userForm.phone}
                    onChange={handleUserFormChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="text-right">Roles</div>
                  <div className="col-span-3 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isAdmin"
                        name="isAdmin"
                        checked={userForm.isAdmin}
                        onCheckedChange={(checked) => 
                          setUserForm({...userForm, isAdmin: checked})
                        }
                      />
                      <Label htmlFor="isAdmin">Admin</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isModerator"
                        name="isModerator"
                        checked={userForm.isModerator}
                        onCheckedChange={(checked) => 
                          setUserForm({...userForm, isModerator: checked})
                        }
                      />
                      <Label htmlFor="isModerator">Moderator</Label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-hotel-500 hover:bg-hotel-600">
                  {editingUserId ? 'Update User' : 'Add User'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        {/* Moderator Dialog */}
        <Dialog open={moderatorDialogOpen} onOpenChange={setModeratorDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingModeratorId ? 'Edit Moderator' : 'Add New Moderator'}</DialogTitle>
              <DialogDescription>
                {editingModeratorId ? 'Update moderator details' : 'Assign a user as a moderator for a hotel'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleModeratorSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="userId" className="text-right">
                    User
                  </Label>
                  <select
                    id="userId"
                    name="userId"
                    value={moderatorForm.userId}
                    onChange={handleModeratorFormChange}
                    className="col-span-3 w-full rounded-md border border-input bg-background px-3 py-2"
                    required
                  >
                    <option value="">Select a user</option>
                    {users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.username} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="hotelId" className="text-right">
                    Hotel
                  </Label>
                  <select
                    id="hotelId"
                    name="hotelId"
                    value={moderatorForm.hotelId}
                    onChange={handleModeratorFormChange}
                    className="col-span-3 w-full rounded-md border border-input bg-background px-3 py-2"
                    required
                  >
                    <option value="">Select a hotel</option>
                    {hotels.map((hotel) => (
                      <option key={hotel._id} value={hotel._id}>
                        {hotel.name} ({hotel.city})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <div className="text-right pt-2">Permissions</div>
                  <div className="col-span-3 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="canManageWorkers"
                        name="permissions.canManageWorkers"
                        checked={moderatorForm.permissions.canManageWorkers}
                        onCheckedChange={(checked) => 
                          setModeratorForm({
                            ...moderatorForm,
                            permissions: {
                              ...moderatorForm.permissions,
                              canManageWorkers: checked
                            }
                          })
                        }
                      />
                      <Label htmlFor="canManageWorkers">Manage Workers</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="canManageRooms"
                        name="permissions.canManageRooms"
                        checked={moderatorForm.permissions.canManageRooms}
                        onCheckedChange={(checked) => 
                          setModeratorForm({
                            ...moderatorForm,
                            permissions: {
                              ...moderatorForm.permissions,
                              canManageRooms: checked
                            }
                          })
                        }
                      />
                      <Label htmlFor="canManageRooms">Manage Rooms</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="canViewBookings"
                        name="permissions.canViewBookings"
                        checked={moderatorForm.permissions.canViewBookings}
                        onCheckedChange={(checked) => 
                          setModeratorForm({
                            ...moderatorForm,
                            permissions: {
                              ...moderatorForm.permissions,
                              canViewBookings: checked
                            }
                          })
                        }
                      />
                      <Label htmlFor="canViewBookings">View Bookings</Label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-hotel-500 hover:bg-hotel-600">
                  {editingModeratorId ? 'Update Moderator' : 'Add Moderator'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        {/* Hotel Dialog */}
        <Dialog open={hotelDialogOpen} onOpenChange={setHotelDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingHotelId ? 'Edit Hotel' : 'Add New Hotel'}</DialogTitle>
              <DialogDescription>
                {editingHotelId ? 'Update hotel details' : 'Create a new hotel in the system'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleHotelSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={hotelForm.name}
                    onChange={handleHotelFormChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type
                  </Label>
                  <select
                    id="type"
                    name="type"
                    value={hotelForm.type}
                    onChange={handleHotelFormChange}
                    className="col-span-3 w-full rounded-md border border-input bg-background px-3 py-2"
                    required
                  >
                    <option value="Hotel">Hotel</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Resort">Resort</option>
                    <option value="Villa">Villa</option>
                    <option value="Cabin">Cabin</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="city" className="text-right">
                    City
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    value={hotelForm.city}
                    onChange={handleHotelFormChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">
                    Address
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    value={hotelForm.address}
                    onChange={handleHotelFormChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="distance" className="text-right">
                    Distance
                  </Label>
                  <Input
                    id="distance"
                    name="distance"
                    value={hotelForm.distance}
                    onChange={handleHotelFormChange}
                    className="col-span-3"
                    placeholder="e.g. 500m from center"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={hotelForm.title}
                    onChange={handleHotelFormChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="desc" className="text-right">
                    Description
                  </Label>
                  <textarea
                    id="desc"
                    name="desc"
                    value={hotelForm.desc}
                    onChange={handleHotelFormChange}
                    className="col-span-3 min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cheapestPrice" className="text-right">
                    Price
                  </Label>
                  <Input
                    id="cheapestPrice"
                    name="cheapestPrice"
                    type="number"
                    value={hotelForm.cheapestPrice}
                    onChange={handleHotelFormChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="text-right"></div>
                  <div className="col-span-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="featured"
                        name="featured"
                        checked={hotelForm.featured}
                        onCheckedChange={(checked) => 
                          setHotelForm({...hotelForm, featured: checked})
                        }
                      />
                      <Label htmlFor="featured">Featured Hotel</Label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-hotel-500 hover:bg-hotel-600">
                  {editingHotelId ? 'Update Hotel' : 'Add Hotel'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AuthGuard>
  );
};

export default AdminDashboard;
