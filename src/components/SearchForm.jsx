
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { CalendarIcon, Users, MapPin, Search, DollarSign } from 'lucide-react';

const SearchForm = ({ initialValues = {}, onSearch }) => {
  const [searchParams, setSearchParams] = useState({
    city: '',
    checkIn: null,
    checkOut: null,
    guests: 1,
    minPrice: 0,
    maxPrice: 1000,
    ...initialValues
  });

  const [priceRange, setPriceRange] = useState([
    searchParams.minPrice || 0,
    searchParams.maxPrice || 1000
  ]);

  // Update the search params when initialValues changes
  useEffect(() => {
    if (initialValues) {
      setSearchParams(prev => ({
        ...prev,
        ...initialValues
      }));
      
      setPriceRange([
        initialValues.minPrice || 0,
        initialValues.maxPrice || 1000
      ]);
    }
  }, [initialValues]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGuestsChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setSearchParams(prev => ({
        ...prev,
        guests: value
      }));
    }
  };

  const handlePriceRangeChange = (value) => {
    setPriceRange(value);
    setSearchParams(prev => ({
      ...prev,
      minPrice: value[0],
      maxPrice: value[1]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Destination */}
        <div>
          <Label htmlFor="city">Destination</Label>
          <div className="relative mt-1">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="city"
              name="city"
              placeholder="City or destination"
              value={searchParams.city}
              onChange={handleInputChange}
              className="pl-10"
            />
          </div>
        </div>

        {/* Check-in Date */}
        <div>
          <Label>Check-in Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full mt-1 justify-start text-left font-normal",
                  !searchParams.checkIn && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {searchParams.checkIn ? (
                  format(searchParams.checkIn, "PPP")
                ) : (
                  "Select date"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={searchParams.checkIn}
                onSelect={(date) =>
                  setSearchParams(prev => ({ ...prev, checkIn: date }))
                }
                disabled={(date) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return date < today;
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Check-out Date */}
        <div>
          <Label>Check-out Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full mt-1 justify-start text-left font-normal",
                  !searchParams.checkOut && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {searchParams.checkOut ? (
                  format(searchParams.checkOut, "PPP")
                ) : (
                  "Select date"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={searchParams.checkOut}
                onSelect={(date) =>
                  setSearchParams(prev => ({ ...prev, checkOut: date }))
                }
                disabled={(date) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return date < today || (searchParams.checkIn && date <= searchParams.checkIn);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Guests */}
        <div>
          <Label htmlFor="guests">Guests</Label>
          <div className="relative mt-1">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="guests"
              name="guests"
              type="number"
              min="1"
              placeholder="Number of guests"
              value={searchParams.guests}
              onChange={handleGuestsChange}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Price Range */}
      <div>
        <div className="flex justify-between items-center">
          <Label className="mb-2">Price Range</Label>
          <span className="text-sm">
            ${priceRange[0]} - ${priceRange[1]}
          </span>
        </div>
        <Slider
          defaultValue={[0, 1000]}
          value={priceRange}
          onValueChange={handlePriceRangeChange}
          min={0}
          max={1000}
          step={10}
          className="my-4"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="bg-hotel-500 hover:bg-hotel-600">
          <Search className="mr-2 h-4 w-4" />
          Search Hotels
        </Button>
      </div>
    </form>
  );
};

export default SearchForm;
