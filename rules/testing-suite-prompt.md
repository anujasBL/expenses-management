# Testing Suite Prompt Instructions

## 🧪 **Primary Objective**

Produce comprehensive testing suite covering Unit Tests, Integration Tests, and E2E Tests with ≥90% functional coverage and proper mocking strategies.

## 📋 **Core Testing Requirements**

### **1. Test Coverage & Types**

- **Unit Tests**: Jest + React Testing Library for component and utility testing
- **Integration Tests**: Component interaction and data flow testing
- **E2E Tests**: Playwright or Cypress for end-to-end user workflows
- **Coverage Target**: Aim for ≥80% functional coverage
- **Test Data**: Use realistic test data fixtures and mocks

### **2. External Service Mocking**

- **Stripe**: Mock payment processing and webhook handling
- **SendGrid**: Mock email sending and delivery confirmation
- **Cloudinary**: Mock image upload and transformation services
- **API Services**: Mock external API calls and responses
- **Authentication**: Mock auth providers and token validation

### **3. Test Execution**

- **Single Command**: Provide one command to run all tests with coverage
- **Individual Suites**: Separate commands for unit, integration, and E2E tests
- **CI Integration**: Include guidance for continuous integration execution
- **Parallel Execution**: Optimize test suite for CI/CD pipeline performance

### **4. Test Infrastructure**

- **Test Environment**: Proper test environment configuration
- **Mock Strategy**: Comprehensive mocking strategy documentation
- **Fixtures**: Realistic test data fixtures for all entity types
- **Setup/Teardown**: Proper test isolation and cleanup procedures

## 📁 **Output Format Requirements**

### **Testing Suite Documentation (testing-suite.md) Including:**

#### **1. Test Plan & Scope**

- **User Stories Mapping**: Map tests to specific user story requirements
- **SRS Requirements**: Align test coverage with software requirements
- **Test Categories**: Unit, Integration, and E2E test breakdown
- **Coverage Goals**: Specific coverage targets per component/module

#### **2. Directory Structure**

```
tests/
├── unit/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── utils/
├── integration/
│   ├── component-interactions/
│   ├── data-flow/
│   └── api-integration/
├── e2e/
│   ├── user-workflows/
│   ├── critical-paths/
└── fixtures/
    ├── mock-data/
    ├── test-users/
    └── api-responses/
```

#### **3. Sample Test Specifications**

- **Unit Test Examples**: Component testing with React Testing Library
- **Integration Test Examples**: Component interaction testing
- **E2E Test Examples**: User workflow testing
- **Mock Examples**: External service mocking patterns

#### **4. Test Commands**

- **All Tests**: `npm run test:coverage` - Run complete test suite
- **Unit Tests**: `npm run test:unit` - Run unit tests only
- **Integration Tests**: `npm run test:integration` - Run integration tests
- **E2E Tests**: `npm run test:e2e` - Run end-to-end tests
- **Coverage Report**: `npm run test:coverage:report` - Generate coverage report

#### **5. CI Integration Notes**

- **GitHub Actions**: Test execution in CI pipeline
- **Parallel Execution**: Optimize test suite for CI performance
- **Coverage Reporting**: CI coverage reporting and thresholds
- **Test Artifacts**: Test results and coverage reports in CI

#### **6. Mocking Strategy & Fixtures**

- **Mock Strategy**: Comprehensive approach to mocking external dependencies
- **Fixture Guidelines**: Creating realistic test data
- **Mock Examples**: Stripe, SendGrid, Cloudinary, and API mocking
- **Test Data Management**: Organizing and maintaining test fixtures

## 🔧 **Technical Standards**

### **Testing Standards**

- **Unit Tests**: Test individual components and functions in isolation
- **Integration Tests**: Test component interactions and data flow
- **E2E Tests**: Test complete user workflows and critical paths
- **Mock Strategy**: Comprehensive mocking of external dependencies
- **Test Data**: Realistic fixtures that represent production scenarios

### **Test Framework Requirements**

- **Jest**: Primary testing framework with proper configuration
- **React Testing Library**: Component testing with user-centric approach
- **Playwright/Cypress**: E2E testing for user workflows
- **Coverage Tools**: Istanbul/nyc for coverage reporting
- **Mock Libraries**: Jest mocks, MSW, or similar for API mocking

### **Test Quality Standards**

- **Test Isolation**: Each test must run independently
- **Deterministic Results**: Tests must produce consistent results
- **Fast Execution**: Optimize test suite for developer workflow
- **Maintainable Tests**: Clear, readable test code with proper structure

## 📊 **Quality Assurance**

### **Test Coverage Verification**

- ✅ All unit tests pass
- ✅ Integration tests pass
- ✅ E2E tests pass
- ✅ Coverage meets ≥90% target
- ✅ Mock strategy properly implemented

### **Test Execution Verification**

- ✅ Single command runs all tests
- ✅ Individual test suites work independently
- ✅ CI integration functions correctly
- ✅ Coverage reporting works properly

## 🎯 **Success Criteria**

1. **Comprehensive Coverage**: ≥90% functional test coverage
2. **Test Types**: Unit, Integration, and E2E tests implemented
3. **Mock Strategy**: External services properly mocked
4. **Test Execution**: Single command runs complete test suite
5. **CI Integration**: Tests run successfully in CI pipeline
6. **Documentation**: Complete testing suite documentation

## 📝 **Example Test Implementation**

```typescript
// Unit Test Example
describe('ExpenseForm', () => {
  it('should submit expense data successfully', async () => {
    const mockSubmit = jest.fn();
    const { user } = render(<ExpenseForm onSubmit={mockSubmit} />);

    await user.type(screen.getByLabelText('Amount'), '25.50');
    await user.type(screen.getByLabelText('Description'), 'Lunch');
    await user.click(screen.getByRole('button', { name: 'Add Expense' }));

    expect(mockSubmit).toHaveBeenCalledWith({
      amount: 25.50,
      description: 'Lunch',
      category: expect.any(String),
      date: expect.any(Date)
    });
  });
});

// Mock Strategy Example
jest.mock('@/services/stripe', () => ({
  createPaymentIntent: jest.fn().mockResolvedValue({
    client_secret: 'pi_test_secret_123'
  }),
  confirmPayment: jest.fn().mockResolvedValue({
    status: 'succeeded'
  })
}));
```

## 🚀 **Final Deliverable**

A comprehensive testing suite that:

- Covers all application functionality with ≥90% coverage
- Implements proper mocking strategies for external services
- Provides clear test execution commands
- Integrates seamlessly with CI/CD pipelines
- Includes complete documentation and examples

---

**Remember**: Focus on delivering a robust, maintainable testing suite that ensures code quality and prevents regressions.
