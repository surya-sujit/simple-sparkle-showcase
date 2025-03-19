
// This file re-exports the types from our types.js file
export * from '@/types';

// Search parameters model
export const SearchModel = {
  // Save search parameters to local storage
  saveSearchParams: (params) => {
    localStorage.setItem('searchParams', JSON.stringify({
      city: params.city || '',
      checkIn: params.checkIn || null,
      checkOut: params.checkOut || null,
      guests: params.guests || 1,
      priceRange: params.priceRange || [0, 1000]
    }));
  },
  
  // Get search parameters from local storage
  getSearchParams: () => {
    const params = localStorage.getItem('searchParams');
    if (!params) {
      return {
        city: '',
        checkIn: null,
        checkOut: null,
        guests: 1,
        priceRange: [0, 1000]
      };
    }
    
    return JSON.parse(params);
  },
  
  // Clear search parameters
  clearSearchParams: () => {
    localStorage.removeItem('searchParams');
  },
  
  // Get number of guests (for dynamic pricing)
  getGuestCount: () => {
    const params = SearchModel.getSearchParams();
    return params.guests || 1;
  },
  
  // Get price range filter
  getPriceRange: () => {
    const params = SearchModel.getSearchParams();
    return params.priceRange || [0, 1000];
  },
  
  // Update price range filter
  updatePriceRange: (min, max) => {
    const params = SearchModel.getSearchParams();
    params.priceRange = [min, max];
    SearchModel.saveSearchParams(params);
    return params;
  }
};

// Room pricing model
export const PricingModel = {
  // Calculate dynamic room price based on guests
  calculateDynamicPrice: (basePrice, maxPeople, guestCount) => {
    // If guest count is within room capacity, use base price
    if (guestCount <= maxPeople) {
      return basePrice;
    }
    
    // If guest count is up to double the capacity, double the price
    if (guestCount <= maxPeople * 2) {
      return basePrice * 2;
    }
    
    // Room cannot accommodate more than double its capacity
    return null;
  }
};

// Booking model
export const BookingModel = {
  // Format booking dates for display
  formatBookingDates: (dateStart, dateEnd) => {
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    };
    
    return `${formatDate(dateStart)} - ${formatDate(dateEnd)}`;
  }
};
