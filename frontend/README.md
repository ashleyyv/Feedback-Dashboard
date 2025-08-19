# Global Feedback Intelligence Frontend

A modern React application with a dark, futuristic theme featuring a 3D globe visualization and interactive dashboard.

## Features

- **Parallax Landing Page**: Interactive 3D globe with scrolling parallax effects
- **Dark Futuristic Theme**: Cyan and dark navy color scheme
- **Interactive Dashboard**: DataGrid for feedback management
- **3D Globe Visualization**: Built with Three.js and React Three Fiber
- **Responsive Design**: Material-UI components with custom theming

## Tech Stack

- React 18
- Material-UI (MUI)
- React Router DOM
- Framer Motion
- Three.js / React Three Fiber
- React Three Drei
- React Three Postprocessing

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
src/
├── components/
│   └── globe/
│       └── Globe.jsx          # 3D globe component
├── pages/
│   ├── LandingPage.jsx        # Parallax landing page
│   └── DashboardPage.jsx      # Data dashboard
├── styles/
│   └── theme.js              # MUI theme configuration
├── api/
│   └── mockData.js           # Mock data for dashboard
└── App.jsx                   # Main app with routing
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## Routes

- `/` - Landing page with 3D globe
- `/dashboard` - Feedback management dashboard
