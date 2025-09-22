# MERN Stack Agent Management - Frontend

A modern Next.js frontend application for the Agent Management System with a beautiful, responsive UI built using Shadcn/ui components.

## Features

- **🔐 Authentication**: Secure login with JWT token management
- **📱 Responsive Design**: Mobile-first design that works on all devices
- **👥 Agent Management**: Complete CRUD operations for managing agents
- **📄 File Upload**: Drag-and-drop file upload with real-time validation
- **📊 Data Distribution**: Automatic equal distribution among active agents
- **📈 Analytics Dashboard**: Real-time statistics and insights
- **🎨 Modern UI**: Clean, professional interface with Shadcn/ui components
- **⚡ Real-time Updates**: Instant feedback and live data updates

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **State Management**: React Context + Custom Hooks
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form + Zod validation
- **Icons**: Lucide React

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── login/              # Authentication page
│   │   └── dashboard/          # Protected dashboard area
│   │       ├── agents/         # Agent management
│   │       ├── upload/         # File upload & distribution
│   │       └── distributions/  # View distributions
│   ├── components/
│   │   └── ui/                 # Shadcn/ui components
│   ├── contexts/               # React contexts
│   │   └── AuthContext.tsx    # Authentication state
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAgents.ts       # Agent operations
│   │   └── useDistributions.ts # Distribution operations
│   ├── services/               # API services
│   │   └── api.ts             # API client & endpoints
│   └── types/                  # TypeScript definitions
│       └── index.ts           # All type definitions
├── middleware.ts              # Route protection
└── package.json              # Dependencies
```

## Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy and configure environment variables
   cp .env.local.example .env.local
   ```

4. **Update environment variables**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

## Getting Started

1. **Start the backend server** (ensure it's running on port 5000)
   ```bash
   cd ../backend
   npm run dev
   ```

2. **Start the frontend development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

4. **Login with demo credentials**
   - Email: `admin@example.com`
   - Password: `Admin123!`

## Pages & Features

### 🔐 Authentication (`/login`)
- Secure JWT-based authentication
- Form validation with error handling
- Auto-redirect for authenticated users
- Professional login interface

### 📊 Dashboard (`/dashboard`)
- Real-time system statistics
- Quick action cards
- Recent activity overview
- Responsive grid layout

### 👥 Agent Management (`/dashboard/agents`)
- **Create Agents**: Add new agents with validation
- **View Agents**: Paginated list with search and filtering
- **Edit Agents**: Update agent information and status
- **Delete Agents**: Remove agents with confirmation
- **Status Management**: Activate/deactivate agents

### 📤 File Upload (`/dashboard/upload`)
- **Drag & Drop**: Intuitive file upload interface
- **File Validation**: CSV, XLSX, XLS support (5MB limit)
- **Real-time Preview**: File information display
- **Distribution Logic**: Equal distribution among active agents
- **Progress Tracking**: Upload progress indicators
- **Validation Errors**: Detailed error reporting

### 📈 Distributions (`/dashboard/distributions`)
- **View History**: All file distributions
- **Detailed View**: Individual distribution details
- **Export Data**: Download distribution data as CSV
- **Search & Filter**: Find specific distributions
- **Statistics**: Distribution analytics

## API Integration

The frontend seamlessly integrates with the backend through:

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile
- `GET /api/auth/verify` - Verify token

### Agent Management Endpoints
- `GET /api/agents` - Get all agents
- `POST /api/agents` - Create new agent
- `GET /api/agents/:id` - Get agent by ID
- `PUT /api/agents/:id` - Update agent
- `DELETE /api/agents/:id` - Delete agent
- `GET /api/agents/active` - Get active agents

### File Upload & Distribution Endpoints
- `POST /api/uploads/distribute` - Upload and distribute file
- `GET /api/uploads/distributions` - Get all distributions
- `GET /api/uploads/distributions/:id` - Get distribution details
- `DELETE /api/uploads/distributions/:id` - Delete distribution

## UI Components

Built with **Shadcn/ui** components for consistency and quality:

- **Forms**: Input, Button, Label with validation
- **Data Display**: Table, Card, Badge, Alert
- **Navigation**: Sidebar, Mobile menu, Breadcrumbs
- **Dialogs**: Modal forms and confirmations
- **Feedback**: Loading states, Error messages, Success notifications

## Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Adapted layouts for tablets
- **Desktop Experience**: Full-featured desktop interface
- **Touch Friendly**: Large touch targets and gestures

## Error Handling

- **Form Validation**: Real-time field validation
- **API Errors**: User-friendly error messages
- **Network Issues**: Retry mechanisms and offline handling
- **File Upload Errors**: Detailed validation feedback

## Security Features

- **JWT Token Management**: Secure token storage and refresh
- **Route Protection**: Middleware for protected routes
- **Input Validation**: Frontend and backend validation
- **CSRF Protection**: Request origin validation

## Performance Optimizations

- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js automatic optimization
- **Bundle Analysis**: Optimized bundle sizes
- **Caching**: Efficient data caching strategies

## Browser Support

- **Chrome**: Latest 2 versions
- **Firefox**: Latest 2 versions
- **Safari**: Latest 2 versions
- **Edge**: Latest 2 versions

## Development Guidelines

### Code Style
- **TypeScript**: Strict typing throughout
- **ESLint**: Consistent code formatting
- **Prettier**: Automated code formatting
- **Conventional Commits**: Standardized commit messages

### Component Structure
```typescript
// Component template
'use client';

import { useState, useEffect } from 'react';
import { ComponentProps } from '@/types';
import { useCustomHook } from '@/hooks/useCustomHook';

export default function ComponentName({ prop }: ComponentProps) {
  const [state, setState] = useState('');
  const { data, loading, error } = useCustomHook();

  // Component logic here

  return (
    <div className="component-container">
      {/* JSX content */}
    </div>
  );
}
```

## Testing

Run the frontend with the backend to test:

1. **Authentication Flow**
   - Login/logout functionality
   - Token persistence and refresh
   - Route protection

2. **Agent Management**
   - Create, read, update, delete operations
   - Form validation and error handling
   - Search and pagination

3. **File Upload**
   - File validation and upload
   - Distribution logic verification
   - Error handling for various scenarios

4. **Data Display**
   - Distribution viewing and export
   - Real-time updates
   - Responsive behavior

## Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
NEXT_PUBLIC_BASE_URL=https://your-frontend-domain.com
```

### Static Export (Optional)
```bash
npm run build && npm run export
```

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check if backend is running on port 5000
   - Verify `NEXT_PUBLIC_API_URL` in `.env.local`
   - Check CORS settings in backend

2. **Authentication Issues**
   - Clear browser localStorage
   - Check JWT token expiration
   - Verify backend authentication endpoints

3. **File Upload Issues**
   - Check file size (max 5MB)
   - Verify file type (CSV, XLSX, XLS)
   - Ensure active agents exist

4. **Styling Issues**
   - Run `npm run build` to check for CSS issues
   - Verify Tailwind CSS configuration
   - Check component imports

### Debug Mode
```bash
# Enable debug logging
NEXT_PUBLIC_DEBUG=true npm run dev
```

## Contributing

1. Follow the established code structure
2. Use TypeScript for all new components
3. Add proper error handling
4. Include responsive design considerations
5. Test thoroughly across different devices

## License

This project is licensed under the ISC License.

---

**Built with ❤️ using Next.js, TypeScript, and Shadcn/ui**