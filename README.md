# Notifications System

A full stack notification management system built with React and Node.js.

## Features

- OAuth2 Authentication with token management
- Notification API integration
- Priority-based notification ranking
- Responsive Material UI dashboard
- Error handling and retry logic
- Development mode with mock data

## Setup

### Backend Configuration

1. Copy `.env.example` to `.env` in the `backend/` folder:

```bash
cd backend
cp .env.example .env
```

2. Add your API credentials and configuration:

```env
AUTH_API_URL=https://api.example.com/auth
NOTIFICATIONS_API_URL=https://api.example.com/notifications
CLIENT_ID=your-client-id
CLIENT_SECRET=your-client-secret
PORT=4001
NODE_ENV=development
DEV_MOCK=false
```

3. Install dependencies and start:

```bash
cd backend
npm install
npm start
```

For development mode:

```bash
npm run dev
```

## Frontend Setup

1. Install dependencies and run dev server:

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

2. Open browser at `http://localhost:3000`

## API Endpoints

- `GET /api/health` — Health check
- `GET /api/notifications` — List notifications
- `GET /api/notifications/unread` — Get unread notifications
- `GET /api/notifications/priority` — Get priority notifications

## Architecture

### Backend

Services handle OAuth authentication and API communication. Controllers manage requests and responses.

### Frontend

Pages include Dashboard and Priority Inbox. Components use Material UI for styling.

## Setup and Run

Start backend:
```bash
cd backend
npm install
npm run dev
```

Start frontend:
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

Open `http://localhost:3000` in browser.

## Project Structure

```
project/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── algorithms/
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Notes

- Backend uses Node.js and Express
- Frontend uses React and Material UI
- Development mode available for testing without credentials
