# Plumbing Supplies E-Commerce Platform

A modern, full-stack e-commerce platform for plumbing supplies with flexible deployment options and provider integrations.

## Features

- Modern React (v18) with TypeScript
- Material-UI and Tailwind CSS for styling
- Vite for fast development
- Multiple deployment options:
  - Netlify (Free tier: Unlimited sites, 100GB/month)
  - Vercel (Free tier: 100GB/month, serverless functions)
  - Firebase (Free tier: 10GB storage)
  - GitHub Pages (Free tier: Unlimited static sites)
  - Render (Free tier: Static sites)

- Database options:
  - MongoDB Atlas (Free tier: 512MB)
  - Supabase PostgreSQL (Free tier: 500MB)
  - Firebase Firestore (Free tier: 1GB)
  - PlanetScale MySQL (Free tier: 5GB)

- Authentication providers:
  - Supabase Auth (Unlimited users)
  - Firebase Auth (Unlimited users)
  - Auth0 (7,000 users free)
  - Clerk (5,000 users free)

- Storage options:
  - Supabase Storage (1GB free)
  - Firebase Storage (5GB free)
  - Cloudinary (25GB free)

## Quick Start

### Prerequisites

- Node.js 18 or later
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/plumbing-supplies-ecommerce.git
cd plumbing-supplies-ecommerce
```

2. Run the setup wizard:
```bash
npm install
node setup.js
```

The setup wizard will guide you through:
- Selecting your database provider
- Choosing a hosting platform
- Configuring authentication
- Setting up file storage
- Installing necessary dependencies

3. Start development:
```bash
# Frontend
cd frontend
npm run dev

# Backend (in a new terminal)
cd backend
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
plumbing-supplies-ecommerce/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── hooks/          # Custom React hooks
│   │   └── types/          # TypeScript types
│   └── package.json
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Data models
│   │   ├── routes/         # API routes
│   │   └── services/       # Business logic
│   └── package.json
├── config.example.json     # Provider configuration template
└── setup.js               # Interactive setup wizard
```

## Configuration

The project uses a flexible configuration system that supports multiple providers:

1. Run `node setup.js` to configure:
   - Database connection
   - Authentication provider
   - Storage solution
   - Deployment platform

2. The wizard will:
   - Generate necessary config files
   - Create environment variables
   - Install provider-specific dependencies
   - Set up deployment configurations

## Deployment

After running the setup wizard, deploy using the provider-specific command:

- Netlify: `netlify deploy`
- Vercel: `vercel`
- Firebase: `firebase deploy`
- GitHub Pages: `git push origin main`
- Render: `git push render main`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
