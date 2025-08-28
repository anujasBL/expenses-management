# MVP Coding Prompt Instructions

## 🎯 **Primary Objective**
Generate a deployable, production-ready React codebase implementing the specified MVP phase exactly as defined by the software requirements specification and aligned with the development roadmap.

## 🚀 **Target Deployment**
Static host or Vercel (frontend only) with full API integration readiness.

## 📋 **Core Requirements**

### **1. Library Integration**
- Include any required libraries that are suitable for the given tech stack
- Ensure compatibility with React 18+, TypeScript 5.0+, and modern tooling
- Integrate specified SDKs when mentioned (React Query, React Hook Form, Stripe SDK, SendGrid, Cloudinary SDK)

### **2. Configuration & Tooling**
- **Node Version**: Include `.nvmrc` file with appropriate Node.js version
- **Environment**: Provide `.env.example` with all required environment variables
- **Code Quality**: ESLint configuration for code linting
- **Code Formatting**: Prettier configuration for consistent formatting
- **TypeScript**: `tsconfig.json` with strict mode enabled
- **Build Tools**: Vite configuration for fast development and builds

### **3. API Integration**
- **Generic API Service**: Implement generic API endpoints for all backend data operations
- **Entity Structure**: Clearly structured for any entity type (expenses, users, categories, etc.)
- **Standard Endpoints**: GET_ALL, GET_BY_ID, SAVE_NEW, UPDATE, DELETE operations
- **Error Handling**: Comprehensive error handling and user feedback
- **Loading States**: Proper loading states for all API operations

### **4. Code Quality Standards**
- **TypeScript**: Clean, maintainable TypeScript with comprehensive type definitions
- **Comments**: Include JSDoc comments for complex functions and components
- **Linting**: Resolve all ESLint issues and pass type checks
- **Build Success**: Ensure `npm run build` succeeds without errors
- **Deployment Ready**: Code must deploy successfully to target platform

### **5. Development Workflow**
- **Branching Strategy**: Use feature branches + PRs per MVP iteration
- **Git Workflow**: Implement proper commit conventions and branching patterns
- **Code Review**: Structure code for easy review and collaboration

## 📁 **Output Format Requirements**

### **Repository-Style Markdown Response Including:**

#### **1. Top-Level File Tree**
```
project-root/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── types/
│   └── ...
├── public/
├── config files
└── documentation
```

#### **2. Per-File Code Blocks**
- Include complete, runnable code for all critical files
- Focus on components, hooks, services, and configuration files
- Ensure code is properly formatted and commented
- Include TypeScript interfaces and type definitions

#### **3. README.md**
- **Setup Instructions**: Step-by-step installation and configuration
- **Development**: Local development server setup
- **Testing**: How to run tests and quality checks
- **Deployment**: Deployment steps for target platforms
- **API Configuration**: Environment variables and backend setup
- **Troubleshooting**: Common issues and solutions

#### **4. CI/CD Pipeline**
- **GitHub Actions**: Complete workflow for build/test/lint
- **Build Process**: Automated build and testing pipeline
- **Quality Gates**: Linting, type checking, and build verification
- **Deployment**: Automated deployment to staging/production

#### **5. Deployment Notes**
- **Platform-Specific**: Instructions for Vercel, Netlify, GitHub Pages
- **Environment Variables**: Required configuration for production
- **Build Commands**: Proper build and deployment commands
- **Domain Configuration**: Custom domain setup if applicable

## 🔧 **Technical Standards**

### **React & TypeScript**
- Use functional components with hooks
- Implement proper TypeScript interfaces
- Use React 18+ patterns and best practices
- Implement proper error boundaries

### **State Management**
- Use React Query for server state management
- Implement proper loading and error states
- Use local state for UI-specific state
- Implement optimistic updates where appropriate

### **API Layer**
- Generic service layer for all entities
- Proper error handling and retry logic
- Request/response type safety
- Environment-based configuration

### **UI/UX**
- Responsive design with mobile-first approach
- Accessible components with proper ARIA labels
- Consistent styling with design system
- Loading states and error feedback

## 📊 **Quality Assurance**

### **Pre-Build Checks**
- ✅ All TypeScript errors resolved
- ✅ ESLint passes without warnings
- ✅ Prettier formatting applied
- ✅ All imports resolved correctly

### **Build Verification**
- ✅ `npm run build` succeeds
- ✅ No build warnings or errors
- ✅ All assets generated correctly
- ✅ Bundle size optimized

### **Deployment Validation**
- ✅ Application deploys successfully
- ✅ Environment variables configured
- ✅ API endpoints accessible
- ✅ Application functions correctly

## 🎯 **Success Criteria**

1. **Code Quality**: Clean, maintainable, well-documented code
2. **Functionality**: All specified features implemented and working
3. **Integration**: Full API integration with generic service layer
4. **Deployment**: Successfully deploys to target platform
5. **Documentation**: Comprehensive setup and deployment instructions
6. **CI/CD**: Automated quality checks and deployment pipeline

## 📝 **Example Implementation Pattern**

```typescript
// Generic API service structure
export const api = {
  entity: <T extends BaseEntity>(entityName: string) => ({
    getAll: (params?: QueryParams) => apiService.getAll<T>(entityName, params),
    getById: (id: string) => apiService.getById<T>(entityName, id),
    saveNew: (data: Partial<T>) => apiService.saveNew<T>(entityName, data),
    update: (data: Partial<T> & { id: string }) => apiService.update<T>(entityName, data),
    delete: (id: string) => apiService.delete(entityName, id),
  }),
  
  // Specific entity APIs
  expenses: entity<Expense>('expenses'),
  categories: entity<Category>('categories'),
  users: entity<User>('users'),
};
```

## 🚀 **Final Deliverable**

A complete, production-ready React application that:
- Implements all specified MVP features
- Integrates with backend APIs via generic service layer
- Deploys successfully to target platform
- Includes comprehensive documentation and CI/CD setup
- Follows best practices for code quality and maintainability

---

**Remember**: Focus on delivering a working, deployable MVP that demonstrates the core functionality while maintaining high code quality standards.
