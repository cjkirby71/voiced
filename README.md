# Voiced - Civic Engagement Platform

## Overview
Voiced is a comprehensive civic engagement platform that connects citizens with their elected representatives and provides tools for political participation, news consumption, and community feedback.

## Features
- **Dashboard**: Personalized civic engagement dashboard
- **Polling Interface**: Interactive polling system for civic issues
- **Journalism Hub**: Curated news and articles from multiple sources
- **Representative Contact**: Direct communication with elected officials
- **Community Feedback**: Platform for community suggestions and feedback
- **Subscription Management**: Tiered subscription system
- **Admin Dashboard**: Comprehensive administration tools

## Technology Stack
- **React** 18.2.0 with functional components and hooks
- **React Router DOM** 6.0.2 with createBrowserRouter for advanced routing
- **Tailwind CSS** 3.x for responsive styling
- **Framer Motion** for animations and transitions
- **Redux Toolkit** for state management
- **Vite** as build tool
- **Axios** for API communication

## Routing Architecture
The application uses React Router DOM v6 with `createBrowserRouter()` for:
- **Enhanced Performance**: Optimized bundle splitting and data loading
- **Data Loaders**: Pre-fetch data before route transitions
- **Error Boundaries**: Route-specific error handling
- **Nested Routing**: Support for complex route hierarchies
- **Smooth Transitions**: Built-in loading states and navigation feedback

### Route Structure
```
/ (Root Layout)
├── / (Dashboard)
├── /home-dashboard
├── /polling-interface
├── /subscription-management
├── /user-profile-representative-contact
├── /community-feedback-hub
├── /journalism-hub
├── /login-screen
├── /registration-screen
├── /admin-dashboard (with nested route support)
└── /* (404 Not Found)
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation
```bash
# Clone the repository
git clone [repository-url]

# Navigate to project directory
cd voiced

# Install dependencies
npm install

# Start development server
npm start
```

### Build for Production
```bash
# Create production build
npm run build

# Preview production build
npm run serve
```

## Project Structure
```
src/
├── components/          # Reusable UI components
├── pages/              # Page components with feature-specific components
├── hooks/              # Custom React hooks
├── context/            # React Context providers
├── api/               # API service functions
├── utils/             # Utility functions and route loaders
├── styles/            # Global styles and Tailwind configuration
├── Routes.jsx         # Router configuration with createBrowserRouter
├── App.jsx           # Main application component
└── index.jsx         # Application entry point
```

## Routing Features

### Data Loaders
Route loaders pre-fetch data before navigation:
```javascript
// Example loader implementation
const dashboardLoader = async () => {
  const data = await fetchDashboardData();
  return data;
};
```

### Error Boundaries
Route-specific error handling with fallback UI:
```javascript
// Automatic error boundary for each route
const RouteErrorBoundary = ({ error }) => {
  return <ErrorFallbackUI error={error} />;
};
```

### Loading States
Built-in navigation loading states:
```javascript
// Access loading state in components
const { isLoading } = useNavigation();
```

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License
[License information]

## Contact
[Contact information]