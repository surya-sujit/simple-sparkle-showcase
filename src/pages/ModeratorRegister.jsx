
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authAPI, moderatorAPI, hotelAPI } from '../services/api';

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
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      setIsLoading(true);
      
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
      toast.error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Moderator Registration</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1">Username*</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email*</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">Password*</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label htmlFor="country" className="block text-sm font-medium mb-1">Country*</label>
            <input
              id="country"
              name="country"
              type="text"
              value={formData.country}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label htmlFor="city" className="block text-sm font-medium mb-1">City*</label>
            <input
              id="city"
              name="city"
              type="text"
              value={formData.city}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone</label>
            <input
              id="phone"
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label htmlFor="assignedHotels" className="block text-sm font-medium mb-1">
              Assigned Hotels
              {isLoadingHotels && <span className="ml-2 text-xs text-gray-500">(Loading...)</span>}
            </label>
            <select
              id="assignedHotels"
              name="assignedHotels"
              multiple
              value={formData.assignedHotels}
              onChange={handleHotelChange}
              className="w-full p-2 border rounded h-32"
            >
              {hotels.map(hotel => (
                <option key={hotel._id} value={hotel._id}>
                  {hotel.name} - {hotel.city}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple hotels</p>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-hotel-500 text-white rounded hover:bg-hotel-600 disabled:opacity-50"
          >
            {isLoading ? 'Registering...' : 'Register Moderator'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModeratorRegister;
