
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { hotelAPI } from '@/services/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HotelCard from '@/components/HotelCard';
import SearchForm from '@/components/SearchForm';
import { Loader2, Hotel as HotelIcon, MapPin, Calendar, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16 md:pt-20">
        {/* Hero Section */}
        <section className="bg-hotel-50 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">
              Find Your Perfect Stay
            </h1>
            <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
              Browse our curated selection of hotels, resorts, and vacation rentals to find the perfect accommodation for your next trip.
            </p>
            
            {/* Quick Search Bar */}
            <form onSubmit={handleQuickSearch} className="relative max-w-xl mx-auto mb-8">
              <div className="flex">
                <div className="relative flex-grow">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Where are you going? (city, destination)"
                    className="pl-10 pr-3 py-2 w-full rounded-l-md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button type="submit" className="bg-hotel-500 hover:bg-hotel-600 rounded-l-none">
                  Search
                </Button>
              </div>
            </form>
            
            {/* Advanced Search Form */}
            <div className="max-w-4xl mx-auto bg-white p-4 rounded-lg shadow-md">
              <SearchForm 
                initialValues={searchParams}
                onSearch={handleSearch} 
              />
            </div>
          </div>
        </section>
        
        {/* Hotels List */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">
              {searchParams.city 
                ? `Hotels in ${searchParams.city}` 
                : "Available Hotels"}
            </h2>
            
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-hotel-500" />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500 mb-4">Unable to load hotels</p>
                <p className="text-muted-foreground">
                  There was an error fetching the hotels. Please try again later.
                </p>
              </div>
            ) : filteredHotels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHotels.map((hotel) => (
                  <div 
                    key={hotel._id} 
                    onClick={() => handleHotelClick(hotel._id)}
                    className="cursor-pointer"
                  >
                    <HotelCard hotel={hotel} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <HotelIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <p className="text-xl font-medium mb-2">No hotels found</p>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search criteria or check back later.
                </p>
                <Button 
                  className="bg-hotel-500 hover:bg-hotel-600" 
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
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Hotels;
