
import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Container, Row, Col, Breadcrumb, Badge, Carousel, Tab, Tabs, Card, Spinner, ListGroup, Alert } from 'react-bootstrap';
import { hotelAPI, roomAPI } from '@/services/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RoomCard from '@/components/RoomCard';
import SearchForm from '@/components/SearchForm';
import { toast } from 'sonner';

const HotelDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  
  // Get search parameters
  const [searchCriteria, setSearchCriteria] = useState({
    checkIn: searchParams.get('checkIn') ? new Date(searchParams.get('checkIn')) : null,
    checkOut: searchParams.get('checkOut') ? new Date(searchParams.get('checkOut')) : null,
    guests: Number(searchParams.get('guests')) || 1
  });
  
  // Fetch hotel data
  const { data: hotel, isLoading: isLoadingHotel, error: hotelError } = useQuery({
    queryKey: ['hotel', id],
    queryFn: () => hotelAPI.getHotelById(id),
    enabled: !!id,
  });
  
  // Fetch rooms data
  const { data: rooms, isLoading: isLoadingRooms, error: roomsError } = useQuery({
    queryKey: ['hotelRooms', id],
    queryFn: () => roomAPI.getRoomsByHotelId(id),
    enabled: !!id,
  });
  
  // State for filtering rooms
  const [filteredRooms, setFilteredRooms] = useState([]);
  
  // Update filtered rooms when rooms data changes or search criteria changes
  useEffect(() => {
    if (rooms) {
      // Filter rooms based on guest count
      const filtered = rooms.filter(room => room.maxPeople >= searchCriteria.guests);
      setFilteredRooms(filtered);
    }
  }, [rooms, searchCriteria]);
  
  // Handle search form submission
  const handleSearch = (newSearchCriteria) => {
    setSearchCriteria(newSearchCriteria);
  };
  
  // Handle errors
  useEffect(() => {
    if (hotelError) {
      toast.error('Failed to load hotel details');
    }
    if (roomsError) {
      toast.error('Failed to load room information');
    }
  }, [hotelError, roomsError]);
  
  // Loading state
  if (isLoadingHotel) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="flex-grow-1 d-flex justify-content-center align-items-center">
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Loading hotel details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Error state
  if (hotelError || !hotel) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="flex-grow-1">
          <Container className="py-5">
            <Alert variant="danger">
              <Alert.Heading>Error Loading Hotel</Alert.Heading>
              <p>We couldn't load the hotel details. Please try again later.</p>
              <hr />
              <div className="d-flex justify-content-end">
                <Link to="/hotels" className="btn btn-outline-danger">
                  Back to Hotels
                </Link>
              </div>
            </Alert>
          </Container>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      
      <main className="flex-grow-1 pt-5 mt-5">
        {/* Breadcrumb */}
        <Container className="py-3">
          <Breadcrumb>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>Home</Breadcrumb.Item>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/hotels" }}>Hotels</Breadcrumb.Item>
            <Breadcrumb.Item active>{hotel.name}</Breadcrumb.Item>
          </Breadcrumb>
        </Container>
        
        {/* Hotel Header */}
        <Container>
          <div className="d-md-flex justify-content-between align-items-start mb-4">
            <div>
              <h1 className="h2 mb-2">{hotel.name}</h1>
              <p className="mb-2 text-muted">
                <i className="bi bi-geo-alt me-1"></i>
                {hotel.address}, {hotel.city}
              </p>
              {hotel.rating && (
                <div className="d-flex align-items-center">
                  <Badge bg="success" className="d-flex align-items-center me-2">
                    <i className="bi bi-star-fill me-1"></i>
                    {hotel.rating.toFixed(1)}
                  </Badge>
                  <span className="small text-muted">
                    {hotel.rating >= 4.5 ? 'Exceptional' : 
                     hotel.rating >= 4 ? 'Excellent' : 
                     hotel.rating >= 3.5 ? 'Very Good' : 
                     hotel.rating >= 3 ? 'Good' : 'Average'}
                  </span>
                </div>
              )}
            </div>
            <div className="mt-3 mt-md-0">
              <div className="d-flex align-items-center">
                <h3 className="h5 mb-0 me-2">From ${hotel.cheapestPrice}</h3>
                <span className="small text-muted">per night</span>
              </div>
            </div>
          </div>
        </Container>
        
        {/* Hotel Gallery */}
        <Container className="mb-5">
          {hotel.photos && hotel.photos.length > 0 ? (
            <Row>
              {hotel.photos.length === 1 ? (
                <Col xs={12}>
                  <div className="position-relative rounded overflow-hidden" style={{ height: '400px' }}>
                    <img 
                      src={hotel.photos[0]} 
                      alt={hotel.name} 
                      className="w-100 h-100 object-fit-cover"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </Col>
              ) : (
                <Carousel indicators={false} className="hotel-carousel mb-4">
                  {hotel.photos.map((photo, index) => (
                    <Carousel.Item key={index}>
                      <div style={{ height: '400px' }}>
                        <img
                          className="d-block w-100 h-100"
                          src={photo}
                          alt={`${hotel.name} - Photo ${index + 1}`}
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    </Carousel.Item>
                  ))}
                </Carousel>
              )}
            </Row>
          ) : (
            <div className="bg-light rounded text-center p-5 mb-4">
              <i className="bi bi-image fs-1 text-muted mb-3 d-block"></i>
              <p className="text-muted">No photos available for this hotel</p>
            </div>
          )}
        </Container>
        
        {/* Search and Booking Section */}
        <Container className="mb-5">
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h3 className="h5 mb-3">Check Room Availability</h3>
              <SearchForm 
                initialValues={searchCriteria}
                onSearch={handleSearch}
              />
            </Card.Body>
          </Card>
        </Container>
        
        {/* Hotel Info Tabs */}
        <Container className="mb-5">
          <Tabs 
            defaultActiveKey="rooms" 
            id="hotel-info-tabs"
            className="mb-4"
          >
            <Tab eventKey="rooms" title="Rooms">
              {isLoadingRooms ? (
                <div className="text-center py-4">
                  <Spinner animation="border" size="sm" variant="primary" />
                  <p className="mt-2">Loading rooms...</p>
                </div>
              ) : filteredRooms.length > 0 ? (
                <Row className="g-4">
                  {filteredRooms.map(room => (
                    <Col md={6} lg={4} key={room._id}>
                      <RoomCard 
                        room={room} 
                        hotel={hotel}
                        checkIn={searchCriteria.checkIn}
                        checkOut={searchCriteria.checkOut}
                      />
                    </Col>
                  ))}
                </Row>
              ) : (
                <Alert variant="warning">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  No rooms available for the selected criteria. Try adjusting your search.
                </Alert>
              )}
            </Tab>
            
            <Tab eventKey="about" title="About the Hotel">
              <Card border="0" className="shadow-sm">
                <Card.Body>
                  <h3 className="h5 mb-3">About {hotel.name}</h3>
                  <p>{hotel.desc || 'No description available for this hotel.'}</p>
                  
                  <h4 className="h6 mt-4 mb-3">Hotel Features</h4>
                  <Row>
                    <Col md={6}>
                      <ListGroup variant="flush">
                        <ListGroup.Item className="border-0 ps-0">
                          <i className="bi bi-wifi me-2"></i> Free WiFi
                        </ListGroup.Item>
                        <ListGroup.Item className="border-0 ps-0">
                          <i className="bi bi-p-circle me-2"></i> Parking Available
                        </ListGroup.Item>
                        <ListGroup.Item className="border-0 ps-0">
                          <i className="bi bi-cup-hot me-2"></i> Breakfast Included
                        </ListGroup.Item>
                      </ListGroup>
                    </Col>
                    <Col md={6}>
                      <ListGroup variant="flush">
                        <ListGroup.Item className="border-0 ps-0">
                          <i className="bi bi-snow me-2"></i> Air Conditioning
                        </ListGroup.Item>
                        <ListGroup.Item className="border-0 ps-0">
                          <i className="bi bi-telephone me-2"></i> 24/7 Front Desk
                        </ListGroup.Item>
                        <ListGroup.Item className="border-0 ps-0">
                          <i className="bi bi-geo me-2"></i> {hotel.distance || 'City Center'}
                        </ListGroup.Item>
                      </ListGroup>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Tab>
            
            <Tab eventKey="location" title="Location">
              <Card border="0" className="shadow-sm">
                <Card.Body>
                  <h3 className="h5 mb-3">Location & Surroundings</h3>
                  <p>
                    <i className="bi bi-geo-alt me-2"></i>
                    {hotel.address}, {hotel.city}
                  </p>
                  
                  <div className="bg-light p-3 rounded">
                    <p className="mb-1">
                      <i className="bi bi-signpost-2 me-2"></i>
                      <strong>Distance from city center:</strong> {hotel.distance || 'N/A'}
                    </p>
                    <p className="mb-0">
                      <i className="bi bi-lightning me-2"></i>
                      <strong>Nearest attractions:</strong> Local shops, restaurants, and tourist sites
                    </p>
                  </div>
                  
                  {/* Google Maps placeholder - you'd implement actual Google Maps here */}
                  <div className="bg-light mt-3 rounded overflow-hidden">
                    <div className="ratio ratio-16x9">
                      <div className="d-flex align-items-center justify-content-center bg-secondary bg-opacity-25 text-muted">
                        <div className="text-center">
                          <i className="bi bi-map fs-1 mb-2 d-block"></i>
                          <p>Map view would be displayed here</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
};

export default HotelDetail;
