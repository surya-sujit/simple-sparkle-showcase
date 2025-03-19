
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Loader2, User, Hotel, Calendar, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { bookingAPI } from '@/services/api';
import BookingItem from '@/components/BookingItem';

const UserDashboard = () => {
  const { state } = useAuth();
  const { user, loading } = state;
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  
  useEffect(() => {
    if (user && user._id) {
      fetchBookings();
    }
  }, [user]);
  
  const fetchBookings = async () => {
    try {
      setLoadingBookings(true);
      const userBookings = await bookingAPI.getUserBookings(user._id);
      setBookings(userBookings);
    } catch (error) {
      toast.error('Failed to load bookings');
      console.error(error);
    } finally {
      setLoadingBookings(false);
    }
  };
  
  const isDateInFuture = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    return date > today;
  };
  
  const handleCancelBooking = async (bookingId) => {
    try {
      await bookingAPI.cancelBooking(bookingId);
      toast.success('Booking cancelled successfully');
      fetchBookings(); // Refresh bookings list
    } catch (error) {
      toast.error('Failed to cancel booking');
      console.error(error);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-hotel-500" />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16 md:pt-20 pb-10">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome, {user.username}!</h1>
              <p className="text-muted-foreground">Manage your profile and bookings</p>
            </div>
          </div>
          
          <Tabs 
            defaultValue={activeTab} 
            value={activeTab}
            onValueChange={setActiveTab}
            className="mt-6"
          >
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="bookings" className="flex items-center">
                <Hotel className="h-4 w-4 mr-2" />
                My Bookings
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>
            
            {/* Bookings Tab */}
            <TabsContent value="bookings">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Your Bookings</h2>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={fetchBookings}
                    disabled={loadingBookings}
                  >
                    {loadingBookings ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      'Refresh'
                    )}
                  </Button>
                </div>
                
                {loadingBookings ? (
                  <div className="py-8 flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-hotel-500" />
                  </div>
                ) : bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <BookingItem
                        key={booking._id}
                        booking={booking}
                        onCancel={handleCancelBooking}
                        isDateInFuture={isDateInFuture}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center border rounded-lg">
                    <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <h3 className="text-lg font-medium mb-1">No bookings yet</h3>
                    <p className="text-muted-foreground mb-4">
                      You haven't made any bookings yet. Start exploring hotels now!
                    </p>
                    <Button variant="default" className="bg-hotel-500 hover:bg-hotel-600">
                      Browse Hotels
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Profile Tab */}
            <TabsContent value="profile">
              <div className="border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input 
                      type="text" 
                      readOnly 
                      value={user.username}
                      className="w-full px-3 py-2 border rounded-md bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      readOnly 
                      value={user.email}
                      className="w-full px-3 py-2 border rounded-md bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input 
                      type="text" 
                      readOnly 
                      value={user.country}
                      className="w-full px-3 py-2 border rounded-md bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input 
                      type="text" 
                      readOnly 
                      value={user.city}
                      className="w-full px-3 py-2 border rounded-md bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input 
                      type="text" 
                      readOnly 
                      value={user.phone || 'Not provided'}
                      className="w-full px-3 py-2 border rounded-md bg-gray-50"
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <Button className="bg-hotel-500 hover:bg-hotel-600">
                    Edit Profile
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            {/* Settings Tab */}
            <TabsContent value="settings">
              <div className="border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Email Notifications</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="emailBooking" 
                          className="rounded text-hotel-600 focus:ring-hotel-500 h-4 w-4"
                          defaultChecked
                        />
                        <label htmlFor="emailBooking" className="ml-2 text-sm text-gray-700">
                          Booking confirmations and receipts
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="emailPromo" 
                          className="rounded text-hotel-600 focus:ring-hotel-500 h-4 w-4"
                          defaultChecked
                        />
                        <label htmlFor="emailPromo" className="ml-2 text-sm text-gray-700">
                          Promotions and special offers
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="emailReminder" 
                          className="rounded text-hotel-600 focus:ring-hotel-500 h-4 w-4"
                          defaultChecked
                        />
                        <label htmlFor="emailReminder" className="ml-2 text-sm text-gray-700">
                          Trip reminders
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Privacy Settings</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="shareData" 
                          className="rounded text-hotel-600 focus:ring-hotel-500 h-4 w-4"
                          defaultChecked
                        />
                        <label htmlFor="shareData" className="ml-2 text-sm text-gray-700">
                          Share my booking history with trusted partners
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="savePayment" 
                          className="rounded text-hotel-600 focus:ring-hotel-500 h-4 w-4"
                          defaultChecked={false}
                        />
                        <label htmlFor="savePayment" className="ml-2 text-sm text-gray-700">
                          Save payment methods for faster checkout
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <Button variant="destructive">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserDashboard;
