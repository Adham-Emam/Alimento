# Alimento

A full-stack food platform built with Django REST Framework and Next.js, featuring modern authentication, API documentation, and background task processing.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://alimento-kappa.vercel.app/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Django](https://img.shields.io/badge/Django-092E20?logo=django&logoColor=white)](https://www.djangoproject.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## Overview

Alimento is a comprehensive food-related platform that combines a powerful Django REST API backend with a modern Next.js frontend. The platform provides robust APIs for managing food data with a sleek, responsive user interface built using cutting-edge web technologies.

## Features

- **Secure Authentication**: JWT-based authentication system for secure user management
- **RESTful APIs**: Well-structured APIs built with Django REST Framework
- **Interactive API Documentation**: Auto-generated Swagger/OpenAPI documentation
- **Background Tasks**: Celery integration for handling asynchronous operations
- **Modern UI**: Beautiful, responsive interface using shadcn/ui components
- **Type Safety**: Full TypeScript support across the frontend
- **Containerized**: Docker and Docker Compose setup for easy deployment
- **Production Ready**: Optimized for deployment with Vercel and Docker

## Tech Stack

### Backend

- **Django** - High-level Python web framework
- **Django REST Framework** - Powerful toolkit for building Web APIs
- **djangorestframework-simplejwt** - JWT authentication
- **Celery** - Distributed task queue for background processing
- **Redis** - Message broker for Celery
- **PostgreSQL** - Production database
- **Swagger/OpenAPI** - API documentation

### Frontend

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible React components
- **Redux** - Complex state management

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **Python** (v3.9 or higher)
- **Docker** and **Docker Compose** (optional, for containerized setup)
- **PostgreSQL** (for production)
- **Redis** (for Celery tasks)

## Quick Start

### Using Docker Compose (Recommended)

1. **Clone the repository**

   ```bash
   git clone https://github.com/Adham-Emam/Alimento.git
   cd Alimento
   ```

2. **Set up environment variables**

   Create `.env` files in both `backend/` and `frontend/` directories (see [Environment Variables](#environment-variables) section)

3. **Start the application**

   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/api/docs/

### Manual Setup

#### Backend Setup

1. **Navigate to the backend directory**

   ```bash
   cd backend
   ```

2. **Create a virtual environment**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Run migrations**

   ```bash
   python manage.py migrate
   ```

6. **Create a superuser**

   ```bash
   python manage.py createsuperuser
   ```

7. **Start the development server**

   ```bash
   python manage.py runserver
   ```

8. **Start Celery worker (in a separate terminal)**
   ```bash
   celery -A your_project_name worker --loglevel=info
   ```

#### Frontend Setup

1. **Navigate to the frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Access the application**

   Open http://localhost:3000 in your browser

## Environment Variables

### Backend (.env)

Create a `.env` file in the `backend/` directory:

```env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/alimento_db
# For development, you can use SQLite:
# DATABASE_URL=sqlite:///db.sqlite3

# JWT Settings
JWT_SECRET=your-jwt-secret-here

# Celery
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0

# Redis
REDIS_URL=redis://localhost:6379/0

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend (.env.local)

Create a `.env.local` file in the `frontend/` directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## API Documentation

Once the backend is running, you can access the interactive API documentation at:

- **Swagger UI**: http://localhost:8000/api/docs/
- **ReDoc**: http://localhost:8000/api/redoc/

The API documentation provides detailed information about all available endpoints, request/response formats, and allows you to test API calls directly from your browser.

## Project Structure

```
Alimento/
├── backend/                 # Django backend
│   ├── api/                # API app
│   ├── config/             # Project configuration
│   ├── manage.py           # Django management script
│   └── requirements.txt    # Python dependencies
│
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # React components
│   │   ├── lib/           # Utility functions
│   │   └── styles/        # Global styles
│   ├── public/            # Static assets
│   └── package.json       # Node dependencies
│
├── docker-compose.yml     # Docker Compose configuration
└── README.md             # Project documentation
```

## Deployment

### Frontend (Vercel)

The frontend is deployed on Vercel. To deploy your own instance:

1. Push your code to GitHub
2. Import the project in Vercel
3. Set the root directory to `frontend/`
4. Add environment variables in Vercel dashboard
5. Deploy

### Backend (Docker)

The backend can be deployed using Docker on platforms like Render, Railway, or any VPS:

1. **Build the Docker image**

   ```bash
   docker build -t alimento-backend ./backend
   ```

2. **Run the container**

   ```bash
   docker run -p 8000:8000 --env-file .env alimento-backend
   ```

3. **Set up PostgreSQL and Redis** on your hosting platform

4. **Run migrations**
   ```bash
   docker exec -it <container-id> python manage.py migrate
   ```

### Celery in Production

Ensure you have a Redis instance running and configure the Celery worker as a separate service:

```bash
celery -A your_project_name worker --loglevel=info
```

For production, consider using a process manager like Supervisor or systemd to keep Celery running.

## Development

### Backend Development

- **Run tests**

  ```bash
  python manage.py test
  ```

- **Create migrations**

  ```bash
  python manage.py makemigrations
  python manage.py migrate
  ```

- **Access Django admin**

  Visit http://localhost:8000/admin/ and log in with your superuser credentials

### Frontend Development

- **Run linting**

  ```bash
  npm run lint
  ```

- **Build for production**

  ```bash
  npm run build
  ```

- **Start production server**
  ```bash
  npm run start
  ```

## Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

Please ensure your code follows the existing code style and includes appropriate tests.

## Troubleshooting

### Common Issues

**Database connection errors**

- Verify PostgreSQL is running
- Check `DATABASE_URL` in your `.env` file
- Ensure database exists: `createdb alimento_db`

**Celery tasks not running**

- Verify Redis is running: `redis-cli ping`
- Check `CELERY_BROKER_URL` configuration
- Ensure Celery worker is running

**CORS errors**

- Verify `CORS_ALLOWED_ORIGINS` in backend `.env`
- Check `NEXT_PUBLIC_API_URL` in frontend `.env.local`

**Module import errors**

- Activate virtual environment: `source venv/bin/activate`
- Reinstall dependencies: `pip install -r requirements.txt`

## License

This project is currently unlicensed. Please contact the repository owner for usage permissions.

## Acknowledgments

- Built with [Django REST Framework](https://www.django-rest-framework.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

## Contact

For questions or support, please open an issue on GitHub or contact the maintainers.

---

**Live Demo**: [alimento-kappa.vercel.app](https://alimento-kappa.vercel.app/)

**Repository**: [github.com/Adham-Emam/Alimento](https://github.com/Adham-Emam/Alimento)
