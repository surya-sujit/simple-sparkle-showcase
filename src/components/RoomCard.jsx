
import { useState } from 'react';
import { Card, Badge, Button, Modal, ListGroup, Form } from 'react-bootstrap';
import { format, differenceInCalendarDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import BookingForm from './BookingForm';

const RoomCard = ({ room, hotel, checkIn, checkOut }) => {
  const { state } = useAuth();
  const { isAuthenticated } = state;
  const navigate = useNavigate();
  
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedRoomNumber, setSelectedRoomNumber] = useState(null);

  // Format dates
  const formatDate = (date) => {
    return date ? format(new Date(date), 'MMM dd, yyyy') : 'Select date';
  };

  // Get the number of guests from search params
  const guestCount = 2; // Default to 2 if not specified
  
  // Calculate dynamic price based on guest count
  const getDynamicPrice = () => {
    // If guests exceed max people but are less than double, charge double
    if (guestCount > room.maxPeople && guestCount <= room.maxPeople * 2) {
      return room.price * 2;
    }
    return room.price;
  };
  
  const dynamicPrice = getDynamicPrice();

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
    
    // Set selected room and open booking modal
    setSelectedRoomNumber(roomNumber);
    setShowBookingModal(true);
  };

  // If room cannot accommodate the number of guests
  if (guestCount > room.maxPeople * 2) {
    return (
      <Card className="h-100 bg-light border-0 shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between mb-3">
            <div>
              <Card.Title>{room.title}</Card.Title>
              <Card.Subtitle className="text-muted">
                Max {room.maxPeople} people
              </Card.Subtitle>
            </div>
            <Badge bg="danger">
              Not available for {guestCount} guests
            </Badge>
          </div>
          <Card.Text className="text-muted small mb-3">{room.desc}</Card.Text>
          <Button variant="secondary" disabled className="w-100">
            Cannot accommodate {guestCount} guests
          </Button>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="h-100 border-0 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between mb-3">
          <div>
            <Card.Title>{room.title}</Card.Title>
            <Card.Subtitle className="text-muted">
              Max {room.maxPeople} {room.maxPeople === 1 ? 'person' : 'people'}
            </Card.Subtitle>
          </div>
          <div className="text-end">
            <div className="fw-bold text-primary">
              ${dynamicPrice}
            </div>
            <small className="text-muted">per night</small>
            
            {guestCount > room.maxPeople && guestCount <= room.maxPeople * 2 && (
              <Badge bg="warning" text="dark" className="d-block mt-1">
                Price doubled for {guestCount} guests
              </Badge>
            )}
          </div>
        </div>
        
        <Card.Text className="small mb-3">{room.desc}</Card.Text>
        
        <div className="mb-3">
          <p className="mb-2 fw-bold small">Room Numbers:</p>
          <div className="d-flex flex-wrap gap-2">
            {room.roomNumbers.map((roomNum) => {
              const isAvailable = checkRoomAvailability(roomNum.number);
              return (
                <Button
                  key={roomNum.number}
                  size="sm"
                  variant={isAvailable ? "outline-success" : "outline-secondary"}
                  onClick={() => isAvailable && handleRoomSelection(roomNum.number)}
                  disabled={!isAvailable}
                  className={isAvailable ? "room-available" : "room-unavailable"}
                >
                  Room {roomNum.number}
                </Button>
              );
            })}
          </div>
        </div>
        
        <ListGroup variant="flush" className="mb-3 border-top border-bottom">
          <ListGroup.Item className="d-flex justify-content-between px-0">
            <div className="d-flex align-items-center">
              <i className="bi bi-person me-2"></i>
              <span>{room.maxPeople} guests</span>
            </div>
            <div className="d-flex align-items-center">
              <i className="bi bi-check-circle me-2 text-success"></i>
              <span>Free cancellation</span>
            </div>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex justify-content-between px-0">
            <div className="d-flex align-items-center">
              <i className="bi bi-calendar me-2"></i>
              <span>{totalNights} nights</span>
            </div>
            <div className="d-flex align-items-center">
              {room.isCleaned ? (
                <>
                  <i className="bi bi-check-circle me-2 text-success"></i>
                  <span>Cleaned</span>
                </>
              ) : (
                <>
                  <i className="bi bi-x-circle me-2 text-danger"></i>
                  <span>Needs cleaning</span>
                </>
              )}
            </div>
          </ListGroup.Item>
        </ListGroup>
        
        {totalNights > 0 && dynamicPrice && (
          <div className="bg-light p-2 rounded mb-3">
            <div className="d-flex justify-content-between">
              <span>${dynamicPrice} × {totalNights} nights</span>
              <span className="fw-bold">${totalPrice}</span>
            </div>
          </div>
        )}
        
        <Button 
          variant="primary"
          className="w-100"
          onClick={() => handleRoomSelection(room.roomNumbers[0]?.number)}
          disabled={!room.roomNumbers.some(r => checkRoomAvailability(r.number))}
        >
          {isAuthenticated ? 'Book Now' : 'Sign In to Book'}
        </Button>
      </Card.Body>
      
      {/* Booking Modal */}
      <Modal 
        show={showBookingModal} 
        onHide={() => setShowBookingModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Complete Your Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BookingForm
            hotel={hotel}
            room={room}
            roomNumber={selectedRoomNumber}
            checkIn={checkIn}
            checkOut={checkOut}
            totalNights={totalNights}
            onClose={() => setShowBookingModal(false)}
          />
        </Modal.Body>
      </Modal>
    </Card>
  );
};

export default RoomCard;
