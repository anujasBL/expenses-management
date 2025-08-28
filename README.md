# Expenses Management System

A modern, full-stack expense tracking application built with React, TypeScript, and Tailwind CSS. This application is designed to help users manage personal and business expenses with a clean, intuitive interface.

## 🚀 **Current Status: Phase 1 Iteration 1 - API Integration**

### ✅ **Completed Features:**
- **Core Expense Management**: Full CRUD operations via API
- **API Integration**: Generic API service layer for all entities
- **React Query**: Advanced state management and caching
- **Form Validation**: React Hook Form with Zod schemas
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: Full TypeScript implementation

### 🔧 **Technology Stack:**
- **Frontend**: React 18.2+, TypeScript 5.0+
- **Styling**: Tailwind CSS 3.3+, shadcn/ui components
- **Form Handling**: React Hook Form 7.45+, Zod 3.22+
- **State Management**: React Query 5.0+ (TanStack Query)
- **API Layer**: Generic REST API service for any entity type
- **Build Tool**: Vite 5.0+
- **Routing**: React Router DOM

## 📋 **Prerequisites**

- **Node.js**: 18.18.0 or higher
- **npm**: 8.0.0 or higher
- **API Backend**: Running backend service (see configuration below)

## 🛠️ **Installation & Setup**

### 1. **Clone the Repository**
```bash
git clone <repository-url>
cd expenses-management
```

### 2. **Install Dependencies**
```bash
npm install
```

### 3. **Environment Configuration**
Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=https://your-api-backend.com
VITE_API_TIMEOUT=10000

# App Configuration
VITE_APP_NAME=Expenses Management System
VITE_APP_VERSION=0.1.0
VITE_APP_ENVIRONMENT=development

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_EXPORT_IMPORT=true
VITE_ENABLE_CHARTS=true
```

**Important**: Update `VITE_API_BASE_URL` to point to your actual backend API.

### 4. **Start Development Server**
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🏗️ **Project Structure**

```
src/
├── components/
│   ├── ui/           # shadcn/ui components
│   ├── forms/        # Form components (ExpenseForm)
│   ├── layout/       # Layout components (Header, Sidebar)
│   ├── pages/        # Page components (Dashboard, Expenses)
│   └── expenses/     # Expense-specific components (ExpenseList)
├── hooks/            # Custom React hooks (useExpenses)
├── services/         # API and storage services
├── types/            # TypeScript interfaces
├── constants/        # Application constants
└── utils/            # Utility functions
```

## 🔌 **API Integration**

### **Generic API Service**
The app uses a generic API service (`src/services/api.ts`) that can handle any entity type:

```typescript
// Example usage
const expenses = await api.expenses.getAll();
const newExpense = await api.expenses.saveNew(expenseData);
const updatedExpense = await api.expenses.update({ id, ...data });
await api.expenses.delete(id);

// Generic entity operations
const entityApi = api.entity<CustomType>('custom-entity');
```

### **Standard API Endpoints**
- `GET /{entity}` - Get all items
- `GET /{entity}/{id}` - Get item by ID
- `POST /{entity}` - Create new item
- `PUT /{entity}/{id}` - Update item
- `DELETE /{entity}/{id}` - Delete item
- `PATCH /{entity}/{id}` - Partial update

### **API Configuration**
- **Base URL**: Configurable via environment variables
- **Timeout**: Configurable request timeout
- **Headers**: Automatic JSON content-type handling
- **Error Handling**: Comprehensive error handling and logging

## 📱 **Available Scripts**

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # Run TypeScript type checking
npm run format       # Format code with Prettier
npm run format:check # Check code formatting

# Testing
npm test             # Run tests (when implemented)
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

## 🌐 **Deployment**

### **Vercel (Recommended)**
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### **Netlify**
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Configure environment variables

### **GitHub Pages**
1. Run `npm run build`
2. Push `dist` folder to `gh-pages` branch
3. Enable GitHub Pages in repository settings

## 🔧 **Development Guidelines**

### **Code Style**
- Use TypeScript strict mode
- Follow ESLint and Prettier configurations
- Use functional components with hooks
- Implement proper error handling

### **API Integration**
- Use the generic API service for all backend operations
- Implement proper loading and error states
- Use React Query for caching and state management
- Handle API errors gracefully

### **Component Structure**
- One component per file
- Use PascalCase for component names
- Implement proper prop validation
- Use composition over inheritance

## 🚨 **Troubleshooting**

### **Common Issues**

#### **API Connection Errors**
- Verify `VITE_API_BASE_URL` is correct
- Check if backend service is running
- Verify CORS configuration on backend
- Check network connectivity

#### **Build Errors**
- Ensure all dependencies are installed: `npm install`
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check TypeScript configuration: `npm run type-check`

#### **Runtime Errors**
- Check browser console for error messages
- Verify environment variables are loaded
- Check API endpoint responses

### **Debug Mode**
Enable debug logging by setting:
```env
VITE_APP_ENVIRONMENT=development
```

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests and linting: `npm run lint && npm run type-check`
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **shadcn/ui** for the excellent component library
- **Tailwind CSS** for the utility-first CSS framework
- **React Query** for powerful data fetching and caching
- **Vite** for the fast build tool

---

**Next Milestone**: Phase 1 Iteration 2 - Advanced Features  
**Target Deployment**: Vercel/Netlify Ready with Full API Integration
