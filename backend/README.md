# Print7 Backend API

A complete Node.js/Express backend for an online printing e-commerce platform, built with Firebase integration and mock database fallback.

## Features

- Product management with filtering and search
- Shopping cart functionality
- Order processing and tracking
- User authentication and profiles
- Design management
- File upload handling
- Payment processing (mock)
- Admin controls
- Firebase Firestore integration
- Mock database for offline development

## Project Structure

```
src/
├── config/              # Configuration files
│   ├── firebase.js      # Firebase Admin SDK setup
│   └── index.js         # Central configuration
├── controllers/         # Business logic
│   ├── productController.js
│   ├── orderController.js
│   ├── userController.js
│   ├── designController.js
│   ├── uploadController.js
│   ├── cartController.js
│   └── paymentController.js
├── routes/             # API routes
│   ├── productRoutes.js
│   ├── orderRoutes.js
│   ├── userRoutes.js
│   ├── designRoutes.js
│   ├── uploadRoutes.js
│   ├── cartRoutes.js
│   └── paymentRoutes.js
├── middleware/         # Custom middleware
│   ├── auth.js        # Authentication & authorization
│   ├── errorHandler.js
│   ├── upload.js      # Multer configuration
│   └── validation.js  # Input validation rules
├── data/              # Data & seeding
│   ├── seedData.js    # Sample products
│   └── mockDb.js      # In-memory database
├── utils/             # Utility functions
│   ├── helpers.js     # Helper functions
│   └── constants.js   # Constants and enums
└── server.js          # Main entry point
```

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

3. Configure environment variables in `.env`:
   - `PORT=5000`
   - `FRONTEND_URL=http://localhost:3000`
   - `NODE_ENV=development`
   - Firebase credentials (optional - app works without them)

## Running the Server

### Development (with mock database)
```bash
npm start
```

The server will start on `http://localhost:5000` with sample products automatically seeded.

### Production
Set `NODE_ENV=production` and ensure proper Firebase configuration.

## API Endpoints

### Products
- `GET /api/products` - List all products (with pagination, filtering, sorting)
- `GET /api/products/:id` - Get single product
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/search?q=query` - Search products
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `POST /api/orders` - Create new order (auth required)
- `GET /api/orders` - Get user's orders (auth required)
- `GET /api/orders/:id` - Get order details (auth required)
- `GET /api/orders/admin/all` - Get all orders (admin)
- `GET /api/orders/admin/stats` - Get order statistics (admin)
- `PUT /api/orders/:id/status` - Update order status (admin)

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (auth required)
- `PUT /api/users/profile` - Update profile (auth required)
- `GET /api/users/admin/all` - Get all users (admin)
- `PUT /api/users/:id/role` - Update user role (admin)

### Designs
- `POST /api/designs` - Save a design (auth required)
- `GET /api/designs` - Get user's designs (auth required)
- `GET /api/designs/:id` - Get single design
- `PUT /api/designs/:id` - Update design (auth required)
- `DELETE /api/designs/:id` - Delete design (auth required)

### Cart
- `GET /api/cart` - Get user's cart (auth required)
- `POST /api/cart/add` - Add item to cart (auth required)
- `PUT /api/cart/:itemId` - Update cart item (auth required)
- `DELETE /api/cart/:itemId` - Remove from cart (auth required)
- `DELETE /api/cart` - Clear cart (auth required)

### Uploads
- `POST /api/upload/image` - Upload image file (auth required)
- `POST /api/upload/design` - Upload design file (auth required)
- `DELETE /api/upload/:filename` - Delete uploaded file (auth required)

### Payments (Mock)
- `POST /api/payment/process` - Process payment (auth required)
- `POST /api/payment/verify` - Verify payment (auth required)
- `GET /api/payment/:orderId` - Get payment status (auth required)

### Seeding
- `POST /api/seed` - Seed database with sample products

## Database

### Mock Database (Default)
The application includes an in-memory mock database that works without Firebase configuration. This is perfect for:
- Local development
- Testing
- Demonstration purposes

Data is reset when the server restarts.

### Firebase Firestore (Optional)
To use Firebase Firestore:
1. Set up a Firebase project
2. Add credentials to `.env`
3. The app will automatically switch to Firestore

Both databases support the same operations and have compatible interfaces.

## Authentication

The application uses Firebase Authentication when configured. For mock auth, any token starting with a valid format will be accepted. Example:
```
Authorization: Bearer mock-token-user123
```

## File Uploads

Uploaded files are stored in the `/uploads` directory and served statically. Supported file types:
- Images: `.jpg`, `.jpeg`, `.png`, `.svg`
- Documents: `.pdf`

Maximum file size: 10MB

## Error Handling

All endpoints return consistent JSON responses:

Success:
```json
{
  "success": true,
  "message": "Description of success",
  "data": {...}
}
```

Error:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## CORS Configuration

By default, CORS is configured to allow requests from:
- `http://localhost:3000`
- `http://localhost:3001`
- `http://127.0.0.1:3000`
- Custom frontend URL from `FRONTEND_URL` env variable

## Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Firebase (optional)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_DATABASE_URL=your-database-url
STORAGE_BUCKET=your-bucket-name
```

## Security Features

- CORS protection
- Helmet.js security headers
- Input validation and sanitization
- Rate limiting ready
- Authentication and authorization checks
- File upload validation
- JWT token verification

## Sample Data

The application seeds 30+ products across 12 categories:
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

Products include pricing, descriptions, materials, sizes, ratings, and images.

## Development

### Logging
Morgan is configured for request logging. Adjust in `server.js` as needed.

### Validation
Express-validator is used for input validation. Validation rules are defined in `middleware/validation.js`.

### Response Format
All responses follow a consistent format with `success`, `message`, and `data` fields.

## License

ISC

## Author

Print7 Team
