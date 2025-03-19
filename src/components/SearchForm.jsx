
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { SearchModel } from '@/models';
import { Slider } from '@/components/ui/slider';

const SearchForm = ({ variant = 'default' }) => {
  const navigate = useNavigate();
  const [city, setCity] = useState('');
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);
  const [priceRange, setPriceRange] = useState([50, 500]);
  
  // Load saved search params if available
  useEffect(() => {
    const savedParams = SearchModel.getSearchParams();
    if (savedParams) {
      setCity(savedParams.city || '');
      setCheckIn(savedParams.checkIn ? new Date(savedParams.checkIn) : null);
      setCheckOut(savedParams.checkOut ? new Date(savedParams.checkOut) : null);
      setGuests(savedParams.guests || 1);
      setPriceRange(savedParams.priceRange || [50, 500]);
    }
  }, []);

  const handleSearch = () => {
    // Save search parameters for dynamic pricing
    const searchParams = {
      city,
      checkIn,
      checkOut,
      guests,
      priceRange
    };
    
    SearchModel.saveSearchParams(searchParams);
    
    // Navigate to hotels page with search parameters
    navigate(`/hotels?city=${city}&guests=${guests}&priceMin=${priceRange[0]}&priceMax=${priceRange[1]}`);
  };

  // Check if search button should be disabled
  const isSearchDisabled = !city;

  return (
    <div className={`w-full rounded-lg shadow-md overflow-hidden ${variant === 'hero' ? 'bg-white/95 backdrop-blur-sm' : 'bg-white'}`}>
      <div className={`grid grid-cols-1 ${variant === 'hero' ? 'md:grid-cols-12 gap-0' : 'md:grid-cols-2 lg:grid-cols-4 gap-4'} p-4`}>
        {/* Location */}
        <div className={`space-y-2 ${variant === 'hero' ? 'md:col-span-4' : ''}`}>
          <Label htmlFor="location">Location</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="location"
              placeholder="Where are you going?"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
        </div>

        {/* Check-in */}
        <div className={`space-y-2 ${variant === 'hero' ? 'md:col-span-2' : ''}`}>
          <Label>Check-in</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkIn ? format(checkIn, 'PPP') : <span className="text-muted-foreground">Select date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={checkIn}
                onSelect={setCheckIn}
                initialFocus
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Check-out */}
        <div className={`space-y-2 ${variant === 'hero' ? 'md:col-span-2' : ''}`}>
          <Label>Check-out</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkOut ? format(checkOut, 'PPP') : <span className="text-muted-foreground">Select date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={checkOut}
                onSelect={setCheckOut}
                initialFocus
                disabled={(date) => date <= checkIn || date < new Date(new Date().setHours(0, 0, 0, 0))}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Guests */}
        <div className={`space-y-2 ${variant === 'hero' ? 'md:col-span-2' : ''}`}>
          <Label htmlFor="guests">Guests</Label>
          <Input
            id="guests"
            type="number"
            min={1}
            max={10}
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
            className="w-full"
          />
        </div>

        {/* Price Range Slider - Only shown in expanded form */}
        {variant !== 'hero' && (
          <div className="space-y-2 md:col-span-2">
            <Label>Price Range ($ per night)</Label>
            <div className="px-2 pt-6 pb-2">
              <Slider
                defaultValue={priceRange}
                min={0}
                max={1000}
                step={10}
                value={priceRange}
                onValueChange={setPriceRange}
                className="my-5"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </div>
        )}

        {/* Search Button */}
        <div className={`${variant === 'hero' ? 'md:col-span-2' : 'md:col-span-2 lg:col-span-1'} flex items-end`}>
          <Button
            onClick={handleSearch}
            disabled={isSearchDisabled}
            className="w-full bg-hotel-500 hover:bg-hotel-600"
          >
            Search
          </Button>
        </div>
      </div>

      {/* Expanded Price Range - Only shown in hero form */}
      {variant === 'hero' && (
        <div className="px-4 pb-4 pt-0">
          <div className="space-y-2">
            <Label>Price Range ($ per night)</Label>
            <div className="px-2 pt-2 pb-1">
              <Slider
                defaultValue={priceRange}
                min={0}
                max={1000}
                step={10}
                value={priceRange}
                onValueChange={setPriceRange}
                className="my-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchForm;
