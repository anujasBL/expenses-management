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

### **4. User Stories Prompt** (`user-stories-prompt.md`)
**Purpose**: Generate comprehensive user stories for hackathon projects
**Use When**:
- Planning MVP development phases
- Creating user story documents
- Organizing team work distribution
- Planning hackathon iterations

**Key Requirements**:
- 4-hour timebox constraint management
- MVP-focused, testable deliverables
- Team distribution across 3 developers + 1 tester
- Parallelization opportunities identification

### **5. Software Requirements Specification Prompt** (`software-requirements-specification-prompt.md`)
**Purpose**: Generate IEEE 830-aligned SRS documents with MVP development plans
**Use When**:
- Creating formal software requirements documents
- Planning technical implementation details
- Preparing specifications for AI code generation
- Defining comprehensive MVP development roadmaps

**Key Requirements**:
- IEEE 830 standards compliance
- SMART requirements (Specific, Measurable, Achievable, Relevant, Testable)
- Generic API integration specifications
- Detailed MVP development iterations
- Cursor AI code generation readiness

### **6. Development Roadmap Prompt** (`development-roadmap-prompt.md`)
**Purpose**: Generate comprehensive development roadmaps with hour-by-hour planning and team coordination
**Use When**:
- Planning hackathon projects with strict time constraints
- Coordinating team development across multiple developers
- Creating detailed implementation blueprints
- Setting up bootstrap phases and parallel work streams

**Key Requirements**:
- 4-hour timebox planning with hour-by-hour breakdown
- Bootstrap phase for Developer 1 with explicit responsibilities
- Parallel work streams for multiple developers
- Testing and deployment checkpoints per iteration
- Cursor AI compatibility for coding prompts

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

| Aspect | MVP Coding | Testing Suite | Quality Gates | User Stories | SRS | Development Roadmap |
|--------|------------|---------------|---------------|--------------|-----|-------------------|
| Code Quality | ✅ | ✅ | ✅ | ⚠️ | ⚠️ | ⚠️ |
| Testing Coverage | ⚠️ | ✅ | ✅ | ⚠️ | ⚠️ | ⚠️ |
| API Integration | ✅ | ⚠️ | ⚠️ | ⚠️ | ✅ | ✅ |
| Quality Enforcement | ⚠️ | ⚠️ | ✅ | ⚠️ | ⚠️ | ⚠️ |
| Documentation | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| CI/CD Setup | ✅ | ✅ | ✅ | ⚠️ | ⚠️ | ✅ |
| Project Planning | ⚠️ | ⚠️ | ⚠️ | ✅ | ✅ | ✅ |
| Requirements Engineering | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ✅ | ⚠️ |
| Team Coordination | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ✅ |

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
# Use User Stories Prompt for planning
# Use Development Roadmap Prompt for team coordination and timeline
# Use SRS Prompt for detailed requirements and technical specifications
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

### **Scenario 4: Requirements Engineering and Planning**
```bash
# Use User Stories Prompt for high-level planning
# Use SRS Prompt for detailed technical specifications
# Ensure IEEE 830 compliance and SMART requirements
# Prepare for AI code generation
```

### **Scenario 5: Hackathon Team Coordination**
```bash
# Use Development Roadmap Prompt for team planning
# Coordinate multiple developers with parallel work streams
# Set up bootstrap phase and testing checkpoints
# Ensure 4-hour timebox compliance
```

## 🔗 **Related Documentation**

- **Software Requirements Specification**: Defines MVP requirements
- **Development Roadmap**: Outlines MVP phases and iterations
- **Project Structure**: Shows file organization and architecture
- **CI/CD Pipeline**: Details automated quality and deployment

---

**Remember**: These prompts are designed to work together to deliver high-quality, well-tested, and maintainable MVP applications. Choose the right combination based on your specific needs.
