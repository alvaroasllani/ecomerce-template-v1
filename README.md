# Tech Accessories - Ecommerce Application

Modern ecommerce platform built with Next.js 16, React 19, and Tailwind CSS 4 for selling tech accessories and workspace products.

## Technology Stack

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **Tailwind CSS 4** - Utility-first CSS framework
- **Context API** - State management for shopping cart
- **localStorage** - Client-side data persistence

## Prerequisites

- Node.js 18.x or higher
- npm or yarn

## Project Structure

```
ecommerce-app/
├── src/
│   ├── app/                    # Next.js pages
│   │   ├── layout.js
│   │   ├── page.js
│   │   ├── products/
│   │   ├── checkout/
│   │   ├── orders/
│   │   └── about/
│   ├── components/             # Reusable components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── ProductCard.jsx
│   │   └── CartDrawer.jsx
│   ├── context/               # React Context
│   │   └── CartContext.jsx
│   └── data/                  # Mock data
│       └── products.js
├── public/                    # Static files
└── package.json
```

## Features

### Shopping Experience

- Product catalog with filtering and sorting
- Product detail pages with image galleries
- Shopping cart with quantity management
- Checkout process with form validation
- Order history tracking

### Cart Management

- Add/remove products
- Update quantities
- Persistent cart storage
- Real-time total calculation

### Order Processing

- Complete checkout flow
- Order confirmation
- Order history with status tracking
- Discount code system

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Data Storage

The application uses browser localStorage for data persistence:

- **Cart**: `localStorage.getItem("cart")`
- **Orders**: `localStorage.getItem("orders")`

To clear data:

```javascript
localStorage.removeItem("cart");
localStorage.removeItem("orders");
```

## Discount Codes

Available discount codes for testing:

- `WELCOME10` - $10 off
- `SAVE20` - $20 off

## Configuration

### Adding Products

Edit `src/data/products.js`:

```javascript
{
  id: 1,
  name: "Product Name",
  description: "Product description",
  price: 99.99,
  category: "Category",
  brand: "Brand",
  bgColor: "bg-slate-800",
  featured: true,
  inStock: true,
  rating: 4.5,
  reviews: 100
}
```

### Customizing Colors

Modify Tailwind classes in components:

- Primary: `indigo-600`
- Secondary: `gray-*`
- Accents: `teal-*`, `orange-*`

## Development Notes

- All cart functions use `useCallback` to prevent unnecessary re-renders
- Order confirmation uses `useRef` to prevent multiple cart clears
- Responsive design with mobile-first approach
- Sticky navigation and cart drawer
- Optimized with Next.js Image component ready
