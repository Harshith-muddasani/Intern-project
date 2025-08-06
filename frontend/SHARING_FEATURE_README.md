# Digital Altar Sharing Feature

## Overview
This feature enables users to share their digital altars publicly with a unique shareable link. Visitors can view the altar and add their own stories or memories.

## Features Implemented

### 1. Mobile-Responsive Public View
- **File**: `src/pages/PublicAltarView.jsx`
- Fully responsive design that adapts to mobile and desktop screens
- Canvas automatically scales based on device screen size
- Touch-friendly interface for mobile users
- Responsive navigation and action buttons

### 2. Shareable Link Generation
- Unique share IDs generated using crypto.randomBytes()
- Links follow the format: `/public/altar/{shareId}`
- Share links remain active until explicitly disabled by the owner

### 3. Story/Memory Submission
- Public users can add stories and memories to shared altars
- Stories include author name (optional, defaults to "Anonymous")
- Text length limited to 1000 characters
- Stories are auto-approved but include IP tracking for spam prevention

### 4. Sharing Settings Page
- **File**: `src/pages/SharingSettings.jsx`
- Centralized management of all shared altars
- Toggle sharing on/off for individual altars
- Copy share links to clipboard
- View sharing statistics (view count, last viewed)
- Delete sharing (removes share link and associated stories)

### 5. Backend API Endpoints
- **File**: `backend/routes/sharingRoutes.js`
- **Controller**: `backend/controllers/sharingController.js`

#### Protected Endpoints (Require Authentication):
- `GET /api/sessions/:sessionId/sharing` - Get sharing settings
- `PUT /api/sessions/:sessionId/sharing` - Update sharing settings
- `DELETE /api/sessions/:sessionId/sharing` - Delete sharing

#### Public Endpoints:
- `GET /api/public/altar/:shareId` - Get public altar data
- `GET /api/public/altar/:shareId/stories` - Get altar stories
- `POST /api/public/altar/:shareId/stories` - Add story to altar

### 6. Database Models
- **SharedAltar**: Stores sharing configuration and metadata
- **SharedStory**: Stores user-submitted stories and memories

## How to Use

### For Altar Creators:
1. Create and save an altar session
2. Go to "Sharing Settings" from the user menu
3. Toggle sharing "ON" for the desired altar
4. Copy the generated share link
5. Share the link with others

### For Visitors:
1. Open the shared altar link
2. View the digital altar and its items
3. Click "Share Your Memory" to add a story
4. View existing memories from other visitors

## Mobile Responsiveness
- Canvas scales automatically based on screen size
- Responsive grid layout for action buttons
- Touch-optimized interface elements
- Adaptive text sizes and spacing
- Collapsible story submission modal

## Security Features
- IP address logging for spam prevention
- Text length limits on story submissions
- Sharing can be disabled at any time by the owner
- Stories are tied to share sessions and deleted when sharing is removed

## Navigation Integration
- Added "Sharing Settings" to user dropdown menu
- Added "Share Altar" button to main altar interface
- Proper routing integration with React Router

## Files Modified/Created

### Frontend:
- `src/pages/PublicAltarView.jsx` (new)
- `src/pages/SharingSettings.jsx` (new)
- `src/App.jsx` (modified - added routes)
- `src/components/Navbar.jsx` (modified - added sharing menu)
- `src/components/MainLayout.jsx` (modified - navigation)

### Backend:
- `backend/models/SharedAltar.js` (new)
- `backend/models/SharedStory.js` (new)
- `backend/controllers/sharingController.js` (new)
- `backend/routes/sharingRoutes.js` (new)
- `backend/app.js` (modified - added routes)

## Testing
The feature has been implemented with proper error handling and responsive design. To test:

1. Start the backend server: `node backend/index.js`
2. Start the frontend: `npm run dev`
3. Create an altar and enable sharing
4. Test the public view on different screen sizes
5. Test story submission functionality

## Future Enhancements
- Story moderation system
- Email notifications for new stories
- Social media sharing integration
- Analytics dashboard for altar owners
- Story reactions (likes, hearts)
- Advanced spam protection