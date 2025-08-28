# Development Prompt Rules

This folder contains comprehensive prompt instructions for different aspects of MVP development. Each file focuses on a specific area to provide clear, focused guidance.

## 📁 **Available Prompt Rules**

### **1. MVP Coding Prompt** (`mvp-coding-prompt.md`)
**Purpose**: Generate deployable, production-ready React codebases
**Use When**: 
- Creating new MVP applications
- Implementing specific MVP phases
- Building React + TypeScript applications
- Setting up API integration layers

**Key Requirements**:
- Library integration and configuration
- API integration with generic service layer
- Code quality standards and tooling
- Deployment readiness and CI/CD setup

### **2. Testing Suite Prompt** (`testing-suite-prompt.md`)
**Purpose**: Produce comprehensive testing suites with ≥90% coverage
**Use When**:
- Implementing testing strategies
- Setting up Jest + React Testing Library
- Creating E2E tests with Playwright/Cypress
- Implementing mocking strategies

**Key Requirements**:
- Unit, Integration, and E2E test coverage
- External service mocking (Stripe, SendGrid, Cloudinary)
- Test execution commands and CI integration
- Mocking strategy and fixtures guidance

### **3. Pre-Push Quality Gate Prompt** (`pre-push-quality-gate-prompt.md`)
**Purpose**: Execute quality checks before git operations
**Use When**:
- Enforcing code quality standards
- Preventing broken builds from reaching main
- Setting up automated quality gates
- Ensuring consistent code quality

**Key Requirements**:
- Sequential quality gate execution
- Code formatting, type checking, and linting
- Test coverage and production build verification
- Git integration and reporting

## 🎯 **How to Use These Rules**

### **For Complete MVP Development**
1. Start with **MVP Coding Prompt** for core application
2. Add **Testing Suite Prompt** for comprehensive testing
3. Implement **Pre-Push Quality Gate Prompt** for quality enforcement

### **For Specific Tasks**
- **New Feature**: Use MVP Coding Prompt + Testing Suite Prompt
- **Testing Implementation**: Use Testing Suite Prompt only
- **Quality Enforcement**: Use Pre-Push Quality Gate Prompt only
- **Code Review**: Use Pre-Push Quality Gate Prompt for validation

### **Integration Points**
- All prompts are designed to work together
- Shared technical standards and requirements
- Consistent output formats and documentation
- Complementary quality assurance approaches

## 🔧 **Technical Standards**

### **Common Requirements Across All Prompts**
- **Node.js**: 18.18.0+ compatibility (22.x for quality gates)
- **React**: 18+ with TypeScript 5.0+
- **Build Tools**: Vite for fast development and builds
- **Code Quality**: ESLint, Prettier, TypeScript strict mode
- **Testing**: Jest + React Testing Library + E2E tools
- **CI/CD**: GitHub Actions with automated quality checks

### **Output Format Consistency**
- **Repository-style Markdown** responses
- **Per-file code blocks** for critical files
- **Comprehensive documentation** for each area
- **CI/CD integration** examples and workflows

## 📊 **Quality Assurance Matrix**

| Aspect | MVP Coding | Testing Suite | Quality Gates |
|--------|------------|---------------|---------------|
| Code Quality | ✅ | ✅ | ✅ |
| Testing Coverage | ⚠️ | ✅ | ✅ |
| API Integration | ✅ | ⚠️ | ⚠️ |
| Quality Enforcement | ⚠️ | ⚠️ | ✅ |
| Documentation | ✅ | ✅ | ✅ |
| CI/CD Setup | ✅ | ✅ | ✅ |

## 🚀 **Best Practices**

### **1. Use the Right Prompt for the Job**
- Don't use MVP Coding Prompt for testing-only tasks
- Don't use Quality Gate Prompt for new development
- Combine prompts appropriately for comprehensive solutions

### **2. Follow the Sequential Order**
- Quality gates must run in specified order
- Testing should be implemented before quality gates
- MVP development should include testing from the start

### **3. Maintain Consistency**
- Use the same technical standards across all areas
- Follow consistent naming conventions
- Implement consistent error handling patterns

### **4. Document Everything**
- Each prompt requires comprehensive documentation
- Include examples and implementation patterns
- Provide troubleshooting and troubleshooting guidance

## 📝 **Example Usage Scenarios**

### **Scenario 1: New MVP Development**
```bash
# Use MVP Coding Prompt for core application
# Then add Testing Suite Prompt for testing
# Finally implement Quality Gate Prompt for enforcement
```

### **Scenario 2: Testing Implementation Only**
```bash
# Use Testing Suite Prompt directly
# Focus on test coverage and mocking strategies
# Ensure CI integration for automated testing
```

### **Scenario 3: Quality Enforcement Setup**
```bash
# Use Quality Gate Prompt for existing codebase
# Implement automated quality checks
# Set up pre-push hooks and CI integration
```

## 🔗 **Related Documentation**

- **Software Requirements Specification**: Defines MVP requirements
- **Development Roadmap**: Outlines MVP phases and iterations
- **Project Structure**: Shows file organization and architecture
- **CI/CD Pipeline**: Details automated quality and deployment

---

**Remember**: These prompts are designed to work together to deliver high-quality, well-tested, and maintainable MVP applications. Choose the right combination based on your specific needs.
