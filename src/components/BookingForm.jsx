
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Row, Col, Button, InputGroup, Card } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { format, differenceInCalendarDays, addDays } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { bookingAPI } from '@/services/api';

const BookingForm = ({ hotel, room, roomNumber, checkIn, checkOut, totalNights = 1, onClose }) => {
  const { state } = useAuth();
  const { user } = state;
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [dateRange, setDateRange] = useState({
    from: checkIn || undefined,
    to: checkOut || undefined,
  });

  // Fetch unavailable dates for this room
  useEffect(() => {
    const getRoomUnavailableDates = () => {
      const roomNumberObj = room.roomNumbers.find(r => r.number === roomNumber);
      if (roomNumberObj) {
        return roomNumberObj.unavailableDates.map(date => new Date(date));
      }
      return [];
    };
    
    setUnavailableDates(getRoomUnavailableDates());
  }, [room, roomNumber]);

  // Calculate total price when dates change
  useEffect(() => {
    if (dateRange.from && dateRange.to) {
      const nights = differenceInCalendarDays(dateRange.to, dateRange.from);
      setTotalPrice(room.price * Math.max(1, nights));
    } else {
      setTotalPrice(room.price * totalNights);
    }
  }, [dateRange, room.price, totalNights]);

  const handleStartDateChange = (date) => {
    setDateRange(prev => ({
      ...prev,
      from: date,
      to: prev.to && date >= prev.to ? addDays(date, 1) : prev.to
    }));
  };

  const handleEndDateChange = (date) => {
    setDateRange(prev => ({
      ...prev,
      to: date
    }));
  };

  const isDateUnavailable = (date) => {
    return unavailableDates.some(unavailableDate => 
      unavailableDate.toDateString() === date.toDateString()
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user?._id) {
      toast.error("You must be logged in to book a room");
      return;
    }
    
    if (!dateRange.from || !dateRange.to) {
      toast.error("Please select check-in and check-out dates");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Generate array of all dates in the range
      const allDates = [];
      let currentDate = new Date(dateRange.from);
      const endDate = new Date(dateRange.to);
      
      while (currentDate <= endDate) {
        // Check if date is already unavailable
        if (isDateUnavailable(currentDate)) {
          toast.error(`The date ${format(currentDate, 'MMM d, yyyy')} is not available`);
          setIsSubmitting(false);
          return;
        }
        
        allDates.push(new Date(currentDate));
        currentDate = addDays(currentDate, 1);
      }
      
      // Create booking
      const bookingData = {
        userId: user._id,
        hotelId: hotel._id,
        roomId: room._id,
        roomNumber: roomNumber,
        dateStart: dateRange.from,
        dateEnd: dateRange.to,
        totalPrice: totalPrice,
        status: 'confirmed',
      };
      
      const response = await bookingAPI.createBooking(bookingData);
      
      toast.success("Room booked successfully!");
      
      // Save booking ID to localStorage for receipt generation
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      bookings.push({
        id: response._id,
        hotelName: hotel.name,
        roomName: room.title,
        roomNumber,
        dateStart: dateRange.from,
        dateEnd: dateRange.to,
        totalPrice
      });
      localStorage.setItem('bookings', JSON.stringify(bookings));
      
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || "Failed to book room");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center p-4">
        <p className="mb-3">Please login to book this room</p>
        <Button onClick={() => navigate('/login')} variant="primary">
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <Form onSubmit={handleSubmit}>
      <h4 className="mb-4">Booking Details</h4>
      
      <Row className="mb-4">
        <Col md={6}>
          <Card className="h-100">
            <Card.Body>
              <h5 className="card-title mb-3">Guest Information</h5>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="bi bi-person"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    value={user.username}
                    readOnly
                    disabled
                  />
                </InputGroup>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="bi bi-envelope"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="email"
                    value={user.email}
                    readOnly
                    disabled
                  />
                </InputGroup>
              </Form.Group>
              
              <Form.Group>
                <Form.Label>Phone</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="bi bi-telephone"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    value={user.phone || "Not provided"}
                    readOnly
                    disabled
                  />
                </InputGroup>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="h-100">
            <Card.Body>
              <h5 className="card-title mb-3">Booking Information</h5>
              <p className="mb-2">
                <strong>Hotel:</strong> {hotel.name}
              </p>
              <p className="mb-2">
                <strong>Room:</strong> {room.title} (Room {roomNumber})
              </p>
              
              <Form.Group className="mb-3">
                <Form.Label>Check-in Date</Form.Label>
                <DatePicker
                  selected={dateRange.from}
                  onChange={handleStartDateChange}
                  selectsStart
                  startDate={dateRange.from}
                  endDate={dateRange.to}
                  minDate={new Date()}
                  filterDate={date => !isDateUnavailable(date)}
                  customInput={
                    <Form.Control />
                  }
                  dateFormat="MMMM d, yyyy"
                  className="form-control"
                />
              </Form.Group>
              
              <Form.Group>
                <Form.Label>Check-out Date</Form.Label>
                <DatePicker
                  selected={dateRange.to}
                  onChange={handleEndDateChange}
                  selectsEnd
                  startDate={dateRange.from}
                  endDate={dateRange.to}
                  minDate={dateRange.from ? addDays(dateRange.from, 1) : new Date()}
                  filterDate={date => !isDateUnavailable(date)}
                  customInput={
                    <Form.Control />
                  }
                  dateFormat="MMMM d, yyyy"
                  className="form-control"
                />
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Payment Summary */}
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">Payment Summary</h5>
        </Card.Header>
        <Card.Body>
          <Row className="mb-2">
            <Col xs={8}>Room rate:</Col>
            <Col xs={4} className="text-end">${room.price} per night</Col>
          </Row>
          
          {dateRange.from && dateRange.to && (
            <Row className="mb-2">
              <Col xs={8}>Stay duration:</Col>
              <Col xs={4} className="text-end">{differenceInCalendarDays(dateRange.to, dateRange.from)} nights</Col>
            </Row>
          )}
          
          <hr />
          
          <Row className="fw-bold">
            <Col xs={8}>Total:</Col>
            <Col xs={4} className="text-end">${totalPrice}</Col>
          </Row>
        </Card.Body>
      </Card>
      
      <div className="d-flex justify-content-between">
        <Button variant="outline-secondary" onClick={onClose}>
          Cancel
        </Button>
        
        <Button 
          type="submit"
          variant="primary"
          disabled={isSubmitting || !dateRange.from || !dateRange.to || totalPrice === 0}
        >
          {isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Processing...
            </>
          ) : "Confirm Booking"}
        </Button>
      </div>
    </Form>
  );
};

export default BookingForm;
