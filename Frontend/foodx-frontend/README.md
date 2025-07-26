# FoodX Frontend

A modern, responsive React frontend for the Online Food Ordering System built with Tailwind CSS.

## Features

- 🎨 **Modern Design**: Clean, responsive UI with green color palette
- 🚀 **Fast Performance**: Built with React 18 and optimized components
- 📱 **Mobile-First**: Fully responsive design that works on all devices
- 🔐 **Authentication**: Complete login/register system with JWT
- 🛒 **Shopping Cart**: Add items, modify quantities, and checkout
- 📍 **Restaurant Discovery**: Browse restaurants with search and filters
- 📋 **Order Management**: Track orders and view order history
- 👤 **User Profiles**: Manage account information and addresses
- 🏪 **Admin Dashboard**: Restaurant owner dashboard (basic)

## Tech Stack

- **React 18** - Frontend framework
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Hook Form** - Form handling and validation
- **React Hot Toast** - Toast notifications
- **Lucide React** - Beautiful icon library

## Color Palette

The app uses a carefully crafted green color palette:

- **Primary Green**: #22c55e (primary-600)
- **Accent Green**: #84cc16 (accent-500)
- **Supporting Colors**: Various shades of green for different UI elements

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navbar.js       # Navigation bar
│   └── Footer.js       # Footer component
├── pages/              # Page components
│   ├── Home.js         # Landing page
│   ├── Login.js        # Login page
│   ├── Register.js     # Registration page
│   ├── Restaurants.js  # Restaurant listing
│   ├── RestaurantDetail.js # Restaurant detail page
│   ├── Cart.js         # Shopping cart
│   ├── Orders.js       # Order history
│   ├── Profile.js      # User profile
│   └── AdminDashboard.js # Restaurant owner dashboard
├── context/            # React Context providers
│   ├── AuthContext.js  # Authentication state
│   └── CartContext.js  # Cart state management
├── services/           # API services
│   └── api.js          # API calls and configuration
├── App.js              # Main app component
├── index.js            # App entry point
└── index.css           # Global styles with Tailwind
```

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Backend URL**
   Update the `API_BASE_URL` in `src/services/api.js`:
   ```javascript
   const API_BASE_URL = 'http://localhost:8080'; // Your backend URL
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## API Integration

The frontend is designed to work with the Spring Boot backend. Key API endpoints:

- **Authentication**: `/auth/signin`, `/auth/signup`
- **Restaurants**: `/api/restaurants`
- **Food Items**: `/api/food`
- **Cart**: `/api/cart`
- **Orders**: `/api/order`
- **User Profile**: `/api/users/profile`

## Key Features

### Authentication
- JWT-based authentication
- Role-based access (Customer/Restaurant Owner)
- Persistent login state
- Demo credentials provided

### Restaurant Discovery
- Search restaurants by name or cuisine
- Filter by categories
- View restaurant details and menus
- Real-time availability status

### Shopping Experience
- Add items to cart with quantities
- Modify cart items
- Real-time cart updates
- Checkout with delivery address

### Order Management
- Place orders with delivery details
- Track order status
- View order history
- Order timeline visualization

### User Experience
- Responsive design for all devices
- Toast notifications for user feedback
- Loading states and error handling
- Optimistic UI updates

## Demo Credentials

For testing purposes, you can use these demo credentials:

**Customer Account:**
- Email: `customer@foodx.com`
- Password: `password123`

**Restaurant Owner Account:**
- Email: `admin@foodx.com`
- Password: `password123`

## Customization

### Colors
Modify the color palette in `tailwind.config.js`:

```javascript
colors: {
  primary: {
    // Your primary color shades
  },
  accent: {
    // Your accent color shades
  }
}
```

### Images
The app uses Unsplash images by default. Replace with your own images:
- Restaurant images
- Food item images
- Hero section backgrounds

### Branding
Update the brand name from "FoodX" in:
- `src/components/Navbar.js`
- `src/components/Footer.js`
- `public/index.html`
- `public/manifest.json`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimizations

- Lazy loading of images
- Component-level code splitting
- Optimized bundle size
- Service worker for caching (production)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the Online Food Ordering System and follows the same license terms.

---

Built with ❤️ using React and Tailwind CSS
