# Medico Frontend

A modern React-based frontend for the Medico healthcare authentication system.

## Features

- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Authentication Flow**: Complete login/signup with email validation
- **Onboarding Process**: Guided user onboarding experience
- **Welcome Dashboard**: Post-authentication user interface
- **Route Protection**: Secure routing with authentication checks
- **Token Management**: JWT token storage and management

## Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Configuration (Optional)

Create a `.env` file in the frontend directory if you want to customize the API URL:

```env
REACT_APP_API_URL=http://localhost:8000
```

### 3. Start Development Server

```bash
npm start
```

The app will be available at `http://localhost:3000`

## Project Structure

```
src/
├── components/
│   ├── Home.js          # Landing page
│   ├── Login.js         # Login form
│   ├── Signup.js        # Registration form
│   ├── Welcome.js       # Post-login welcome page
│   └── Onboarding.js    # User onboarding flow
├── config.js            # API configuration
├── App.js              # Main app with routing
└── index.js            # App entry point
```

## Available Routes

- `/` - Landing page with login/signup options
- `/login` - User login form
- `/signup` - User registration form
- `/onboarding` - New user onboarding (protected)
- `/welcome` - Welcome dashboard (protected)
- `/dashboard` - Main dashboard (redirects to welcome)
- `/profile` - User profile (redirects to welcome)

## Authentication Flow

1. **Landing Page**: Users can choose to login or signup
2. **Signup**: New users create account with email/password
3. **Login**: Existing users authenticate with credentials
4. **Onboarding**: New users complete guided setup (optional)
5. **Welcome**: Authenticated users see welcome dashboard

## API Integration

The frontend communicates with the FastAPI backend through:
- `POST /api/signup` - User registration
- `POST /api/login` - User authentication
- `GET /api/me` - Get user profile
- `POST /api/complete-onboarding` - Complete onboarding

## Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach
- **Modern Components**: Clean, accessible UI components
- **Gradient Backgrounds**: Beautiful visual design

## Security Features

- JWT token storage in localStorage
- Protected routes with authentication checks
- Secure password input with visibility toggle
- CSRF protection through proper headers
- Input validation and error handling

## Development

The development server supports:
- Hot reloading for instant updates
- Error overlay for debugging
- Tailwind CSS compilation
- React DevTools integration

## Build for Production

```bash
npm run build
```

Creates optimized production build in the `build` folder.

## Dependencies

- **React**: Frontend framework
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls
- **Tailwind CSS**: Utility-first CSS framework
