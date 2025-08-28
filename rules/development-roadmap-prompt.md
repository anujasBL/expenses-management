# Development Roadmap Generation Prompt

## Core Instructions

### 1. **Bootstrap Phase Requirements**
- **Developer 1 Responsibilities**: 
  - Repository setup and initialization
  - Dependencies installation and configuration
  - CI/CD pipeline setup
  - Base pages and layout implementation
  - Generic API connection initialization using specified endpoints
- **Foundation Elements**: Core project structure, build tools, and development environment

### 2. **Tech Stack Specification**
- **Frontend Framework**: React with TypeScript
- **Build Tools**: Vite for development and builds
- **State Management**: React Query for data fetching and caching
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: shadcn/ui component library
- **Styling**: Tailwind CSS for responsive design
- **Testing**: Jest + React Testing Library + E2E tools
- **CI/CD**: GitHub Actions with automated quality checks

### 3. **Parallel Work Streams**
- **Developer 1**: Bootstrap and foundation (0:00-1:00), then core features
- **Developer 2**: Parallel development of specific features after bootstrap
- **Developer 3**: Parallel development of additional features after bootstrap
- **Tester**: Continuous validation and testing checkpoints

### 4. **Hour-by-Hour Planning**
- **Total Timebox**: 4 hours (0:00-4:00)
- **Detailed Timeline**: Break down each hour with specific tasks
- **Milestone Checkpoints**: Clear deliverables at each hour mark
- **Dependencies**: Task dependencies and critical path identification

### 5. **Roles & Responsibilities Matrix**
- **Developer 1**: Project bootstrap, foundation, and core architecture
- **Developer 2**: Feature development and component implementation
- **Developer 3**: Feature development and integration
- **Tester**: Validation, testing, and quality assurance

### 6. **Testing & Validation Checkpoints**
- **Per Iteration**: Testing checkpoints for every development increment
- **Continuous Validation**: Ongoing testing throughout development
- **Quality Gates**: Automated and manual testing checkpoints
- **User Acceptance**: Validation of user story requirements

### 7. **Deployment Checkpoints**
- **Per Iteration**: Deployable software after each iteration
- **Environment Setup**: Development, staging, and production readiness
- **CI/CD Integration**: Automated deployment pipelines
- **Rollback Strategy**: Deployment failure recovery procedures

## Required Roadmap Sections

### **1. Project Overview**
- **Project Name**: Clear project identification
- **Tech Stack**: Complete technology specification
- **Team Composition**: Developer and tester roles
- **Time Constraint**: 4-hour hackathon timebox

### **2. Bootstrap Phase (Developer 1)**
#### **2.1 Repository Setup**
- Git repository initialization
- Project structure creation
- Base configuration files

#### **2.2 Dependencies & Configuration**
- Package.json setup
- Required libraries installation
- Development tools configuration

#### **2.3 CI/CD Pipeline**
- GitHub Actions workflow
- Automated testing and building
- Quality gate integration

#### **2.4 Base Architecture**
- Project layout and routing
- Base pages and components
- Generic API service layer

### **3. Development Iterations**
#### **3.1 Iteration 1: Foundation (0:00-1:00)**
- **Developer 1 Tasks**: Bootstrap and core setup
- **Deliverables**: Working project foundation
- **Testing Checkpoint**: Basic functionality validation
- **Deployment**: Initial deployable version

#### **3.2 Iteration 2: Core Features (1:00-2:30)**
- **Developer 1 Tasks**: Core feature implementation
- **Developer 2 Tasks**: Parallel feature development
- **Developer 3 Tasks**: Parallel feature development
- **Deliverables**: Core MVP functionality
- **Testing Checkpoint**: Feature validation
- **Deployment**: Core features deployment

#### **3.3 Iteration 3: Enhancement (2:30-4:00)**
- **All Developers**: Feature completion and integration
- **Tester**: Comprehensive testing and validation
- **Deliverables**: Complete MVP with all features
- **Testing Checkpoint**: Full system validation
- **Deployment**: Final production deployment

### **4. Hour-by-Hour Timeline**
#### **Hour 0:00-1:00**
- **Developer 1**: Project bootstrap and foundation
- **Developer 2**: Preparation and planning
- **Developer 3**: Preparation and planning
- **Tester**: Test plan preparation

#### **Hour 1:00-2:00**
- **Developer 1**: Core feature implementation
- **Developer 2**: Feature development start
- **Developer 3**: Feature development start
- **Tester**: Initial testing and validation

#### **Hour 2:00-3:00**
- **Developer 1**: Feature completion and integration
- **Developer 2**: Feature completion
- **Developer 3**: Feature completion
- **Tester**: Comprehensive testing

#### **Hour 3:00-4:00**
- **All Developers**: Final integration and bug fixes
- **Tester**: Final validation and acceptance testing
- **Deployment**: Production deployment and verification

### **5. Task Assignments**
#### **Developer 1 (Bootstrap Lead)**
- Repository and project setup
- Dependencies and configuration
- CI/CD pipeline implementation
- Base architecture and routing
- Generic API service layer
- Core feature implementation

#### **Developer 2 (Feature Developer)**
- Specific feature implementation
- Component development
- State management integration
- API integration for features
- Testing and validation support

#### **Developer 3 (Feature Developer)**
- Additional feature implementation
- Component development
- State management integration
- API integration for features
- Testing and validation support

