
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { hotelAPI, roomAPI } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookingForm from '@/components/BookingForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { 
  MapPin, 
  Star, 
  Info, 
  Users, 
  Calendar, 
  BedDouble, 
  DollarSign, 
  ChevronRight,
  Loader2,
  Hotel as HotelIcon
} from 'lucide-react';
import { toast } from 'sonner';

const HotelDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { state: authState } = useAuth();
  const { user } = authState;
  
  const [bookingRoom, setBookingRoom] = useState(null);
  const [bookingRoomNumber, setBookingRoomNumber] = useState(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  
  // Parse query parameters for dates and guests
  const queryParams = new URLSearchParams(location.search);
  const checkIn = queryParams.get('checkIn') ? new Date(queryParams.get('checkIn')) : null;
  const checkOut = queryParams.get('checkOut') ? new Date(queryParams.get('checkOut')) : null;
  const guests = Number(queryParams.get('guests')) || 1;
  
  // Fetch hotel details
  const { data: hotel, isLoading: isLoadingHotel, error: hotelError } = useQuery({
    queryKey: ['hotel', id],
    queryFn: () => hotelAPI.getHotelById(id),
  });
  
  // Fetch hotel rooms
  const { data: rooms, isLoading: isLoadingRooms, error: roomsError } = useQuery({
    queryKey: ['rooms', id],
    queryFn: () => roomAPI.getRoomsForHotel(id),
    enabled: !!id,
  });
  
  const handleBookRoom = (room) => {
    if (!user) {
      toast.error('Please log in to book a room');
      navigate('/login');
      return;
    }
    
    // Find an available room number
    const availableRoom = findAvailableRoomNumber(room, checkIn, checkOut);
    
    if (!availableRoom.available) {
      toast.error('This room is not available for the selected dates');
      return;
    }
    
    setBookingRoom(room);
    setBookingRoomNumber(availableRoom.roomNumber);
    setShowBookingDialog(true);
  };
  
  const findAvailableRoomNumber = (room, startDate, endDate) => {
    // If no dates are provided, just return the first room number
    if (!startDate || !endDate) {
      return {
        available: true,
        roomNumber: room.roomNumbers[0]?.number || 101
      };
    }
    
    // For each room number, check if it's available for the given date range
    for (const roomNum of room.roomNumbers) {
      let isAvailable = true;
      
      // Loop through each day in the date range
      const current = new Date(startDate);
      while (current <= endDate) {
        const currentDate = new Date(current);
        
        // Check if this date is in the unavailable dates
        const isUnavailable = roomNum.unavailableDates.some(unavailableDate => {
          const date = new Date(unavailableDate);
          return date.getFullYear() === currentDate.getFullYear() &&
                date.getMonth() === currentDate.getMonth() &&
                date.getDate() === currentDate.getDate();
        });
        
        if (isUnavailable) {
          isAvailable = false;
          break;
        }
        
        // Move to the next day
        current.setDate(current.getDate() + 1);
      }
      
      if (isAvailable) {
        return {
          available: true,
          roomNumber: roomNum.number
        };
      }
    }
    
    return {
      available: false,
      roomNumber: null
    };
  };
  
  if (isLoadingHotel || isLoadingRooms) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-16 md:pt-20 pb-10">
          <div className="container mx-auto px-4">
            <div className="animate-pulse">
              <Skeleton className="h-8 w-2/3 mb-4" />
              <Skeleton className="h-4 w-1/3 mb-8" />
              
              <div className="aspect-[2/1] w-full mb-8">
                <Skeleton className="h-full w-full rounded-lg" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-4">
                  <Skeleton className="h-6 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                
                <div className="space-y-4">
                  <Skeleton className="h-6 w-1/2 mb-2" />
                  <Skeleton className="h-24 w-full rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (hotelError || roomsError) {
    toast.error('Failed to load hotel details. Please try again later.');
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-16 md:pt-20 pb-10">
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <HotelIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Error Loading Hotel</h2>
              <p className="text-muted-foreground mb-6">
                We couldn't load the details for this hotel. Please try again later.
              </p>
              <Button 
                onClick={() => navigate('/hotels')}
                className="bg-hotel-500 hover:bg-hotel-600"
              >
                Go Back to Hotels
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16 md:pt-20 pb-10">
        <div className="container mx-auto px-4">
          {/* Hotel Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{hotel.name}</h1>
            <div className="flex items-center text-gray-600 mb-4">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{hotel.address}, {hotel.city}</span>
              <span className="mx-2">•</span>
              <span>{hotel.distance} from center</span>
            </div>
            
            {/* Tags and rating */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                {hotel.type}
              </span>
              
              {hotel.featured && (
                <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs">
                  Featured
                </span>
              )}
              
              <div className="flex items-center ml-auto">
                <Star className="h-5 w-5 text-yellow-400 mr-1" />
                <span className="font-medium">{hotel.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
          
          {/* Hotel Images */}
          {hotel.photos && hotel.photos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {hotel.photos.slice(0, 6).map((photo, index) => (
                <div 
                  key={index}
                  className={`overflow-hidden rounded-lg ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
                >
                  <AspectRatio ratio={index === 0 ? 16 / 9 : 4 / 3}>
                    <img
                      src={photo}
                      alt={`${hotel.name} - ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>
                </div>
              ))}
            </div>
          ) : (
            <div className="aspect-[2/1] bg-gray-100 rounded-lg flex flex-col items-center justify-center mb-8">
              <HotelIcon className="h-16 w-16 text-gray-300 mb-2" />
              <p className="text-gray-500">No photos available</p>
            </div>
          )}
          
          {/* Hotel Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">{hotel.title}</h2>
                <p className="text-gray-600 whitespace-pre-line">{hotel.desc}</p>
              </div>
              
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Hotel Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-hotel-500 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Location</h4>
                      <p className="text-gray-600">{hotel.address}, {hotel.city}</p>
                      <p className="text-gray-600">{hotel.distance} from city center</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-hotel-500 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Property Type</h4>
                      <p className="text-gray-600">{hotel.type}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-hotel-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-bold mb-4">Price Summary</h3>
                <div className="flex justify-between items-center mb-2">
                  <span>Starting from</span>
                  <span className="text-2xl font-bold">${hotel.cheapestPrice}</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Price varies based on room type and dates
                </p>
                <Button 
                  className="w-full bg-hotel-500 hover:bg-hotel-600"
                  onClick={() => {
                    const roomsSection = document.getElementById('rooms-section');
                    if (roomsSection) {
                      roomsSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  View Available Rooms
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-3">Current Search</h3>
                {checkIn && checkOut ? (
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Dates</p>
                        <p className="text-sm text-gray-600">
                          {checkIn.toLocaleDateString()} - {checkOut.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Users className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Guests</p>
                        <p className="text-sm text-gray-600">{guests} guest(s)</p>
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      className="w-full mt-2"
                      onClick={() => navigate('/hotels')}
                    >
                      Modify Search
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-2">
                    <p className="text-sm text-gray-600 mb-3">
                      No dates selected. Some rooms may not be available.
                    </p>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate('/hotels')}
                    >
                      Set Dates
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Available Rooms */}
          <div id="rooms-section" className="pt-6">
            <h2 className="text-2xl font-bold mb-6">Available Rooms</h2>
            
            {rooms && rooms.length > 0 ? (
              <div className="space-y-6">
                {rooms.map((room) => {
                  const isAvailable = checkIn && checkOut ? 
                    findAvailableRoomNumber(room, checkIn, checkOut).available : true;
                  
                  return (
                    <div 
                      key={room._id}
                      className={`border rounded-lg overflow-hidden ${!isAvailable ? 'opacity-75' : ''}`}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        {/* Room Image */}
                        <div className="md:col-span-3 bg-gray-100 flex items-center justify-center">
                          <div className="p-6">
                            <BedDouble className="h-16 w-16 text-gray-400" />
                          </div>
                        </div>
                        
                        {/* Room Details */}
                        <div className="md:col-span-6 p-6">
                          <h3 className="text-xl font-bold mb-2">{room.title}</h3>
                          <div className="flex items-center mb-4">
                            <Users className="h-4 w-4 text-gray-500 mr-1" />
                            <span className="text-sm">Up to {room.maxPeople} guests</span>
                          </div>
                          
                          <p className="text-gray-600 mb-4">{room.desc}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            <div className="flex items-center text-sm">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                              <span>{room.isCleaned ? 'Cleaned' : 'Cleaning scheduled'}</span>
                            </div>
                            
                            <div className="flex items-center text-sm">
                              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                              <span>{room.roomNumbers.length} rooms</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Price and Book */}
                        <div className="md:col-span-3 bg-gray-50 p-6 flex flex-col justify-between">
                          <div>
                            <div className="flex items-baseline mb-1">
                              <span className="text-2xl font-bold">${room.price}</span>
                              <span className="text-gray-600 text-sm ml-1">/ night</span>
                            </div>
                            
                            {guests > room.maxPeople && (
                              <p className="text-amber-600 text-sm mb-4">
                                <Info className="h-4 w-4 inline mr-1" />
                                Exceeds max capacity
                              </p>
                            )}
                          </div>
                          
                          <Button
                            className={`w-full ${isAvailable ? 'bg-hotel-500 hover:bg-hotel-600' : 'bg-gray-400'}`}
                            disabled={!isAvailable}
                            onClick={() => handleBookRoom(room)}
                          >
                            {isAvailable ? 'Book Now' : 'Not Available'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 border rounded-lg">
                <BedDouble className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <h3 className="text-lg font-medium mb-1">No rooms available</h3>
                <p className="text-muted-foreground">
                  There are currently no rooms available for this hotel.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Booking Dialog */}
      {bookingRoom && (
        <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Complete Your Booking</DialogTitle>
              <DialogDescription>
                Please confirm your booking details below
              </DialogDescription>
            </DialogHeader>
            
            <BookingForm
              hotel={hotel}
              room={bookingRoom}
              roomNumber={bookingRoomNumber}
              checkIn={checkIn}
              checkOut={checkOut}
              totalNights={1}
              onClose={() => setShowBookingDialog(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default HotelDetails;
