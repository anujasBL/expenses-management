# Pre-Push Quality Gate Prompt Instructions

## 🚦 **Primary Objective**
Execute local quality checks before any git push/merge to enforce code quality and prevent broken builds from reaching main. These checks must be repeatable by any developer and compatible with Node 22.x and React.

## 📋 **Core Requirements**

### **1. Quality Gate Execution**
Before any git push/merge, the assistant must execute local quality checks to enforce code quality and prevent broken builds from reaching main. These checks must be:

- **Repeatable**: Any developer can run the same commands
- **Compatible**: Work with Node 22.x and React
- **Comprehensive**: Cover all critical quality aspects
- **Fast**: Optimized for developer workflow

### **2. Required Quality Gates (In Order)**
Execute and report results for the following gates sequentially:

#### **Gate 1: Code Formatting**
- **Command**: `npx prettier --check .`
- **Purpose**: Ensure consistent code formatting across the codebase
- **Failure Criteria**: Any files with formatting inconsistencies

#### **Gate 2: TypeScript Type Safety**
- **Command**: `npm run type-check` or `tsc --noEmit`
- **Purpose**: Verify TypeScript compilation without errors
- **Failure Criteria**: Any TypeScript compilation errors or type mismatches

#### **Gate 3: Code Linting**
- **Command**: `npm run lint`
- **Purpose**: Enforce code quality rules and best practices
- **Failure Criteria**: Any ESLint errors or critical warnings

#### **Gate 4: Test Coverage**
- **Command**: `npm run test:coverage`
- **Purpose**: Ensure all tests pass and coverage meets requirements
- **Failure Criteria**: Test failures or coverage below target threshold

#### **Gate 5: Production Build**
- **Command**: `npm run build`
- **Purpose**: Verify production build succeeds
- **Failure Criteria**: Build errors, warnings, or asset generation failures

### **3. Quality Gate Behavior**
- **Stop on First Failure**: If any gate fails, stop execution immediately
- **Failure Report**: Output concise failure details with file paths and suggested fixes
- **Success Summary**: On completion, output green-light summary with timestamps and git info

### **4. Quality Gate Output**
- **Status Per Gate**: Clear PASS/FAIL indicators for each gate
- **Command Logs**: Summarized execution logs for each gate
- **Failure Details**: Specific error messages, file paths, and remediation steps
- **Final Decision**: Push Allowed / Blocked based on gate results

## 📁 **Output Format Requirements**

### **Pre-Push Quality Gate Report (pre-push-report.md) Including:**

#### **1. Command Logs**
- **Summarized Execution**: Brief logs for each gate execution
- **Timing Information**: Execution time for each gate
- **Resource Usage**: Memory and CPU usage if relevant

#### **2. Status Per Gate**
- **PASS/FAIL Indicators**: Clear status for each quality gate
- **Timestamps**: When each gate was executed
- **Execution Details**: Brief summary of what was checked

#### **3. Failure Details and Remediation**
- **Error Messages**: Specific error details from failed gates
- **File Paths**: Exact files and line numbers with issues
- **Suggested Fixes**: Actionable steps to resolve issues
- **Priority Level**: Critical vs. warning level issues

#### **4. Final Decision**
- **Push Allowed**: All gates passed successfully
- **Push Blocked**: One or more gates failed
- **Reasoning**: Clear explanation of the decision
- **Next Steps**: What needs to be fixed before push

#### **5. Git Information**
- **Current Branch**: Active git branch name
- **Commit Hash**: Current commit identifier
- **Timestamp**: When the quality gate check was performed
- **Repository Status**: Clean working directory status

## 🔧 **Technical Standards**

### **Quality Gate Standards**
- **Automated Execution**: All gates must run automatically
- **Fast Execution**: Optimize for developer workflow speed
- **Clear Feedback**: Immediate and actionable failure reports
- **Consistent Results**: Same results across different environments

### **Execution Requirements**
- **Sequential Processing**: Gates must run in specified order
- **Early Termination**: Stop immediately on first failure
- **Error Handling**: Graceful handling of command failures
- **Logging**: Comprehensive logging for debugging

### **Compatibility Requirements**
- **Node 22.x**: Must work with latest Node.js LTS
- **React Compatibility**: Must work with React 18+ applications
- **Cross-Platform**: Must work on Windows, macOS, and Linux
- **Shell Independence**: Must work with different shell environments

## 📊 **Quality Assurance**

### **Quality Gate Verification**
- ✅ Prettier formatting check passes
- ✅ TypeScript type check passes
- ✅ ESLint linting passes
- ✅ All tests pass with coverage
- ✅ Production build succeeds

### **Execution Verification**
- ✅ All gates execute in correct order
- ✅ Failure detection works properly
- ✅ Success reporting is accurate
- ✅ Git information is correct

## 🎯 **Success Criteria**

1. **Gate Execution**: All quality gates execute successfully
2. **Failure Detection**: Failed gates are properly identified
3. **Success Reporting**: Successful execution provides clear feedback
4. **Git Integration**: Proper git information is captured
5. **Documentation**: Complete quality gate report is generated

## 📝 **Example Quality Gate Report**

```markdown
# Pre-Push Quality Gate Report

## 🚦 Quality Gate Results

### Gate 1: Code Formatting ✅ PASS
- **Command**: `npx prettier --check .`
- **Status**: PASS
- **Timestamp**: 2024-01-15 14:30:22
- **Details**: All files properly formatted

### Gate 2: TypeScript Type Safety ✅ PASS
- **Command**: `npm run type-check`
- **Status**: PASS
- **Timestamp**: 2024-01-15 14:30:45
- **Details**: No type errors found

### Gate 3: Code Linting ✅ PASS
- **Command**: `npm run lint`
- **Status**: PASS
- **Timestamp**: 2024-01-15 14:31:12
- **Details**: No linting errors

### Gate 4: Test Coverage ✅ PASS
- **Command**: `npm run test:coverage`
- **Status**: PASS
- **Timestamp**: 2024-01-15 14:32:05
- **Coverage**: 92.5%
- **Details**: All tests passing

### Gate 5: Production Build ✅ PASS
- **Command**: `npm run build`
- **Status**: PASS
- **Timestamp**: 2024-01-15 14:33:18
- **Details**: Build successful, no errors

## 🎯 Final Decision: PUSH ALLOWED ✅

**Git Information:**
- **Branch**: feature/expense-management
- **Commit**: a1b2c3d4e5f6
- **Timestamp**: 2024-01-15 14:33:18

All quality gates passed successfully. Code is ready for push/merge.
```

## 🚀 **Final Deliverable**

A comprehensive quality gate system that:
- Executes all required quality checks automatically
- Provides clear PASS/FAIL feedback for each gate
- Generates detailed reports for successful and failed executions
- Integrates seamlessly with git workflow
- Prevents broken code from reaching main branch

---

**Remember**: Focus on delivering a reliable, fast quality gate system that maintains code quality standards and prevents regressions.