#### **Tester (Quality Assurance)**
- Test plan development
- Continuous validation
- Feature testing checkpoints
- User acceptance testing
- Deployment verification

## Technical Implementation Details

### **Required Libraries**
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "@tanstack/react-query": "^5.0.0",
    "react-hook-form": "^7.45.0",
    "@hookform/resolvers": "^3.3.0",
    "zod": "^3.22.0",
    "tailwindcss": "^3.3.0",
    "lucide-react": "^0.263.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "jest": "^29.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0"
  }
}
```

### **Generic API Endpoints**
- **GET_ALL**: `/{entity}` - Retrieve all entities
- **GET_BY_ID**: `/{entity}/{item_id}` - Retrieve specific entity
- **SAVE_NEW**: `/{entity}` - Create new entity
- **UPDATE**: `/{entity}/{item_id}` - Update existing entity
- **DELETE**: `/{entity}/{item_id}` - Delete entity

## Quality Standards

### **Roadmap Quality Checklist**
- [ ] Bootstrap phase is clearly defined with Developer 1 responsibilities
- [ ] Tech stack is completely specified with versions
- [ ] Parallel work streams are identified and planned
- [ ] Hour-by-hour timeline is detailed and realistic
- [ ] Roles and responsibilities are clearly defined
- [ ] Testing checkpoints are specified for every iteration
- [ ] Deployment checkpoints are included per iteration
- [ ] Dependencies and risks are identified and documented

### **Cursor AI Compatibility Checklist**
- [ ] Roadmap serves as blueprint for coding prompts
- [ ] Technical specifications are detailed enough for implementation
- [ ] Task assignments are clear and actionable
- [ ] Dependencies are clearly identified
- [ ] Timeline is realistic and achievable

## Output Format Requirements

### **Markdown File Structure** (`development-roadmap.md`)

```markdown
# Development Roadmap

## 1. Project Overview
### 1.1 Project Name
### 1.2 Tech Stack
### 1.3 Team Composition
### 1.4 Time Constraint

## 2. Bootstrap Phase (Developer 1)
### 2.1 Repository Setup
### 2.2 Dependencies & Configuration
### 2.3 CI/CD Pipeline
### 2.4 Base Architecture

## 3. Development Iterations
### 3.1 Iteration 1: Foundation (0:00-1:00)
### 3.2 Iteration 2: Core Features (1:00-2:30)
### 3.3 Iteration 3: Enhancement (2:30-4:00)

## 4. Hour-by-Hour Timeline
### 4.1 Hour 0:00-1:00
### 4.2 Hour 1:00-2:00
### 4.3 Hour 2:00-3:00
### 4.4 Hour 3:00-4:00

## 5. Task Assignments
### 5.1 Developer 1 (Bootstrap Lead)
### 5.2 Developer 2 (Feature Developer)
### 5.3 Developer 3 (Feature Developer)
### 5.4 Tester (Quality Assurance)

## 6. Testing & Validation
### 6.1 Test Plan
### 6.2 Validation Checkpoints
### 6.3 Quality Gates

## 7. Deployment Strategy
### 7.1 Environment Setup
### 7.2 CI/CD Integration
### 7.3 Deployment Checkpoints

## 8. Dependencies & Risks
### 8.1 Technical Dependencies
### 8.2 Team Dependencies
### 8.3 Risk Mitigation
```

## Example Task Assignment Format

### **Developer 1 Bootstrap Tasks**
```markdown
#### 2.1 Repository Setup
- [ ] Initialize Git repository
- [ ] Create project structure
- [ ] Set up base configuration files
- [ ] Configure .gitignore and .nvmrc

#### 2.2 Dependencies & Configuration
- [ ] Initialize package.json
- [ ] Install React + TypeScript dependencies
- [ ] Configure Vite build tool
- [ ] Set up Tailwind CSS
- [ ] Install shadcn/ui components
```

### **Testing Checkpoint Format**
```markdown
#### 6.2 Validation Checkpoints

**Iteration 1 Checkpoint (1:00)**
- [ ] Project builds successfully
- [ ] Basic routing works
- [ ] Generic API service connects
- [ ] Base layout renders correctly

**Iteration 2 Checkpoint (2:30)**
- [ ] Core features function properly
- [ ] API integration works
- [ ] State management functions
- [ ] Components render correctly
```

## Success Metrics

### **Roadmap Completeness**
- All phases and iterations are clearly defined
- Bootstrap phase is comprehensive and actionable
- Parallel work streams are properly planned
- Timeline is realistic and achievable

### **Team Coordination**
- Roles and responsibilities are clearly defined
- Dependencies between team members are identified
- Testing and deployment checkpoints are scheduled
- Risk mitigation strategies are in place

### **Cursor AI Readiness**
- Technical specifications are detailed enough for implementation
- Task assignments are clear and actionable
- Dependencies and constraints are documented
- Roadmap serves as effective blueprint for coding

## Notes

- **Keep it Realistic**: Ensure 4-hour timebox is achievable
- **Focus on Bootstrap**: Developer 1 foundation is critical for success
- **Plan for Parallelism**: Maximize team productivity with parallel work
- **Test Early and Often**: Include testing checkpoints throughout development
- **Deploy Incrementally**: Each iteration should result in deployable software
- **Document Dependencies**: Clearly identify blockers and dependencies
- **Prepare for AI**: Ensure roadmap is detailed enough for Cursor AI consumption
