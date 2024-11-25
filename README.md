# Plumbing Supplies E-Commerce Platform

A modern, full-stack e-commerce platform for plumbing supplies built with React, TypeScript, and Node.js.

## Features

- Modern React (v18) with TypeScript
- Tailwind CSS for styling
- Vite for fast development and building
- Responsive design
- Secure authentication
- Payment processing integration
- Product management
- Shopping cart functionality
- Automated deployment

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

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd ../backend
npm install
```

4. Set up environment variables:
- Copy `.env.example` to `.env` in both frontend and backend directories
- Update the variables with your configuration

### Development

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
plumbing-supplies-ecommerce/
├── frontend/               # React frontend
│   ├── src/               # Source files
│   ├── public/            # Static files
│   └── package.json       # Frontend dependencies
├── backend/               # Node.js backend
│   ├── src/              # Source files
│   └── package.json      # Backend dependencies
├── database/             # Database migrations and seeds
├── docs/                 # Documentation
└── deployment/           # Deployment configurations
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
