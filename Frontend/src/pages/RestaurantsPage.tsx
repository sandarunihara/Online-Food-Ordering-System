import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Grid,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { Restaurant } from '../types';
import { restaurantService } from '../services';
import RestaurantCard from '../components/RestaurantCard';

const RestaurantsPage: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    filterRestaurants();
  }, [restaurants, searchTerm, selectedCuisine, sortBy]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const data = await restaurantService.getAllRestaurants();
      setRestaurants(data);
    } catch (error) {
      console.error('Failed to fetch restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterRestaurants = () => {
    let filtered = [...restaurants];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.cuisineType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by cuisine type
    if (selectedCuisine) {
      filtered = filtered.filter(restaurant =>
        restaurant.cuisineType.toLowerCase() === selectedCuisine.toLowerCase()
      );
    }

    // Sort restaurants
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'cuisine':
          return a.cuisineType.localeCompare(b.cuisineType);
        case 'status':
          return Number(b.open) - Number(a.open);
        default:
          return 0;
      }
    });

    setFilteredRestaurants(filtered);
  };

  const handleFavoriteToggle = async (restaurantId: number) => {
    try {
      await restaurantService.addToFavorites(restaurantId);
      // You might want to update the UI to reflect the favorite status
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const getCuisineTypes = (): string[] => {
    const cuisines = restaurants.map(restaurant => restaurant.cuisineType);
    return Array.from(new Set(cuisines)).filter(Boolean);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        Restaurants
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
        Discover amazing restaurants near you
      </Typography>

      {/* Search and Filter Section */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search restaurants, cuisines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Cuisine Type</InputLabel>
              <Select
                value={selectedCuisine}
                label="Cuisine Type"
                onChange={(e) => setSelectedCuisine(e.target.value)}
              >
                <MenuItem value="">All Cuisines</MenuItem>
                {getCuisineTypes().map((cuisine) => (
                  <MenuItem key={cuisine} value={cuisine}>
                    {cuisine}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="cuisine">Cuisine Type</MenuItem>
                <MenuItem value="status">Status (Open First)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Chip
              label={`${filteredRestaurants.length} Found`}
              color="primary"
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Restaurants Grid */}
      {filteredRestaurants.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h5" color="text.secondary">
            No restaurants found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Try adjusting your search criteria
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredRestaurants.map((restaurant) => (
            <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
              <RestaurantCard
                restaurant={restaurant}
                onFavoriteToggle={handleFavoriteToggle}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default RestaurantsPage;
