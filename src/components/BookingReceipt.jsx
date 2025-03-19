
import { useState } from 'react';
import { format } from 'date-fns';
import { Modal, Button, Row, Col, Card } from 'react-bootstrap';

const BookingReceipt = ({ booking, hotel, room, user, open, onClose }) => {
  const [isPrinting, setIsPrinting] = useState(false);
  
  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };
  
  const handleDownload = () => {
    // This is a basic implementation - in a real app you'd generate a PDF
    const fileContent = `
      BOOKING RECEIPT
      
      BOOKING ID: ${booking._id}
      DATE: ${format(new Date(), 'MMM dd, yyyy')}
      
      HOTEL: ${hotel.name}
      ADDRESS: ${hotel.address}, ${hotel.city}
      
      ROOM: ${room?.title || 'Standard Room'} (Room ${booking.roomNumber})
      CHECK-IN: ${format(new Date(booking.dateStart), 'MMM dd, yyyy')}
      CHECK-OUT: ${format(new Date(booking.dateEnd), 'MMM dd, yyyy')}
      
      TOTAL AMOUNT: $${booking.totalPrice}
      STATUS: ${booking.status.toUpperCase()}
    `;
    
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `booking-receipt-${booking._id}.txt`;
    a.click();
    
    URL.revokeObjectURL(url);
  };
  
  const isInDialog = open !== undefined && onClose !== undefined;
  const receiptContent = (
    <div className="p-4 space-y-4 print-container">
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h2 className="h3 mb-1">Booking Receipt</h2>
          <p className="text-muted">
            {format(new Date(), 'MMM dd, yyyy')}
          </p>
        </div>
        <div className="text-end">
          <p className="fw-bold mb-1">Booking ID:</p>
          <p className="font-monospace">{booking._id}</p>
        </div>
      </div>
      
      <hr />
      
      <Row className="mb-4">
        <Col md={6} className="mb-3 mb-md-0">
          <h5 className="mb-3">Hotel Information</h5>
          <p className="fw-medium mb-1">{hotel.name}</p>
          <p className="mb-1">{hotel.address}</p>
          <p>{hotel.city}</p>
        </Col>
        
        <Col md={6}>
          <h5 className="mb-3">Guest Information</h5>
          <p>Booking made by: {user ? user.username : booking.userId}</p>
        </Col>
      </Row>
      
      <div className="mb-4">
        <h5 className="mb-3">Booking Details</h5>
        <Card className="border">
          <Card.Body>
            <Row className="mb-2">
              <Col xs={6}>Room Type:</Col>
              <Col xs={6} className="text-end fw-medium">{room?.title || 'Standard Room'}</Col>
            </Row>
            <Row className="mb-2">
              <Col xs={6}>Room Number:</Col>
              <Col xs={6} className="text-end">{booking.roomNumber}</Col>
            </Row>
            <Row className="mb-2">
              <Col xs={6}>Check-in:</Col>
              <Col xs={6} className="text-end">{format(new Date(booking.dateStart), 'MMM dd, yyyy')}</Col>
            </Row>
            <Row className="mb-2">
              <Col xs={6}>Check-out:</Col>
              <Col xs={6} className="text-end">{format(new Date(booking.dateEnd), 'MMM dd, yyyy')}</Col>
            </Row>
            <Row>
              <Col xs={6}>Status:</Col>
              <Col xs={6} className="text-end">
                <span className={`fw-medium ${
                  booking.status === 'confirmed' ? 'text-success' : 
                  booking.status === 'cancelled' ? 'text-danger' :
                  'text-primary'
                }`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>
      
      <div className="mb-4">
        <h5 className="mb-3">Payment Summary</h5>
        <Card className="border">
          <Card.Body>
            <Row className="align-items-center">
              <Col xs={6}>
                <p className="fs-5 fw-medium mb-0">Total Amount Paid:</p>
              </Col>
              <Col xs={6} className="text-end">
                <p className="fs-5 fw-bold mb-0">${booking.totalPrice}</p>
              </Col>
            </Row>
            <p className="text-muted small mt-2 mb-0">
              Payment was successful. This serves as your official receipt.
            </p>
          </Card.Body>
        </Card>
      </div>
      
      <div className="text-muted small mt-4 print-only">
        <p>Thank you for choosing StayHaven for your accommodation needs.</p>
      </div>
    </div>
  );
  
  if (isInDialog) {
    return (
      <Modal size="lg" show={open} onHide={onClose} centered>
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center">
            <i className="bi bi-file-text me-2"></i>
            Booking Receipt
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {receiptContent}
        </Modal.Body>
        <Modal.Footer className="no-print">
          <Button variant="outline-secondary" onClick={handleDownload}>
            <i className="bi bi-download me-2"></i>
            Download
          </Button>
          <Button variant="primary" onClick={handlePrint}>
            <i className="bi bi-printer me-2"></i>
            Print
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
  
  // Standalone version
  return (
    <Card className="border-0 shadow-sm">
      <Card.Body>
        {receiptContent}
        
        <div className="d-flex justify-content-end mt-4 no-print">
          <Button variant="outline-secondary" className="me-2" onClick={handleDownload}>
            <i className="bi bi-download me-2"></i>
            Download
          </Button>
          <Button variant="primary" onClick={handlePrint}>
            <i className="bi bi-printer me-2"></i>
            Print
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default BookingReceipt;
