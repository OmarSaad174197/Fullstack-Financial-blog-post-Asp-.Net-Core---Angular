# FinEdge — FinTech BlogPost

Modern full‑stack application for managing fintech stocks, community comments, and personal portfolios.

## Overview

FinEdge provides:
- Stock catalog with filtering, CRUD, and detail views
- Community comments per stock
- User portfolios with add/remove symbol workflows
- Authentication with JWT for protected actions

The solution is split into:
- `Api/` — ASP.NET Core Web API
- `Client-Side/` — Angular frontend

## Tech Stack

- **Backend:** ASP.NET Core 9, Entity Framework Core, Identity, JWT
- **Frontend:** Angular (standalone components), RxJS
- **Database:** SQL Server

## Requirements

- .NET SDK 9.x
- Node.js 20.x + npm
- SQL Server (local or remote)

## Project Structure

```
Api/
  BlogPost/           ASP.NET Core API
Client-Side/
  src/                Angular app source
```

## Backend Setup (API)

1. Update connection string in:
   - `Api/BlogPost/appsettings.json`

2. Apply migrations and create the database:
   ```bash
   dotnet ef database update --project Api/BlogPost/BlogPost.csproj
   ```

3. Run the API:
   ```bash
   dotnet run --project Api/BlogPost/BlogPost.csproj
   ```

By default, the API runs on:
- `http://localhost:5150`
- Swagger: `http://localhost:5150/swagger`

## Frontend Setup (Angular)

1. Install dependencies:
   ```bash
   cd Client-Side
   npm install
   ```

2. Confirm API base URL:
   - `Client-Side/src/environments/environment.ts`

3. Run the client:
   ```bash
   npm start
   ```

Frontend runs on:
- `http://localhost:4200`

## Authentication

Registration and login use JWT. The token is stored in local storage and added to protected API calls automatically.

Protected endpoints include:
- Comment create/update/delete
- Portfolio add/remove

## API Endpoints (Summary)

**Account**
- `POST /api/Account/Register`
- `POST /api/Account/Login`

**Stock**
- `GET /api/Stock`
- `GET /api/Stock/{id}`
- `POST /api/Stock`
- `PUT /api/Stock/{id}`
- `DELETE /api/Stock/{id}`

**Comment**
- `GET /api/Comment`
- `GET /api/Comment/{id}`
- `POST /api/Comment/{stockId}`
- `PUT /api/Comment/{id}`
- `DELETE /api/Comment/{id}`

**Portfolio**
- `GET /api/Portfolio`
- `POST /api/Portfolio?symbol={symbol}`
- `DELETE /api/Portfolio?symbol={symbol}`

## Validation Rules

Validation is enforced both in API and UI:
- Stock fields have max lengths and numeric ranges
- Comment title/content must be 5–20 characters
- Password requires 8+ chars with upper/lower/number/symbol

## Troubleshooting

- **Port already in use**
  - Stop the previous process or change ports in `Api/BlogPost/Properties/launchSettings.json`.

- **CORS issues**
  - Ensure the API is running and allows `http://localhost:4200`.

- **Migrations fail**
  - Confirm SQL Server connection string and `dotnet-ef` tool is installed.

## Running Tests

Currently the solution relies on manual verification via Swagger and the UI.  
Automated tests can be added in a future iteration if needed.

## License

This project is provided for educational and internal use.
