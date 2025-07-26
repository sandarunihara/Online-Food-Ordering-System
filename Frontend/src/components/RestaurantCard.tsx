import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Box,
  IconButton,
  Rating
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  AccessTime,
  LocationOn
} from '@mui/icons-material';
import { Restaurant } from '../types';
import { useNavigate } from 'react-router-dom';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onFavoriteToggle?: (restaurantId: number) => void;
  isFavorite?: boolean;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onFavoriteToggle,
  isFavorite = false
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/restaurant/${restaurant.id}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle(restaurant.id);
    }
  };

  return (
    <Card 
      sx={{ 
        maxWidth: 345, 
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-4px)',
          transition: 'all 0.3s ease-in-out'
        }
      }}
      onClick={handleCardClick}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={restaurant.images?.[0] || '/api/placeholder/400/300'}
          alt={restaurant.name}
        />
        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' }
          }}
          onClick={handleFavoriteClick}
        >
          {isFavorite ? (
            <Favorite sx={{ color: '#ff5722' }} />
          ) : (
            <FavoriteBorder />
          )}
        </IconButton>
        
        <Chip
          label={restaurant.open ? 'Open' : 'Closed'}
          color={restaurant.open ? 'success' : 'error'}
          size="small"
          sx={{
            position: 'absolute',
            bottom: 8,
            left: 8,
          }}
        />
      </Box>

      <CardContent>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {restaurant.name}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {restaurant.description}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={4.5} precision={0.5} size="small" readOnly />
          <Typography variant="body2" sx={{ ml: 1 }}>
            4.5 (250+ reviews)
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationOn sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
          <Typography variant="body2" color="text.secondary" noWrap>
            {restaurant.address?.city}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <AccessTime sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
          <Typography variant="body2" color="text.secondary">
            {restaurant.openingHours || '9:00 AM - 10:00 PM'}
          </Typography>
        </Box>

        <Chip
          label={restaurant.cuisineType}
          size="small"
          variant="outlined"
          sx={{ mt: 1 }}
        />
      </CardContent>
    </Card>
  );
};

export default RestaurantCard;
