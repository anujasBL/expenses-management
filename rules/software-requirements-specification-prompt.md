# Software Requirements Specification (SRS) Generation Prompt

## Core Instructions

### 1. **IEEE 830 Standards Compliance**
- **Strict Adherence**: Follow IEEE 830 standard structure and format
- **Scope Definition**: Use selected user stories as the sole scope boundary
- **Requirements Quality**: All requirements must be SMART (Specific, Measurable, Achievable, Relevant, Testable)
- **Traceability**: Link requirements back to user stories

### 2. **MVP Development Plan Requirements**
- **Iteration Structure**: Each iteration must specify:
  - Functional Requirements
  - Technical Implementation Notes
  - Deliverables
  - Acceptance Criteria
- **Deployable Increments**: Each iteration must result in deployable software
- **Progressive Enhancement**: Build upon previous iterations

### 3. **Cursor AI Code Generation Readiness**
- **Complete Specifications**: All requirements must be detailed enough for AI code generation
- **Technical Clarity**: Clear technical implementation guidance
- **Library Specifications**: Include required libraries suitable for the tech stack
- **API Integration**: Specify generic API endpoint usage

### 4. **Generic API Integration Requirements**
The React frontend must use a pre-created generic API with the following endpoints for any entity:
- **GET_ALL**: `/{entity}`
- **GET_BY_ID**: `/{entity}/{item_id}`
- **SAVE_NEW**: `/{entity}`
- **UPDATE**: `/{entity}/{item_id}`
- **DELETE**: `/{entity}/{item_id}`

## Required SRS Sections

### **1. Introduction**
- **Purpose**: Clear statement of software system purpose
- **Scope**: Defined by selected user stories
- **Definitions**: Technical terms and acronyms
- **References**: Standards, documents, and specifications

### **2. Overall Description**
- **Product Perspective**: System context and relationships
- **Product Functions**: High-level functional overview
- **User Classes**: Target user categories
- **Operating Environment**: Technical constraints and platforms
- **Design Constraints**: Limitations and assumptions

### **3. Specific Requirements**
#### **3.1 Functional Requirements**
- **User Story Mapping**: Direct linkage to user stories
- **Error Handling**: Comprehensive error handling specifications
- **Input/Output**: Data flow and processing requirements
- **Business Logic**: Core application functionality
- **API Integration**: Generic endpoint usage patterns

#### **3.2 Non-Functional Requirements**
- **Performance**: Response times and throughput
- **Security**: Authentication and authorization
- **Usability**: User interface and experience
- **Reliability**: Availability and fault tolerance
- **Maintainability**: Code quality and documentation

### **4. MVP Development Plan**
#### **Iteration Structure for Each Phase**
- **Functional Requirements**: Specific features for the iteration
- **Technical Implementation Notes**: Implementation guidance and approach
- **Deliverables**: Concrete outputs and artifacts
- **Acceptance Criteria**: Testable success criteria

## Technical Implementation Requirements

### **Library Integration**
- **Frontend Framework**: React with TypeScript
- **State Management**: React Query for data fetching and caching
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: shadcn/ui component library
- **Styling**: Tailwind CSS for responsive design
- **Build Tools**: Vite for fast development and builds

### **API Service Layer**
- **Generic Entity Service**: Reusable service for any entity type
- **Endpoint Mapping**: Consistent use of generic API endpoints
- **Error Handling**: Comprehensive error handling and user feedback
- **Data Validation**: Input validation and sanitization
- **Response Processing**: Consistent data transformation

### **Code Generation Readiness**
- **Component Specifications**: Detailed component requirements
- **State Management**: Clear state structure and flow
- **Event Handling**: User interaction specifications
- **Data Models**: TypeScript interface definitions
- **Validation Rules**: Form and data validation requirements

## Quality Standards

### **Requirements Quality Checklist**
- [ ] Each requirement is SMART (Specific, Measurable, Achievable, Relevant, Testable)
- [ ] Requirements are traceable to user stories
- [ ] Technical specifications are clear enough for AI code generation
- [ ] Error handling is comprehensively specified
- [ ] API integration patterns are clearly defined
- [ ] Iteration plan includes all required elements

