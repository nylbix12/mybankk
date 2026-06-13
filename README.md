# myBank

A personal expense management web application built for young adults to track and categorize their spending.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Backend | Symfony 7 (PHP 8.4) |
| Database | MySQL 8 |
| Auth | JWT (LexikJWTAuthenticationBundle) |
| Containerization | Docker + Docker Compose |
| CI/CD | GitHub Actions |

## Features

- Register and log in to a personal account
- Create, edit, and delete expense operations (label, amount, date, category)
- Create, edit, and delete categories with a custom color
- Dashboard with total expenses, monthly total, and operation count
- Search and filter operations by category
- Responsive design (mobile, tablet, desktop)

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Docker Compose (included with Docker Desktop)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/nylbix12/mybankk.git
cd mybankk
```

### 2. Start the application

```bash
docker compose up --build
```

This starts 5 services:

| Service | URL | Description |
|---|---|---|
| Frontend | http://localhost:3000 | React app |
| Backend API | http://localhost:8081 | Symfony API |
| phpMyAdmin | http://localhost:8082 | Database UI |
| MySQL | localhost:3306 | Database |

### 3. Run database migrations

On first start, run the migrations to create the database schema:

```bash
docker compose exec backend php bin/console doctrine:migrations:migrate --no-interaction
```

### 4. Open the app

Go to [http://localhost:3000](http://localhost:3000) and create an account.

## Project Structure

```
mybankk/
├── backend/              # Symfony 7 API
│   ├── src/
│   │   ├── Controller/   # AuthController, OperationController, CategoryController
│   │   ├── Entity/       # User, Operation, Category
│   │   └── Repository/
│   ├── migrations/       # Database migrations
│   ├── docker/           # Nginx config
│   └── Dockerfile
├── frontend/             # React + Vite SPA
│   ├── src/
│   │   ├── components/   # UI, Layout, Operations, Categories
│   │   ├── pages/        # Login, Register, Dashboard, Categories
│   │   ├── context/      # AuthContext (JWT storage)
│   │   ├── services/     # Axios API client
│   │   ├── utils/        # Formatting helpers
│   │   └── styles/       # SCSS variables and global styles
│   └── Dockerfile
├── docker-compose.yml
└── .github/
    └── workflows/
        └── ci.yml        # CI/CD pipeline
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create an account |
| POST | `/api/auth/login` | No | Log in, returns JWT token |
| GET | `/api/me` | Yes | Get current user info |
| GET | `/api/operations` | Yes | List operations |
| POST | `/api/operations` | Yes | Create an operation |
| PUT | `/api/operations/{id}` | Yes | Update an operation |
| DELETE | `/api/operations/{id}` | Yes | Delete an operation |
| GET | `/api/categories` | Yes | List categories |
| POST | `/api/categories` | Yes | Create a category |
| PUT | `/api/categories/{id}` | Yes | Update a category |
| DELETE | `/api/categories/{id}` | Yes | Delete a category |

## CI/CD Pipeline

The GitHub Actions pipeline runs on every push to `main` or `develop` and on pull requests to `main`.

**Jobs:**
1. **Backend** — Installs PHP dependencies, generates JWT keys, runs migrations, and executes tests
2. **Frontend** — Installs Node dependencies and builds the React app
3. **Docker** — Builds all Docker images (runs only on `main`)

See [`.github/workflows/ci.yml`](.github/workflows/ci.yml) for the full configuration.

## Environment Variables

### Backend (`backend/.env`)

```env
DATABASE_URL=mysql://mybank:mybank@db:3306/mybank?serverVersion=8.0.32&charset=utf8mb4
JWT_PASSPHRASE=changeme_dev
APP_ENV=dev
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:8081
```

## Stopping the Application

```bash
docker compose down
```

To also remove the database volume:

```bash
docker compose down -v
```
