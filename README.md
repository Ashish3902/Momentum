# vidora – Futuristic Social Media UI

A modern, sleek social media web app with a dark + neon gradient theme, glassmorphism panels, and smooth micro-animations.

## 🚀 Quick Start

### 1. Environment Setup

Create `.env` file in the `f/` directory:

```env
# Backend API URL (required)
VITE_API_URL=http://localhost:8000/api

# Cloudinary Configuration (optional - for direct uploads)
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset

# Development Settings
VITE_APP_NAME=Fun Social Media
VITE_APP_VERSION=1.0.0
```

### 2. Install Dependencies

```bash
cd f
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🔗 Backend Integration

This frontend is designed to work with a Node.js/Express.js backend API. The backend should provide the following endpoints:

### Authentication Endpoints
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `POST /api/users/logout` - User logout
- `GET /api/users/me` - Get current user
- `PUT /api/users/profile` - Update user profile

### Video Endpoints
- `GET /api/videos` - Get all videos (with pagination)
- `GET /api/videos/search?q=<query>` - Search videos
- `GET /api/videos/:videoId` - Get video by ID
- `POST /api/videos` - Upload video (multipart/form-data)
- `GET /api/videos/user/:userId` - Get user's videos

### Comment Endpoints
- `GET /api/comments/:videoId` - Get video comments
- `POST /api/comments/:videoId` - Add comment
- `PATCH /api/comments/c/:commentId` - Update comment
- `DELETE /api/comments/c/:commentId` - Delete comment

### Like Endpoints
- `POST /api/likes/toggle/v/:videoId` - Toggle video like
- `POST /api/likes/toggle/c/:commentId` - Toggle comment like

### Subscription Endpoints
- `GET /api/subscriptions/status/:channelId` - Check subscription status
- `POST /api/subscriptions/:channelId` - Subscribe to channel

### Additional Endpoints
- `GET /api/tags/trending` - Get trending tags
- `GET /api/users/suggested` - Get suggested users
- `GET /api/activity/live` - Get live activity
- `POST /api/posts` - Create post (multipart/form-data)

## 🔐 Authentication

The app uses JWT-based authentication with HTTP-only cookies:

- **Access Token**: Short-lived (1 day), sent via HTTP-only cookies
- **Refresh Token**: Long-lived (7 days), sent via HTTP-only cookies
- **Fallback**: Authorization header with Bearer token

## 📱 Features

### Core Features
- ✅ User authentication (login/register/logout)
- ✅ Video upload with drag-and-drop
- ✅ Video playback with custom player
- ✅ Like/unlike videos and comments
- ✅ Comment system with edit/delete
- ✅ User profiles with cover images and avatars
- ✅ Video search and filtering
- ✅ Responsive design (mobile-first)

### UI Components
- ✅ Dark + neon gradient theme
- ✅ Glassmorphism panels with backdrop blur
- ✅ Smooth micro-animations and hover effects
- ✅ Modern typography (Inter + Poppins)
- ✅ Neon glow buttons and interactive elements
- ✅ Loading states and error handling
- ✅ Toast notifications

### Layout
- ✅ Split navigation bar (brand, search, actions)
- ✅ Left sidebar with navigation
- ✅ Right sidebar with trending/suggestions
- ✅ Responsive grid layouts
- ✅ Modal dialogs for post creation

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Project Structure
```
f/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── UI/             # Core UI components
│   │   ├── videos/         # Video-related components
│   │   └── reusable/       # Shared components
│   ├── pages/              # Page components
│   │   ├── video/          # Video pages
│   │   └── Auth/           # Authentication pages
│   ├── context/            # React context providers
│   ├── utils/              # Utility functions
│   └── api/                # API configuration
├── public/                 # Static assets
└── index.html              # HTML template
```

## 🔧 Configuration

### Vite Configuration
- Development server runs on port 5173
- Proxy configuration for API requests
- Hot module replacement enabled
- Build optimization for production

### Tailwind CSS
- Custom color palette with neon accents
- Glassmorphism utilities
- Responsive breakpoints
- Custom animations and transitions

## 🌐 API Response Format

The frontend expects backend responses in this format:

```javascript
// Success Response
{
  "statusCode": 200,
  "data": { /* response data */ },
  "message": "Success",
  "success": true
}

// Error Response
{
  "statusCode": 400,
  "data": null,
  "message": "Error message",
  "success": false,
  "errors": [] // Optional validation errors
}
```

## 🚨 Error Handling

- Automatic token refresh on 401 errors
- Graceful fallbacks for missing data
- User-friendly error messages
- Loading states for all async operations

## 📱 Mobile Support

- Responsive design for all screen sizes
- Touch-friendly interactions
- Optimized for mobile performance
- Progressive Web App ready

## 🔒 Security

- JWT token validation
- XSS protection
- CSRF protection via HTTP-only cookies
- Input validation and sanitization

## 🎨 Customization

### Theme Colors
The app uses CSS custom properties for easy theming:

```css
:root {
  --bg-primary: #0b1220;
  --bg-elevated: rgba(18, 27, 46, 0.6);
  --glass-border: rgba(255, 255, 255, 0.12);
  --neon-sky: #38bdf8;
  --neon-purple: #7c3aed;
  --neon-pink: #ec4899;
}
```

### Adding New Features
1. Create new components in `src/components/`
2. Add routes in `src/App.jsx`
3. Update API calls in `src/utils/api.js`
4. Add new pages in `src/pages/`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Note**: Make sure your backend server is running on `http://localhost:8000` before starting the frontend. If your backend uses a different URL, update the `VITE_API_URL` in your `.env` file.
