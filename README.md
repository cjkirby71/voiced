# Voiced - Civic Engagement Platform

A React-based civic engagement platform that connects citizens with their representatives through polls, articles, and community feedback.

## Features

- **User Authentication**: Secure signup/login with email and password
- **Tier-based Access**: Free tier (polls + 1 article) and National tier ($5/month - full access)
- **Polling Interface**: Participate in civic polls and surveys
- **Journalism Hub**: Access to curated articles and independent media
- **Representative Contact**: Connect with your local and national representatives
- **Community Feedback**: Submit suggestions and participate in community discussions
- **Admin Dashboard**: Content moderation and user management

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **State Management**: React Context API
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Routing**: React Router v6

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/voiced.git
   cd voiced
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Run the migration file in your Supabase SQL editor:
     ```sql
     -- Copy and run the contents of supabase/migrations/20241216120000_voiced_auth_system.sql
     ```

4. **Environment Configuration**
   
   Copy the `.env` file and update with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

   The application will be available at `http://localhost:5173`

## Authentication System

### User Tiers

- **Free Tier**: Access to polls and 1 featured article per month
- **National Tier ($5/month)**: Full access to all polls, articles, and premium features

### Demo Accounts

For testing purposes, use these demo credentials:

- **Free User**: `free@voiced.gov` / `password123`
- **National User**: `national@voiced.gov` / `password123`
- **Admin User**: `admin@voiced.gov` / `password123`

### API Endpoints

The authentication system provides these simulated API endpoints:

- **Signup**: `/api/auth/signup` (handled by `src/api/auth/signup.js`)
- **Login**: `/api/auth/login` (handled by `src/api/auth/login.js`)

Both endpoints return JWT tokens for authenticated sessions.

## Database Schema

The Supabase database includes these main tables:

- `user_profiles` - User profile information with tier settings
- `user_subscriptions` - Subscription tracking for paid tiers
- `polls` - Civic polls with tier-based access
- `articles` - Journalism content with tier restrictions

## Testing Locally

1. **Install dependencies**:
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Run the development server**:
   ```bash
   npm start
   ```

3. **Test authentication flows**:
   - Visit `/registration-screen` to create a new account
   - Visit `/login-screen` to sign in
   - Use demo credentials for quick testing

4. **Test tier-based access**:
   - Free users can access free polls and limited articles
   - National users can access all content
   - Try upgrading to National tier in subscription management

## Project Structure

```
src/
├── api/
│   └── auth/           # Authentication API handlers
├── components/         # Reusable UI components
├── context/           # React context providers
├── hooks/             # Custom React hooks
├── pages/             # Application pages
├── utils/             # Utility functions and services
└── styles/            # Global styles
```

## Environment Variables

Required environment variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Error Handling

The application includes comprehensive error handling:

- Authentication errors are displayed in the UI
- Network errors are handled gracefully
- Form validation provides immediate feedback
- Database errors are logged and user-friendly messages are shown

## Security Features

- Row Level Security (RLS) policies in Supabase
- JWT token-based authentication
- Secure password hashing
- Input validation and sanitization
- HTTPS-only in production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:

- Create an issue in the GitHub repository
- Check the documentation
- Review the demo credentials for testing

## Deployment

For production deployment:

1. Set up your production Supabase project
2. Update environment variables
3. Build the project: `npm run build`
4. Deploy to your hosting platform
5. Configure domain and SSL

## Future Enhancements

- Social authentication (Google, Facebook)
- Real-time notifications
- Mobile app development
- Advanced analytics dashboard
- Multi-language support
- Email newsletter integration