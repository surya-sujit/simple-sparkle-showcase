
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, BedDouble, Users, CheckCircle2, XCircle, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { PricingModel, SearchModel } from '@/models';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { bookingAPI } from '@/services/api';

const RoomCard = ({ room, hotel, checkIn, checkOut }) => {
  const { state } = useAuth();
  const { isAuthenticated } = state;
  const navigate = useNavigate();
  
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedRoomNumber, setSelectedRoomNumber] = useState(null);
  const [isBooking, setIsBooking] = useState(false);

  // Get the number of guests from search params
  const guestCount = SearchModel.getGuestCount();
  
  // Calculate dynamic price based on guest count
  const dynamicPrice = PricingModel.calculateDynamicPrice(
    room.price,
    room.maxPeople,
    guestCount
  );
  
  // Check if the room is available for the selected dates
  const checkRoomAvailability = (roomNumber) => {
    if (!checkIn || !checkOut) return true;
    
    // Convert dates to timestamps for comparison
    const checkInTime = new Date(checkIn).getTime();
    const checkOutTime = new Date(checkOut).getTime();
    
    // Find the room number object
    const roomObj = room.roomNumbers.find(r => r.number === roomNumber);
    
    if (!roomObj) return false;
    
    // Check if any of the unavailable dates fall within our range
    return !roomObj.unavailableDates.some(date => {
      const unavailableDate = new Date(date).getTime();
      return unavailableDate >= checkInTime && unavailableDate <= checkOutTime;
    });
  };

  // Calculate total nights and total price
  const calculateTotalNights = () => {
    if (!checkIn || !checkOut) return 1;
    
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays || 1;
  };
  
  const totalNights = calculateTotalNights();
  const totalPrice = dynamicPrice * totalNights;

  const handleRoomSelection = (roomNumber) => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      toast.error('Please login to book a room');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    
    // If dates are not selected, show error
    if (!checkIn || !checkOut) {
      toast.error('Please select check-in and check-out dates');
      return;
    }
    
    // Check if room is available for selected dates
    if (!checkRoomAvailability(roomNumber)) {
      toast.error('This room is not available for the selected dates');
      return;
    }
    
    // Set selected room and open booking dialog
    setSelectedRoomNumber(roomNumber);
    setIsBookingOpen(true);
  };

  const handleBookRoom = async () => {
    if (!state.user?._id || !selectedRoomNumber) return;
    
    setIsBooking(true);
    
    try {
      // Create booking
      const bookingData = {
        userId: state.user._id,
        hotelId: hotel._id,
        roomId: room._id,
        roomNumber: selectedRoomNumber,
        dateStart: checkIn,
        dateEnd: checkOut,
        totalPrice: totalPrice,
        status: 'confirmed'
      };
      
      await bookingAPI.createBooking(bookingData);
      
      toast.success('Room booked successfully!');
      setIsBookingOpen(false);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error booking room:', error);
      toast.error('Failed to book room');
    } finally {
      setIsBooking(false);
    }
  };

  // Price display notification when price is adjusted for guest count
  const PriceNotification = () => {
    if (guestCount > room.maxPeople && guestCount <= room.maxPeople * 2) {
      return (
        <Badge variant="outline" className="ml-2 text-amber-700 bg-amber-50 border-amber-200">
          Price doubled for {guestCount} guests
        </Badge>
      );
    }
    return null;
  };

  // If room cannot accommodate the number of guests
  if (guestCount > room.maxPeople * 2) {
    return (
      <Card className="bg-gray-50 border-gray-200">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg text-gray-400">{room.title}</CardTitle>
              <CardDescription className="text-gray-400">Max {room.maxPeople} people</CardDescription>
            </div>
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              Not available for {guestCount} guests
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-400 mb-4">{room.desc}</p>
          <Button variant="outline" disabled className="w-full text-gray-400">
            Cannot accommodate {guestCount} guests
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{room.title}</CardTitle>
            <CardDescription>
              Max {room.maxPeople} {room.maxPeople === 1 ? 'person' : 'people'}
            </CardDescription>
          </div>
          <div className="flex items-center">
            <span className="font-semibold text-lg">${dynamicPrice}</span>
            <span className="text-muted-foreground text-sm ml-1">/ night</span>
            <PriceNotification />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">{room.desc}</p>
        
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {room.roomNumbers.map((roomNum) => (
            <button
              key={roomNum.number}
              onClick={() => handleRoomSelection(roomNum.number)}
              disabled={!checkRoomAvailability(roomNum.number)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                checkRoomAvailability(roomNum.number) 
                  ? 'bg-hotel-50 text-hotel-700 hover:bg-hotel-100 cursor-pointer' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Room {roomNum.number}
            </button>
          ))}
        </div>
        
        <Separator className="my-4" />
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <BedDouble className="h-4 w-4 mr-2" />
            <span>{room.maxPeople} {room.maxPeople === 1 ? 'bed' : 'beds'}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-2" />
            <span>For {room.maxPeople} {room.maxPeople === 1 ? 'guest' : 'guests'}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            {room.isCleaned ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                <span>Cleaned</span>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 mr-2 text-red-500" />
                <span>Needs cleaning</span>
              </>
            )}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{checkIn && checkOut ? `${totalNights} nights` : 'Select dates'}</span>
          </div>
        </div>
        
        {totalNights > 0 && dynamicPrice && (
          <div className="bg-gray-50 p-3 rounded-md mb-4">
            <div className="flex justify-between text-sm">
              <span>${dynamicPrice} × {totalNights} nights</span>
              <span>${totalPrice}</span>
            </div>
          </div>
        )}
        
        <Button 
          className="w-full bg-hotel-500 hover:bg-hotel-600"
          onClick={() => handleRoomSelection(room.roomNumbers[0]?.number)}
          disabled={!room.roomNumbers.some(r => checkRoomAvailability(r.number))}
        >
          {isAuthenticated ? 'Book Now' : 'Sign In to Book'}
        </Button>
      </CardContent>
      
      {/* Booking Confirmation Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Your Booking</DialogTitle>
            <DialogDescription>
              Review the details of your booking before confirming.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {hotel.photos && hotel.photos[0] && (
              <div className="overflow-hidden rounded-md">
                <AspectRatio ratio={16 / 9}>
                  <img 
                    src={hotel.photos[0]} 
                    alt={hotel.name} 
                    className="w-full h-full object-cover"
                  />
                </AspectRatio>
              </div>
            )}
            
            <div>
              <h3 className="font-semibold">{hotel.name}</h3>
              <p className="text-sm text-muted-foreground">{hotel.address}, {hotel.city}</p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium">{room.title}</h4>
              <p className="text-sm">Room {selectedRoomNumber}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Check-in</p>
                <p className="font-medium">
                  {checkIn ? format(new Date(checkIn), 'MMM dd, yyyy') : 'Not selected'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Check-out</p>
                <p className="font-medium">
                  {checkOut ? format(new Date(checkOut), 'MMM dd, yyyy') : 'Not selected'}
                </p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Guests</p>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <p className="font-medium">{guestCount} {guestCount === 1 ? 'Guest' : 'Guests'}</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-sm">${dynamicPrice} × {totalNights} nights</p>
                <p className="text-sm">${dynamicPrice * totalNights}</p>
              </div>
              <div className="flex justify-between font-semibold">
                <p>Total</p>
                <p>${totalPrice}</p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBookingOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleBookRoom} 
              disabled={isBooking}
              className="bg-hotel-500 hover:bg-hotel-600"
            >
              {isBooking ? 'Processing...' : 'Confirm Booking'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default RoomCard;