### **IEEE 830 Compliance Checklist**
- [ ] Document structure follows IEEE 830 standard
- [ ] All required sections are present and complete
- [ ] Requirements are properly categorized and numbered
- [ ] Definitions and references are comprehensive
- [ ] Scope is clearly defined and bounded

### **MVP Development Checklist**
- [ ] Each iteration is deployable
- [ ] Functional requirements are clearly specified
- **Technical implementation notes provide clear guidance
- [ ] Deliverables are concrete and measurable
- [ ] Acceptance criteria are testable
- [ ] Dependencies between iterations are identified

## Output Format Requirements

### **Markdown File Structure** (`software-requirements-specification.md`)

```markdown
# Software Requirements Specification

## 1. Introduction
### 1.1 Purpose
### 1.2 Scope
### 1.3 Definitions
### 1.4 References

## 2. Overall Description
### 2.1 Product Perspective
### 2.2 Product Functions
### 2.3 User Classes
### 2.4 Operating Environment
### 2.5 Design Constraints

## 3. Specific Requirements
### 3.1 Functional Requirements
#### 3.1.1 User Authentication
#### 3.1.2 Data Management
#### 3.1.3 User Interface
#### 3.1.4 Error Handling

### 3.2 Non-Functional Requirements
#### 3.2.1 Performance
#### 3.2.2 Security
#### 3.2.3 Usability
#### 3.2.4 Reliability

## 4. MVP Development Plan
### 4.1 Iteration 1: Foundation
#### 4.1.1 Functional Requirements
#### 4.1.2 Technical Implementation Notes
#### 4.1.3 Deliverables
#### 4.1.4 Acceptance Criteria

### 4.2 Iteration 2: Core Features
#### 4.2.1 Functional Requirements
#### 4.2.2 Technical Implementation Notes
#### 4.2.3 Deliverables
#### 4.2.4 Acceptance Criteria

### 4.3 Iteration 3: Enhancement
#### 4.3.1 Functional Requirements
#### 4.3.2 Technical Implementation Notes
#### 4.3.3 Deliverables
#### 4.3.4 Acceptance Criteria
```

## Example Requirements Format

### **Functional Requirement Example**
```markdown
#### 3.1.1 User Authentication

**FR-001**: User Registration
- **Description**: Users must be able to create new accounts
- **User Story**: As a new user, I want to register so that I can access the system
- **Input**: Email, password, confirm password
- **Processing**: Validate input, check email uniqueness, hash password
- **Output**: Success message or validation errors
- **Error Handling**: 
  - Email already exists: Show "Email already registered"
  - Password mismatch: Show "Passwords do not match"
  - Invalid email format: Show "Invalid email format"
- **API Endpoint**: POST /auth/register
- **Acceptance Criteria**: 
  - [ ] User can enter valid registration data
  - [ ] System validates all input fields
  - [ ] System creates user account
  - [ ] User receives confirmation
```

### **Technical Implementation Note Example**
```markdown
#### 4.1.2 Technical Implementation Notes

**Authentication Service**
- Use React Hook Form for form handling
- Implement Zod validation schema for input validation
- Use React Query for API calls with proper error handling
- Store JWT token in localStorage with expiration handling
- Implement protected route wrapper for authenticated pages

**Required Libraries**
- `react-hook-form`: Form state management
- `@hookform/resolvers`: Zod integration
- `zod`: Schema validation
- `@tanstack/react-query`: API state management
- `axios`: HTTP client for API calls
```

## Success Metrics

### **Document Quality**
- Complete IEEE 830 compliance
- Clear and actionable requirements
- Comprehensive technical specifications
- Traceable to user stories

### **Code Generation Readiness**
- Detailed component specifications
- Clear API integration patterns
- Comprehensive error handling
- Complete technical implementation notes

### **MVP Development Readiness**
- Clear iteration structure
- Deployable increments
- Testable acceptance criteria
- Realistic implementation timeline

## Notes

- **Keep Requirements SMART**: Each requirement must be Specific, Measurable, Achievable, Relevant, and Testable
- **Focus on User Stories**: All requirements must trace back to selected user stories
- **Technical Clarity**: Provide enough detail for AI code generation
- **Error Handling**: Specify comprehensive error scenarios and user feedback
- **API Consistency**: Use generic API endpoints consistently across all entities
- **Iteration Planning**: Ensure each iteration builds upon the previous one
- **Deployment Readiness**: Each iteration must result in deployable software
