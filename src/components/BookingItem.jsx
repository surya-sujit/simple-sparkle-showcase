
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Card, Row, Col, Button, Badge } from 'react-bootstrap';
import BookingReceipt from './BookingReceipt';

// Helper function to format dates
const formatDate = (dateString) => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return format(date, 'MMM dd, yyyy');
};

// Create a default Hotel object
const defaultHotel = {
  name: 'Unknown Hotel',
  city: 'Unknown Location',
  photos: [],
  type: 'hotel',
  address: 'Unknown Address',
  distance: '0 km',
  title: 'Unknown Hotel',
  desc: 'No description available',
  rating: 0,
  rooms: [],
  cheapestPrice: 0,
  featured: false
};

// Create a default Room object
const defaultRoom = {
  title: 'Standard Room',
  maxPeople: 2,
  price: 0,
  desc: 'No description available',
  roomNumbers: [],
  isCleaned: true,
  isAssigned: false,
  bookedBy: null
};

const BookingItem = ({ booking, onCancel, isDateInFuture }) => {
  const [showReceipt, setShowReceipt] = useState(false);
  const hotel = booking.hotel || defaultHotel;
  const room = booking.room || defaultRoom;
  
  return (
    <Card className="mb-3 border-0 shadow-sm hover-shadow animate-fade-in-up">
      <Card.Body className="p-0">
        <Row className="g-0">
          {/* Image */}
          <Col md={3} className="position-relative">
            {hotel.photos && hotel.photos[0] ? (
              <div className="h-100" style={{ minHeight: '180px' }}>
                <img 
                  src={hotel.photos[0]} 
                  alt={hotel.name}
                  className="w-100 h-100 object-fit-cover"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ) : (
              <div className="h-100 d-flex flex-column justify-content-center align-items-center bg-light text-muted" style={{ minHeight: '180px' }}>
                <i className="bi bi-geo-alt fs-1 mb-2"></i>
                <p>No image</p>
              </div>
            )}
          </Col>
          
          {/* Details */}
          <Col md={6}>
            <div className="p-3">
              <h5 className="mb-1">{hotel.name}</h5>
              <p className="text-muted small mb-2">
                <i className="bi bi-geo-alt me-1"></i>
                {hotel.city}
              </p>
              
              <div className="mt-3 mb-1">
                <p className="mb-1 small">
                  <span className="fw-bold">Room:</span> {room.title} (Room {booking.roomNumber})
                </p>
                <p className="mb-1 small">
                  <span className="fw-bold">Dates:</span> {formatDate(booking.dateStart)} - {formatDate(booking.dateEnd)}
                </p>
                <p className="mb-1 small">
                  <span className="fw-bold">Guests:</span> {room.maxPeople} max
                </p>
              </div>
              
              <div className="mt-3">
                <Link 
                  to={`/hotels/${booking.hotelId}`}
                  className="btn btn-sm btn-link text-decoration-none p-0 me-3"
                >
                  View Hotel
                </Link>
                <Button 
                  variant="link"
                  size="sm"
                  className="text-decoration-none p-0"
                  onClick={() => setShowReceipt(true)}
                >
                  <i className="bi bi-file-text me-1"></i>
                  View Receipt
                </Button>
              </div>
            </div>
          </Col>
          
          {/* Price and Status */}
          <Col md={3} className="bg-light">
            <div className="p-3 h-100 d-flex flex-column justify-content-between">
              <div>
                <p className="text-muted small mb-1">Total Price</p>
                <p className="h5 fw-bold mb-3">${booking.totalPrice}</p>
                
                <p className="text-muted small mb-1">Status</p>
                <div>
                  {booking.status === 'confirmed' ? (
                    <Badge bg="success" className="p-2">
                      <i className="bi bi-check-circle me-1"></i>
                      Confirmed
                    </Badge>
                  ) : booking.status === 'cancelled' ? (
                    <Badge bg="danger" className="p-2">
                      <i className="bi bi-x-circle me-1"></i>
                      Cancelled
                    </Badge>
                  ) : (
                    <Badge bg="secondary" className="p-2">
                      <i className="bi bi-clock-history me-1"></i>
                      Completed
                    </Badge>
                  )}
                </div>
              </div>
              
              {booking.status === 'confirmed' && isDateInFuture(booking.dateStart) && (
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  className="mt-3"
                  onClick={() => onCancel(booking._id || '')}
                >
                  Cancel Booking
                </Button>
              )}
            </div>
          </Col>
        </Row>
      </Card.Body>
      
      {/* Receipt Modal */}
      <BookingReceipt 
        booking={booking}
        hotel={hotel}
        room={room}
        open={showReceipt}
        onClose={() => setShowReceipt(false)}
      />
    </Card>
  );
};

export default BookingItem;
