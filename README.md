# Plumbing Supplies E-Commerce Platform

## Project Overview
A comprehensive online platform for plumbing supplies sales with advanced delivery and management features.

## Technology Stack
- Frontend: React.js with TypeScript
- Backend: Node.js with Express.js
- Database: MongoDB
- State Management: Redux
- Mapping API: Google Maps
- Payment Gateway: Stripe
- Deployment: Docker, AWS/Heroku

## Key Features
- Product Management System
- Advanced Storefront Functionality
- Delivery Route Optimization
- Secure Order Management
- Role-Based User Access Control

## Initial Setup

### First-Time Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

3. Run the setup script:
   ```bash
   cd ../backend
   npm run setup
   ```
   
   The setup script will guide you through:
   - Creating an admin user
   - Configuring the MongoDB connection
   - Setting up API keys (Stripe, Google Maps)
   - Configuring email settings
   - Generating security keys

4. The setup will create a `.env` file with your configuration. Review it to make sure everything is correct.

### Manual Configuration (Alternative)
If you prefer to configure manually:
1. Copy `.env.example` to `.env`
2. Edit `.env` with your settings
3. Create an admin user through the API

### Post-Setup
1. Start the backend server:
   ```bash
   npm run dev
   ```

2. Start the frontend development server:
   ```bash
   cd ../frontend
   npm run dev
   ```

3. Access the admin dashboard at `http://localhost:5173/admin`
   - Log in with your admin credentials
   - Start adding products and configuring the store

## Development Setup

### Prerequisites
- Node.js (v16+)
- MongoDB
- npm or yarn
- Google Maps API Key
- Stripe Account

### Installation
1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables
4. Run development server:
   ```
   npm run dev
   ```

## Project Structure
```
plumbing-supplies-ecommerce/
│
├── frontend/             # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── redux/
│
├── backend/              # Node.js backend
│   ├── src/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── middleware/
│
├── database/             # Database schemas
│
├── docs/                 # Documentation
│
└── deployment/           # Docker and deployment configs
```

## Development Milestones
- Week 4: Product database and storefront design
- Week 8: Delivery route optimization
- Week 12: Order management system
- Week 16: Final testing and deployment

## Deployment Guide

### Prerequisites
1. Create accounts on:
   - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (for database)
   - [Render](https://render.com/) (for hosting)
   - [GitHub](https://github.com/) (for code repository)

### Database Setup
1. Create a new MongoDB Atlas cluster
2. Create a database user and get your connection string
3. Add your IP address to the IP whitelist (or allow access from anywhere for testing)
4. Save your MongoDB URI - it should look like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/plumbing-supplies`

### Backend Deployment (Render)
1. Push your code to GitHub
2. Log in to Render.com
3. Click "New +" and select "Web Service"
4. Connect your GitHub repository
5. Configure the deployment:
   - Name: `plumbing-supplies-backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string
   - `NODE_ENV`: `production`
   - Add other variables from `.env.example` as needed

### Frontend Deployment (Render)
1. In the frontend directory, build the project:
   ```bash
   npm run build
   ```
2. On Render.com:
   - Create a new "Static Site"
   - Connect your GitHub repository
   - Set build command: `npm install && npm run build`
   - Set publish directory: `dist`
   - Add environment variables if needed

### Testing the Deployment
1. Wait for both services to deploy (this may take a few minutes)
2. Your backend will be available at: `https://your-backend-name.onrender.com`
3. Your frontend will be available at: `https://your-frontend-name.onrender.com`
4. Test the API endpoints using Postman or similar tool
5. Test the frontend functionality in your browser

### Troubleshooting
- Check Render logs for any deployment errors
- Verify environment variables are set correctly
- Ensure MongoDB connection is working
- Check CORS settings if frontend can't connect to backend

### Monitoring
- Use Render's built-in monitoring
- Check MongoDB Atlas metrics
- Set up logging (e.g., Winston or Morgan)
- Monitor API response times and errors

### Production Considerations
- Enable HTTPS
- Set up proper CORS policies
- Implement rate limiting
- Add security headers
- Set up monitoring and alerting
- Configure automatic backups for MongoDB
- Set up CI/CD pipeline

## Contributing
Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License
This project is licensed under the MIT License - see the LICENSE.md file for details.
