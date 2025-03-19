
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, InputGroup, Button, Spinner, Badge } from 'react-bootstrap';
import { hotelAPI } from '@/services/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HotelCard from '@/components/HotelCard';
import SearchForm from '@/components/SearchForm';
import { toast } from 'sonner';

const Hotels = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  const [searchParams, setSearchParams] = useState({
    city: queryParams.get('city') || '',
    checkIn: queryParams.get('checkIn') ? new Date(queryParams.get('checkIn')) : null,
    checkOut: queryParams.get('checkOut') ? new Date(queryParams.get('checkOut')) : null,
    guests: Number(queryParams.get('guests')) || 1,
    minPrice: Number(queryParams.get('minPrice')) || 0,
    maxPrice: Number(queryParams.get('maxPrice')) || 1000
  });

  const { data: allHotels, isLoading, error } = useQuery({
    queryKey: ['hotels'],
    queryFn: hotelAPI.getAllHotels,
  });

  // Filter hotels based on search criteria (primarily city)
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.city || '');
  
  useEffect(() => {
    if (allHotels) {
      const filtered = allHotels.filter((hotel) => {
        if (searchParams.city && hotel.city) {
          return hotel.city.toLowerCase().includes(searchParams.city.toLowerCase());
        }
        return true;
      });
      setFilteredHotels(filtered);
    }
  }, [allHotels, searchParams.city]);

  useEffect(() => {
    if (error) {
      toast.error('Failed to fetch hotels. Please try again later.');
    }
    
    // Update search params from URL when location changes
    const city = queryParams.get('city');
    const checkIn = queryParams.get('checkIn');
    const checkOut = queryParams.get('checkOut');
    const guests = queryParams.get('guests');
    const minPrice = queryParams.get('minPrice');
    const maxPrice = queryParams.get('maxPrice');
    
    if (city || checkIn || checkOut || guests || minPrice || maxPrice) {
      setSearchParams({
        city: city || '',
        checkIn: checkIn ? new Date(checkIn) : null,
        checkOut: checkOut ? new Date(checkOut) : null,
        guests: Number(guests) || 1,
        minPrice: Number(minPrice) || 0,
        maxPrice: Number(maxPrice) || 1000
      });
      
      setSearchTerm(city || '');
    }
  }, [error, location.search, queryParams]);

  const handleSearch = (searchCriteria) => {
    setSearchParams(searchCriteria);
    
    // Update URL with search params
    const params = new URLSearchParams();
    if (searchCriteria.city) params.set('city', searchCriteria.city);
    if (searchCriteria.checkIn) params.set('checkIn', searchCriteria.checkIn.toISOString());
    if (searchCriteria.checkOut) params.set('checkOut', searchCriteria.checkOut.toISOString());
    if (searchCriteria.guests) params.set('guests', searchCriteria.guests.toString());
    if (searchCriteria.minPrice) params.set('minPrice', searchCriteria.minPrice.toString());
    if (searchCriteria.maxPrice) params.set('maxPrice', searchCriteria.maxPrice.toString());
    
    navigate(`/hotels?${params.toString()}`);
  };
  
  const handleQuickSearch = (e) => {
    e.preventDefault();
    handleSearch({
      ...searchParams,
      city: searchTerm
    });
  };

  const handleHotelClick = (hotelId) => {
    navigate(`/hotels/${hotelId}?checkIn=${searchParams.checkIn?.toISOString() || ''}&checkOut=${searchParams.checkOut?.toISOString() || ''}&guests=${searchParams.guests || 1}`);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      
      <main className="flex-grow-1 pt-5 mt-5">
        {/* Hero Section */}
        <section className="bg-primary bg-opacity-10 py-5">
          <Container>
            <h1 className="h2 text-center mb-3">
              Find Your Perfect Stay
            </h1>
            <p className="text-muted text-center mb-4 mx-auto" style={{ maxWidth: '700px' }}>
              Browse our curated selection of hotels, resorts, and vacation rentals to find the perfect accommodation for your next trip.
            </p>
            
            {/* Quick Search Bar */}
            <Form onSubmit={handleQuickSearch} className="mb-4 mx-auto" style={{ maxWidth: '600px' }}>
              <InputGroup className="shadow-sm">
                <InputGroup.Text>
                  <i className="bi bi-geo-alt"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Where are you going? (city, destination)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button type="submit" variant="primary">
                  Search
                </Button>
              </InputGroup>
            </Form>
            
            {/* Advanced Search Form */}
            <div className="mx-auto" style={{ maxWidth: '900px' }}>
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <SearchForm 
                    initialValues={searchParams}
                    onSearch={handleSearch} 
                  />
                </Card.Body>
              </Card>
            </div>
          </Container>
        </section>
        
        {/* Hotels List */}
        <section className="py-5">
          <Container>
            <h2 className="h3 mb-4">
              {searchParams.city 
                ? `Hotels in ${searchParams.city}` 
                : "Available Hotels"}
            </h2>
            
            {isLoading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted">Loading hotels...</p>
              </div>
            ) : error ? (
              <div className="text-center py-5">
                <h3 className="text-danger mb-3">Unable to load hotels</h3>
                <p className="text-muted">
                  There was an error fetching the hotels. Please try again later.
                </p>
              </div>
            ) : filteredHotels.length > 0 ? (
              <Row className="g-4">
                {filteredHotels.map((hotel) => (
                  <Col key={hotel._id} md={6} lg={4}>
                    <div 
                      onClick={() => handleHotelClick(hotel._id)}
                      className="cursor-pointer h-100"
                      style={{ cursor: 'pointer' }}
                    >
                      <HotelCard hotel={hotel} />
                    </div>
                  </Col>
                ))}
              </Row>
            ) : (
              <div className="text-center py-5">
                <i className="bi bi-building fs-1 text-muted mb-3"></i>
                <h3 className="h4 mb-2">No hotels found</h3>
                <p className="text-muted mb-4">
                  Try adjusting your search criteria or check back later.
                </p>
                <Button 
                  variant="primary" 
                  onClick={() => {
                    setSearchParams({
                      city: '',
                      checkIn: null,
                      checkOut: null,
                      guests: 1,
                      minPrice: 0,
                      maxPrice: 1000
                    });
                    setSearchTerm('');
                    navigate('/hotels');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </Container>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Hotels;
