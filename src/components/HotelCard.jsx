
import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const HotelCard = ({ hotel }) => {
  // Default values for hotel in case some properties are missing
  const {
    _id = '',
    name = 'Hotel Name',
    city = 'Unknown Location',
    address = '',
    photos = [],
    cheapestPrice = 0,
    rating = 0,
    featured = false,
    type = 'hotel',
    desc = ''
  } = hotel || {};
  
  // Truncate description to 100 characters
  const shortDesc = desc ? (desc.length > 100 ? `${desc.substring(0, 100)}...` : desc) : '';
  
  // Format currency
  const formatPrice = (price) => {
    return `$${price}`;
  };
  
  // Default image if no photos available
  const defaultImage = "https://images.unsplash.com/photo-1566073771259-6a8506099945";
  
  return (
    <Card className="h-100 shadow-sm hotel-card border-0">
      <div className="position-relative">
        <Card.Img 
          variant="top" 
          src={photos && photos.length > 0 ? photos[0] : defaultImage} 
          alt={name}
          className="card-img-top"
        />
        {featured && (
          <Badge 
            bg="warning" 
            className="position-absolute top-0 end-0 mt-2 me-2"
          >
            Featured
          </Badge>
        )}
      </div>
      
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <Card.Title className="h5 mb-1">{name}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted small">
              <i className="bi bi-geo-alt-fill me-1"></i>{city}
            </Card.Subtitle>
          </div>
          
          <div className="d-flex align-items-center">
            <Badge bg="success" className="d-flex align-items-center">
              <i className="bi bi-star-fill me-1"></i>
              {rating.toFixed(1)}
            </Badge>
          </div>
        </div>
        
        <Card.Text className="text-muted small mb-3">
          {shortDesc}
        </Card.Text>
        
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center">
            <Badge bg="light" text="dark" className="text-capitalize">
              {type}
            </Badge>
            <div className="text-end">
              <div className="fw-bold text-primary mb-1">
                {formatPrice(cheapestPrice)}
              </div>
              <span className="text-muted small">per night</span>
            </div>
          </div>
          
          <Link 
            to={`/hotels/${_id}`} 
            className="btn btn-primary btn-sm w-100 mt-3"
          >
            View Details
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};

export default HotelCard;
