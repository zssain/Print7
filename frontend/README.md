# Print7 - Online Printing E-commerce Platform

Print7 is a Vistaprint-style online printing e-commerce platform built with Next.js, Tailwind CSS, and Fabric.js. It allows users to design, customize, and order printed products.

## Features

- **Product Catalog**: Browse hundreds of customizable printed products
- **Design Studio**: Full-featured design editor with Fabric.js
- **Shopping Cart**: Add items and manage quantities
- **Checkout Flow**: Multi-step checkout with shipping and payment
- **User Dashboard**: View orders and saved designs
- **Authentication**: User registration and login
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Design Tools**: Fabric.js for the design studio
- **State Management**: Zustand
- **Notifications**: React Hot Toast
- **Icons**: Lucide React
- **Backend Services**: Firebase (optional)

## Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── page.tsx        # Homepage
│   ├── products/       # Product listing and detail pages
│   ├── studio/         # Design studio
│   ├── cart/           # Shopping cart
│   ├── checkout/       # Checkout flow
│   ├── auth/           # Login and registration
│   └── dashboard/      # User dashboard
├── components/         # Reusable React components
│   ├── ui/            # UI components (Button, Input, Modal, etc.)
│   ├── Navbar.tsx     # Navigation bar
│   ├── Footer.tsx     # Footer
│   ├── ProductCard.tsx # Product card component
│   └── ...
├── store/             # Zustand stores for state management
├── lib/               # Utilities and helpers
├── data/              # Mock data and constants
└── types/             # TypeScript type definitions
```

## Getting Started

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies (not done automatically)
npm install

# Create environment file
cp .env.example .env.local
```

### Configuration

1. Update `.env.local` with your Firebase credentials or API endpoints
2. Configure any required environment variables

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Building for Production

```bash
npm run build
npm start
```

## Key Pages

- **Home** (`/`): Featured products, categories, testimonials
- **Products** (`/products`): All products with filters and sorting
- **Product Detail** (`/products/[category]/[id]`): Product details and specifications
- **Design Studio** (`/studio`): Fabric.js-based design editor
- **Cart** (`/cart`): Shopping cart management
- **Checkout** (`/checkout`): Multi-step checkout process
- **Auth** (`/auth/login`, `/auth/register`): User authentication
- **Dashboard** (`/dashboard`): User account and order history

## Design Studio Features

- Text tool with font customization
- Shape tools (rectangles, circles)
- Image upload and insertion
- Template library
- Undo/Redo functionality
- Zoom controls
- Layer management
- Color picker
- Object properties panel

## Color Scheme

- **Primary Blue**: `#0066CC`
- **Secondary Orange**: `#FF6600`
- **Dark**: `#1A1A2E`
- **Light**: `#F5F5F5`
- **White**: `#FFFFFF`

## State Management

The application uses Zustand for state management with these stores:

- **cartStore**: Shopping cart management
- **authStore**: User authentication state
- **designStore**: Design studio state and saved designs

## Components

### UI Components
- Button
- Input
- Modal
- Badge
- Rating
- Breadcrumbs
- Pagination
- Spinner

### Product Components
- ProductCard
- ProductGrid
- CategoryCard
- ProductFilters
- HeroCarousel

### Design Studio Components
- DesignCanvas
- ToolBar
- LeftPanel
- RightPanel

## API Integration

The application includes an API client (`src/lib/api.ts`) for backend integration. Currently uses mock data; connect to a real backend by updating the API endpoints.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- Real payment gateway integration (Stripe, Square)
- Firebase authentication implementation
- Image upload to cloud storage
- Advanced design templates
- Print-on-demand API integration
- Order tracking and notifications
- Admin dashboard for product management
- Customer reviews and ratings
- Wishlist functionality

## License

MIT

## Contact

For questions or support, contact hello@print7.com
