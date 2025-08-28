# Expenses Management System

A modern, responsive web application for tracking and managing personal and business expenses. Built with React, TypeScript, Tailwind CSS, and shadcn/ui components.

## 🚀 Features

- **Expense Tracking**: Add, view, edit, and delete expense records
- **Category Management**: Predefined expense categories with visual identification
- **Data Persistence**: Local storage with IndexedDB fallback
- **Responsive Design**: Mobile-first approach with cross-device compatibility
- **Analytics Dashboard**: Spending summaries and category breakdowns
- **Data Export/Import**: Backup and restore functionality
- **Modern UI**: Clean, accessible interface built with shadcn/ui

## 🛠️ Technology Stack

- **Frontend**: React 18.2+, TypeScript 5.0+
- **Styling**: Tailwind CSS 3.3+, shadcn/ui components
- **Form Handling**: React Hook Form 7.45+, Zod 3.22+
- **State Management**: React Query 5.0+ (for patterns), localStorage
- **Charts**: Recharts 2.8+
- **Icons**: Lucide React 0.263+
- **Build Tool**: Vite 5.0+

## 📋 Prerequisites

- Node.js 18.18.0 or higher
- npm 9.0.0 or higher
- Modern web browser with JavaScript enabled

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd expenses-management-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the environment template and configure your settings:

```bash
cp env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000
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

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 5. Build for Production

```bash
npm run build
```

### 6. Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/            # Reusable UI components (shadcn/ui)
│   ├── forms/         # Form components
│   ├── layout/        # Layout components
│   └── pages/         # Page components
├── hooks/             # Custom React hooks
├── lib/               # Utility functions and configurations
├── services/          # API and storage services
├── types/             # TypeScript type definitions
├── utils/             # Helper functions
└── constants/         # Application constants
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

## 🎯 Development Phases

### Phase 0: Bootstrap & Setup ✅
- Project initialization and foundation setup
- Basic layout and navigation components
- Generic API service layer
- Local storage implementation

### Phase 1: Core Development (Planned)
- Expense management functionality
- Category system implementation
- Basic analytics and reporting

### Phase 2: Enhancement (Planned)
- Advanced features and optimizations
- User experience improvements
- Performance optimizations

### Phase 3: Deployment (Planned)
- Final testing and validation
- Production deployment
- Documentation and handover

## 🚀 Deployment

### Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

### Netlify

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to Netlify

### GitHub Pages

1. Build the project:
```bash
npm run build
```

2. Push the `dist` folder to the `gh-pages` branch

## 🔌 API Integration

The application includes a generic API service layer that implements standard CRUD endpoints:

- `GET /{entity}` - Retrieve all entities
- `GET /{entity}/{id}` - Retrieve entity by ID
- `POST /{entity}` - Create new entity
- `PUT /{entity}/{id}` - Update entity
- `DELETE /{entity}/{id}` - Delete entity

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🧪 Testing

Run the test suite:

```bash
npm test
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review the code examples

## 🎉 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Vite](https://vitejs.dev/) for the fast build tool
- [React](https://reactjs.org/) for the amazing frontend framework

---

**Built with ❤️ for the hackathon community**
