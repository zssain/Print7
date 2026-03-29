# Print7 Backend - Quick Start Guide

## Setup & Installation

1. **Navigate to backend directory:**
   ```bash
   cd /sessions/pensive-zen-gauss/mnt/Print7/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment (optional):**
   ```bash
   cp .env.example .env
   # Edit .env with your settings (Firebase optional)
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

   Server runs on: `http://localhost:5000`
   Health check: `http://localhost:5000/health`

## Key Features

- ✅ Complete REST API for e-commerce printing platform
- ✅ Works without Firebase (mock database included)
- ✅ 30+ seed products automatically loaded
- ✅ User authentication & admin controls
- ✅ Shopping cart & order management
- ✅ File upload support
- ✅ Design management
- ✅ Mock payment processing

## Database

**No external setup required!** The backend includes:
- In-memory mock database (default)
- Automatic seeding with 30+ products
- Firebase Firestore support (optional)

## Quick API Tests

### Get All Products
```bash
curl http://localhost:5000/api/products
```

### Search Products
```bash
curl "http://localhost:5000/api/products/search?q=business"
```

### Get Products by Category
```bash
curl http://localhost:5000/api/products/category/business-cards
```

### Health Check
```bash
curl http://localhost:5000/health
```

### Seed Database (if needed)
```bash
curl -X POST http://localhost:5000/api/seed
```

## File Structure

```
src/
├── server.js              # Main entry point
├── config/                # Firebase & environment config
├── controllers/           # Business logic (7 files)
├── routes/               # API routes (7 files)
├── middleware/           # Auth, validation, upload
├── data/                # Seed data & mock database
└── utils/               # Helpers & constants
```

## Routes Overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products` | No | List products |
| GET | `/api/products/:id` | No | Get product |
| POST | `/api/orders` | Yes | Create order |
| GET | `/api/orders` | Yes | Get user orders |
| POST | `/api/users/register` | No | Register user |
| POST | `/api/users/login` | No | Login user |
| GET | `/api/users/profile` | Yes | Get profile |
| GET | `/api/cart` | Yes | Get cart |
| POST | `/api/cart/add` | Yes | Add to cart |

See README.md for complete API documentation.

## Authentication

For testing with the mock database:
```bash
Authorization: Bearer mock-token-user123
```

## Troubleshooting

**Port already in use?**
```bash
PORT=5001 npm start
```

**Clear old data?**
Just restart the server - mock database resets.

**Need Firebase?**
Add credentials to `.env` and restart. App auto-detects and switches.

## File Uploads

- Upload to: `/api/upload/image` or `/api/upload/design`
- Files stored in: `/uploads/`
- Supported: `.jpg`, `.png`, `.svg`, `.pdf`
- Max size: 10MB

## Mock Data

30+ products seeded across categories:
- Business Cards
- Flyers
- Banners
- Posters
- T-Shirts
- Mugs
- Stickers
- Signs
- Brochures
- Postcards
- Labels
- Caps

## Next Steps

1. Install: `npm install`
2. Start: `npm start`
3. Test: Visit `http://localhost:5000/health`
4. Use: Connect frontend to `http://localhost:5000`

All dependencies are already listed in package.json - no manual installation needed!
