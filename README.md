# Startup Team Onboarding Manager

> A schema-driven onboarding system where new employee fields can be added without UI rewrites.

[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.0-purple.svg)](https://redux-toolkit.js.org/)

## 🎯 Overview

This is a **production-ready CRUD application** for managing employee onboarding data. Built with a **schema-driven architecture**, it allows adding new fields with minimal code changes - perfect for evolving business requirements.

### Key Features

- ✅ **CRUD Operations**: Create, Read, Update, Delete employees
- ✅ **Schema-Driven Forms**: Add fields without UI rewrites
- ✅ **Input Validation**: Required field enforcement with custom rules
- ✅ **Pagination & Search**: Efficient data browsing
- ✅ **Responsive Design**: Works on all devices
- ✅ **Modern UI**: Premium dark theme with animations
- ✅ **Type Safety**: Full TypeScript implementation

## 🏗️ Architecture

```
onboarding-application/
├── backend/                    # Express.js + Neon PostgreSQL
│   ├── src/
│   │   ├── config/            # Database & environment config
│   │   ├── controllers/       # Request handlers
│   │   ├── middleware/        # Express middleware
│   │   ├── models/            # Database models (Repository pattern)
│   │   ├── routes/            # API routes
│   │   ├── schemas/           # Field schema definitions ⭐
│   │   ├── services/          # Business logic layer
│   │   ├── utils/             # Helper utilities
│   │   └── validators/        # Input validation (Zod)
│   └── ...
│
├── frontend/                   # React + Redux Toolkit
│   ├── src/
│   │   ├── api/               # API service layer
│   │   ├── components/        # Reusable UI components
│   │   ├── config/            # Schema configuration ⭐
│   │   ├── features/          # Redux slices
│   │   ├── hooks/             # Custom React hooks
│   │   ├── layouts/           # Page layouts
│   │   ├── pages/             # Page components
│   │   ├── store/             # Redux store
│   │   ├── styles/            # CSS design system
│   │   ├── types/             # TypeScript types
│   │   └── utils/             # Helper utilities
│   └── ...
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Neon PostgreSQL account (or any PostgreSQL database)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your database credentials:
   ```env
   DATABASE_URL=postgresql://username:password@your-neon-host.neon.tech/dbname?sslmode=require
   PORT=5000
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Run database migrations**
   ```bash
   npm run db:migrate
   ```

5. **Seed sample data (optional)**
   ```bash
   npm run db:seed
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

## 🔧 How to Add New Fields

### The Extensibility Magic ✨

This application uses a **schema-driven architecture**. To add a new field, you only need to update the schema configuration files - the UI and validation will automatically adapt!

### Step-by-Step Guide

#### 1. Add Field to Backend Schema

Edit `backend/src/schemas/employeeSchema.ts`:

```typescript
// Add your new field to the employeeFields array
{
  name: 'department',           // Field identifier
  label: 'Department',          // Display label
  type: 'select',               // Field type
  placeholder: 'Select department',
  required: false,
  order: 9,                     // Display order
  group: 'employment',          // Group for organization
  columnName: 'department',     // Database column (optional)
  options: [                    // For select fields
    { value: 'engineering', label: 'Engineering' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' },
  ],
  validations: [
    { type: 'required', message: 'Department is required' },
  ],
},
```

#### 2. Add Field to Frontend Schema

Edit `frontend/src/config/formSchema.ts` with the same field definition.

#### 3. Update Database (if using dedicated column)

Add a migration in `backend/src/scripts/migrate.ts`:

```typescript
// Add column for the new field
await pool.query(`
  ALTER TABLE employees 
  ADD COLUMN IF NOT EXISTS department VARCHAR(50);
`);
```

Run migration:
```bash
npm run db:migrate
```

#### 4. Update Types (if using TypeScript)

Add the field to `Employee` interface in both backend and frontend type files.

### Supported Field Types

| Type | Description | Example |
|------|-------------|---------|
| `text` | Text input | First Name |
| `email` | Email input with validation | Email Address |
| `phone` | Phone number input | Phone Number |
| `date` | Date picker | Joining Date |
| `select` | Dropdown selection | Role |
| `boolean` | Toggle switch | Laptop Required |
| `number` | Numeric input | Age |
| `textarea` | Multi-line text | Notes |

### Validation Rules

| Rule | Description | Example |
|------|-------------|---------|
| `required` | Field must have value | `{ type: 'required', message: 'Required' }` |
| `email` | Must be valid email | `{ type: 'email', message: 'Invalid email' }` |
| `minLength` | Minimum character count | `{ type: 'minLength', value: 2, message: '...' }` |
| `maxLength` | Maximum character count | `{ type: 'maxLength', value: 50, message: '...' }` |
| `pattern` | Regex pattern match | `{ type: 'pattern', value: '^[A-Z]', message: '...' }` |

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/employees` | List all employees (paginated) |
| `GET` | `/api/employees/:id` | Get single employee |
| `POST` | `/api/employees` | Create new employee |
| `PUT` | `/api/employees/:id` | Update employee |
| `DELETE` | `/api/employees/:id` | Delete employee |
| `GET` | `/api/employees/check-email` | Check email availability |
| `GET` | `/api/schema` | Get form schema |
| `GET` | `/api/health` | Health check |

### Query Parameters

```
GET /api/employees?page=1&limit=10&search=john&sortBy=created_at&sortOrder=desc
```

## 🚢 Deployment

### Backend Deployment (Render/Railway)

1. Create a new web service
2. Connect your GitHub repository
3. Set build command: `npm run build`
4. Set start command: `npm start`
5. Add environment variables

### Frontend Deployment (Vercel/Netlify)

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables (VITE_API_URL)

### Environment Variables for Production

**Backend:**
```env
NODE_ENV=production
DATABASE_URL=your-production-database-url
CORS_ORIGIN=https://your-frontend-domain.com
```

**Frontend:**
```env
VITE_API_URL=https://your-backend-domain.com/api
```

## 🎨 Design Decisions

### Why Schema-Driven Architecture?

1. **Extensibility**: Add fields without touching component code
2. **Consistency**: Validation rules apply uniformly
3. **Maintainability**: Single source of truth for form structure
4. **Scalability**: Easy to add new field types

### Why Redux Toolkit?

1. **Predictable State**: Centralized, testable state management
2. **DevTools**: Excellent debugging experience
3. **Best Practices**: Built-in immer, thunks, and RTK Query ready

### Why Neon PostgreSQL?

1. **Serverless**: Scales automatically
2. **Cost-Effective**: Pay only for what you use
3. **Developer-Friendly**: Branching, easy setup

## 🔮 Future Enhancements

- [ ] Role-based access control
- [ ] Bulk import/export (CSV, Excel)
- [ ] Email notifications
- [ ] Audit logging
- [ ] Custom field creation UI
- [ ] Multi-tenant support

## 📝 Assumptions

1. Single-tenant application (one organization)
2. Email is unique per employee
3. All users have full CRUD access (no auth implemented)
4. Additional dynamic fields stored in JSONB column

## 👤 Author

**Vrushali**

---

*Built with ❤️ for startup teams managing their growing workforce.*
