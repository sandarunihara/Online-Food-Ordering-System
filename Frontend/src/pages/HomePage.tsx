import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Paper
} from '@mui/material';
import {
  Restaurant,
  LocalShipping,
  Payment,
  Schedule
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Restaurant fontSize="large" />,
      title: 'Wide Variety',
      description: 'Choose from hundreds of restaurants and thousands of dishes'
    },
    {
      icon: <LocalShipping fontSize="large" />,
      title: 'Fast Delivery',
      description: 'Get your food delivered hot and fresh in 30 minutes or less'
    },
    {
      icon: <Payment fontSize="large" />,
      title: 'Secure Payment',
      description: 'Safe and secure payment options for your convenience'
    },
    {
      icon: <Schedule fontSize="large" />,
      title: '24/7 Service',
      description: 'Order anytime, anywhere with our round-the-clock service'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'linear-gradient(45deg, #FF6B35 30%, #FF8E35 90%)',
          background: 'linear-gradient(135deg, #ff5722 0%, #ff8a65 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Delicious Food
          </Typography>
          <Typography variant="h4" component="h2" gutterBottom>
            Delivered to Your Door
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Order from your favorite restaurants and get fresh, hot food delivered in minutes
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            {isAuthenticated ? (
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/restaurants')}
                sx={{
                  bgcolor: 'white',
                  color: '#ff5722',
                  '&:hover': { bgcolor: '#f5f5f5' },
                  px: 4,
                  py: 1.5
                }}
              >
                Browse Restaurants
              </Button>
            ) : (
              <>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/signup')}
                  sx={{
                    bgcolor: 'white',
                    color: '#ff5722',
                    '&:hover': { bgcolor: '#f5f5f5' },
                    px: 4,
                    py: 1.5
                  }}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                    px: 4,
                    py: 1.5
                  }}
                >
                  Sign In
                </Button>
              </>
            )}
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
          Why Choose Us?
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                    transition: 'all 0.3s ease-in-out'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ color: '#ff5722', mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Box sx={{ bgcolor: '#f5f5f5', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
            How It Works
          </Typography>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <Typography variant="h1" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
                  1
                </Typography>
                <Typography variant="h5" gutterBottom>
                  Choose Restaurant
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Browse through our wide selection of restaurants and cuisines
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <Typography variant="h1" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
                  2
                </Typography>
                <Typography variant="h5" gutterBottom>
                  Select Food
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Pick your favorite dishes and customize them to your liking
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <Typography variant="h1" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
                  3
                </Typography>
                <Typography variant="h5" gutterBottom>
                  Enjoy Delivery
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Sit back and relax while we deliver hot, fresh food to your door
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          Ready to Order?
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Join thousands of satisfied customers who trust us for their food delivery needs
        </Typography>
        {!isAuthenticated && (
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/signup')}
            sx={{ px: 4, py: 1.5 }}
          >
            Start Ordering Now
          </Button>
        )}
      </Container>
    </Box>
  );
};

export default HomePage;
