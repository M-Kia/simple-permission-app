# How to Run the Application

## Prerequisites

- Node.js >= 18
- Yarn 4.x
- Docker and Docker Compose

## Setup Instructions

### 1. Install Dependencies

```bash
yarn install
```

### 2. Create Environment File

Create a `.env` file in the `apps/api` folder with the following variables:

```bash
# apps/api/.env

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=123456
DB_DATABASE=db

# Environment
NODE_ENV=development
```

You can also copy this command to create the file:

```bash
cat > apps/api/.env << EOF
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=123456
DB_DATABASE=db
NODE_ENV=development
EOF
```

### 3. Start the Database

Run Docker Compose to start the PostgreSQL database:

```bash
yarn run docker:up
```

This will start a PostgreSQL 17 container on port 5432.

### 4. Start the Development Servers

Run the development servers for both API and Web:

```bash
yarn run dev
```

This will start:
- **API (NestJS GraphQL)**: http://localhost:4000/graphql
- **Web (Next.js)**: http://localhost:3000

## Stopping the Application

To stop the Docker containers:

```bash
yarn run docker:down
```

## Notes

- The database data is persisted in `apps/api/volume/postgresql/`
- In development mode, the database schema is automatically synchronized
