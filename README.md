# Vue Payroll Frontend

A modern Vue.js frontend application for the payroll management system.

## Features

- 🔐 Authentication (Login/Register)
- 👥 Employee Management
- 💰 Payroll Processing
- 💱 Currency Management
- 📊 Dashboard with Statistics
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive Design
- 🔧 TypeScript Support

## Tech Stack

- **Vue 3** with Composition API
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Pinia** for state management
- **Vue Router** for navigation
- **Axios** for API communication
- **Heroicons** for icons
- **Vite** for development and building

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── auth/           # Authentication components
│   ├── common/         # Common components (NavBar, etc.)
│   ├── employees/      # Employee-specific components
│   ├── payroll/        # Payroll-specific components
│   └── currencies/     # Currency-specific components
├── views/              # Page components
├── stores/             # Pinia stores
├── services/           # API services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── router/             # Vue Router configuration
```

## API Integration

The application integrates with the following API endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/profile` - Get user profile
- `POST /auth/change-password` - Change password

### Employees
- `GET /employees` - List employees
- `POST /employees` - Create employee
- `GET /employees/:id` - Get employee details
- `PUT /employees/:id` - Update employee
- `DELETE /employees/:id` - Delete employee
- `GET /employees/:id/payslips` - Get employee payslips

### Payroll
- `GET /payroll/periods` - List payroll periods
- `POST /payroll/periods` - Create payroll period
- `POST /payroll/periods/:id/process` - Process payroll
- `POST /payroll/periods/:id/approve` - Approve payroll
- `GET /payroll/payslips` - List payslips
- `GET /payroll/payslips/:id` - Get payslip details
- `GET /payroll/periods/:id/summary` - Get payroll summary

### Currencies
- `GET /currencies` - List currencies
- `POST /currencies` - Create currency
- `GET /currencies/exchange-rate` - Get exchange rate
- `GET /currencies/convert` - Convert amount
- `POST /currencies/update-rates` - Update exchange rates
- `GET /currencies/exchange-rate-history` - Get rate history

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   Update `.env` file with your API base URL:
   ```
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## Configuration

### Environment Variables

- `VITE_API_BASE_URL` - Base URL for the API server

### API Service

The API service (`src/services/api.ts`) handles:
- Automatic token management
- Request/response interceptors
- Error handling
- Type-safe API calls

### State Management

The application uses Pinia for state management with separate stores for:
- **Auth Store** - User authentication and profile
- **Employees Store** - Employee data management
- **Payroll Store** - Payroll periods and processing
- **Currencies Store** - Currency and exchange rate management

### Routing

Protected routes require authentication. The router automatically:
- Redirects unauthenticated users to login
- Prevents authenticated users from accessing guest-only pages
- Loads user profile when token exists

## Development

### Code Style

The project uses:
- ESLint for code linting
- Prettier for code formatting
- TypeScript for type checking

Run linting:
```bash
npm run lint
```

### Component Guidelines

- Use Composition API with `<script setup>`
- Define proper TypeScript interfaces
- Follow Vue 3 best practices
- Use Tailwind utility classes for styling

### API Integration

- All API calls go through the centralized API service
- Use stores for state management
- Handle errors appropriately
- Show loading states for better UX

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your web server

3. Configure your web server to serve the SPA properly (handle client-side routing)

## Contributing

1. Follow the existing code style
2. Add proper TypeScript types
3. Test your changes thoroughly
4. Update documentation as needed

## License

This project is licensed under the MIT License.
