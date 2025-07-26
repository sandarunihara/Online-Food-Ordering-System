import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Chip,
  Avatar,
  Rating,
  Button,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import {
  LocationOn,
  Phone,
  Email,
  AccessTime,
  Search,
  Favorite,
  FavoriteBorder
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { Restaurant, Food, Category } from '../types';
import { restaurantService, foodService, categoryService } from '../services';
import FoodCard from '../components/FoodCard';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`restaurant-tabpanel-${index}`}
      aria-labelledby={`restaurant-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const RestaurantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [foods, setFoods] = useState<Food[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [foodsLoading, setFoodsLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [vegetarianOnly, setVegetarianOnly] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      fetchRestaurantDetails();
      fetchFoods();
      fetchCategories();
    }
  }, [id]);

  const fetchRestaurantDetails = async () => {
    try {
      setLoading(true);
      const data = await restaurantService.getRestaurantById(Number(id));
      setRestaurant(data);
    } catch (error) {
      console.error('Failed to fetch restaurant details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFoods = async () => {
    try {
      setFoodsLoading(true);
      const data = await foodService.getRestaurantFood(
        Number(id),
        vegetarianOnly,
        !vegetarianOnly,
        false,
        selectedCategory
      );
      setFoods(data);
    } catch (error) {
      console.error('Failed to fetch foods:', error);
    } finally {
      setFoodsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getRestaurantCategories(Number(id));
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!restaurant) return;
    
    try {
      await restaurantService.addToFavorites(restaurant.id);
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const filteredFoods = foods.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    food.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchFoods();
  }, [selectedCategory, vegetarianOnly]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!restaurant) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" color="error">
          Restaurant not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Restaurant Header */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
              <Avatar
                src={restaurant.images?.[0]}
                sx={{ width: 80, height: 80, mr: 3 }}
              >
                {restaurant.name.charAt(0)}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Typography variant="h3" component="h1">
                    {restaurant.name}
                  </Typography>
                  <Button
                    onClick={handleFavoriteToggle}
                    color="primary"
                    size="small"
                  >
                    {isFavorite ? <Favorite /> : <FavoriteBorder />}
                  </Button>
                </Box>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {restaurant.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Rating value={4.5} precision={0.5} readOnly />
                  <Typography variant="body2">4.5 (250+ reviews)</Typography>
                  <Chip
                    label={restaurant.open ? 'Open' : 'Closed'}
                    color={restaurant.open ? 'success' : 'error'}
                    size="small"
                  />
                </Box>
                <Chip label={restaurant.cuisineType} color="primary" variant="outlined" />
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Typography variant="h6" gutterBottom>
                Contact Information
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">
                  {restaurant.address?.city}
                </Typography>
              </Box>
              {restaurant.contactInformation?.mobile && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    {restaurant.contactInformation.mobile}
                  </Typography>
                </Box>
              )}
              {restaurant.contactInformation?.email && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Email sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    {restaurant.contactInformation.email}
                  </Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccessTime sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">
                  {restaurant.openingHours || '9:00 AM - 10:00 PM'}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* Menu Section */}
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          variant="fullWidth"
        >
          <Tab label="Menu" />
          <Tab label="Reviews" />
          <Tab label="About" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          {/* Menu Filters */}
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search menu items..."
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
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={selectedCategory}
                    label="Category"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.name}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Diet</InputLabel>
                  <Select
                    value={vegetarianOnly ? 'vegetarian' : 'all'}
                    label="Diet"
                    onChange={(e) => setVegetarianOnly(e.target.value === 'vegetarian')}
                  >
                    <MenuItem value="all">All Items</MenuItem>
                    <MenuItem value="vegetarian">Vegetarian Only</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          {/* Menu Items */}
          {foodsLoading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : filteredFoods.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Typography variant="h6" color="text.secondary">
                No menu items found
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredFoods.map((food) => (
                <Grid item xs={12} sm={6} md={4} key={food.id}>
                  <FoodCard food={food} />
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Customer Reviews
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Reviews feature coming soon...
          </Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            About {restaurant.name}
          </Typography>
          <Typography variant="body1" paragraph>
            {restaurant.description}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Cuisine Type
          </Typography>
          <Typography variant="body1">
            {restaurant.cuisineType}
          </Typography>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default RestaurantDetailPage;
