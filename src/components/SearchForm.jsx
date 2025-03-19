
import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button, InputGroup } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';

const SearchForm = ({ initialValues = {}, onSearch }) => {
  const navigate = useNavigate();
  
  const [searchParams, setSearchParams] = useState({
    city: '',
    checkIn: null,
    checkOut: null,
    guests: 1,
    minPrice: 0,
    maxPrice: 1000,
    ...initialValues
  });

  // Update the search params when initialValues changes
  useEffect(() => {
    if (initialValues) {
      setSearchParams(prev => ({
        ...prev,
        ...initialValues
      }));
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

  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: parseInt(value)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create URL search params
    const params = new URLSearchParams();
    if (searchParams.city) params.append('city', searchParams.city);
    if (searchParams.checkIn) params.append('checkIn', searchParams.checkIn.toISOString());
    if (searchParams.checkOut) params.append('checkOut', searchParams.checkOut.toISOString());
    if (searchParams.guests) params.append('guests', searchParams.guests.toString());
    if (searchParams.minPrice) params.append('minPrice', searchParams.minPrice.toString());
    if (searchParams.maxPrice) params.append('maxPrice', searchParams.maxPrice.toString());
    
    // Navigate to hotels page with search parameters
    navigate(`/hotels?${params.toString()}`);
    
    // Call onSearch if provided
    if (onSearch) {
      onSearch(searchParams);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="p-3 bg-white rounded shadow-sm">
      <Row className="g-3">
        {/* Destination */}
        <Col md={6} lg={3}>
          <Form.Group>
            <Form.Label>Destination</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <i className="bi bi-geo-alt"></i>
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="City or destination"
                name="city"
                value={searchParams.city}
                onChange={handleInputChange}
              />
            </InputGroup>
          </Form.Group>
        </Col>

        {/* Check-in Date */}
        <Col md={6} lg={3}>
          <Form.Group>
            <Form.Label>Check-in Date</Form.Label>
            <DatePicker
              selected={searchParams.checkIn}
              onChange={(date) => setSearchParams(prev => ({ ...prev, checkIn: date }))}
              selectsStart
              startDate={searchParams.checkIn}
              endDate={searchParams.checkOut}
              minDate={new Date()}
              customInput={
                <InputGroup>
                  <InputGroup.Text>
                    <i className="bi bi-calendar"></i>
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Select date"
                    value={searchParams.checkIn ? searchParams.checkIn.toLocaleDateString() : ''}
                    readOnly
                  />
                </InputGroup>
              }
              className="form-control"
            />
          </Form.Group>
        </Col>

        {/* Check-out Date */}
        <Col md={6} lg={3}>
          <Form.Group>
            <Form.Label>Check-out Date</Form.Label>
            <DatePicker
              selected={searchParams.checkOut}
              onChange={(date) => setSearchParams(prev => ({ ...prev, checkOut: date }))}
              selectsEnd
              startDate={searchParams.checkIn}
              endDate={searchParams.checkOut}
              minDate={searchParams.checkIn || new Date()}
              customInput={
                <InputGroup>
                  <InputGroup.Text>
                    <i className="bi bi-calendar"></i>
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Select date"
                    value={searchParams.checkOut ? searchParams.checkOut.toLocaleDateString() : ''}
                    readOnly
                  />
                </InputGroup>
              }
              className="form-control"
            />
          </Form.Group>
        </Col>

        {/* Guests */}
        <Col md={6} lg={3}>
          <Form.Group>
            <Form.Label>Guests</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <i className="bi bi-people"></i>
              </InputGroup.Text>
              <Form.Control
                type="number"
                min="1"
                placeholder="Number of guests"
                name="guests"
                value={searchParams.guests}
                onChange={handleGuestsChange}
              />
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>

      {/* Price Range */}
      <Row className="mt-3">
        <Col md={12}>
          <Form.Group>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <Form.Label className="mb-0">Price Range</Form.Label>
              <span className="badge bg-light text-dark">
                ${searchParams.minPrice} - ${searchParams.maxPrice}
              </span>
            </div>
            <Row>
              <Col xs={6}>
                <Form.Label className="small">Min Price</Form.Label>
                <Form.Control
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  name="minPrice"
                  value={searchParams.minPrice}
                  onChange={handlePriceRangeChange}
                />
              </Col>
              <Col xs={6}>
                <Form.Label className="small">Max Price</Form.Label>
                <Form.Control
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  name="maxPrice"
                  value={searchParams.maxPrice}
                  onChange={handlePriceRangeChange}
                />
              </Col>
            </Row>
          </Form.Group>
        </Col>
      </Row>

      <div className="d-flex justify-content-end mt-3">
        <Button type="submit" variant="primary">
          <i className="bi bi-search me-2"></i>
          Search Hotels
        </Button>
      </div>
    </Form>
  );
};

export default SearchForm;
