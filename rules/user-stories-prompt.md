# User Stories Generation Prompt

## Core Instructions

### 1. **Time Constraint Management**

- **Total Timebox**: 4 hours (including testing and deployment)
- **Focus**: MVP-focused deliverables that are testable and deployable
- **Iteration Approach**: Incremental, deployable delivery at the end of each iteration

### 2. **User Story Identification Criteria**

- **High-Priority**: Focus on core value delivery
- **Hackathon-Feasible**: Must be implementable within time constraints
- **Testable**: Each story must have clear acceptance criteria for testing
- **Deployable**: Stories must result in working, deployable features

### 3. **Story Organization & Prioritization**

- **Epic Grouping**: Group related stories into epics (if useful for organization)
- **Prioritization Factors**:
  - Feasibility within time constraints
  - User value and impact
  - Ability to distribute parallel work across 3 developers and 1 tester
- **Complexity Assessment**: Assign Low/Medium/High complexity levels

### 4. **Team Distribution Strategy**

- **Team Size**: 3 developers + 1 tester
- **Parallelization**: Identify opportunities for parallel development
- **Work Distribution**: Ensure balanced workload across team members

## Required Story Elements

### For Each User Story, Provide:

1. **Title**: Clear, concise story name
2. **Description**: What the story accomplishes
3. **Acceptance Criteria**: Specific, testable requirements
4. **Complexity Level**: Low/Medium/High assessment
5. **Estimated Effort**: Time estimate for implementation

## Output Format Requirements

### Markdown File Structure (`user-stories.md`):

1. **Project Context Summary**
   - Product overview
   - Hackathon constraints
   - Team composition
   - Success criteria

2. **Prioritized User Stories List**
   - Organized by priority (Must-Have, Should-Have, Could-Have)
   - Each story with all required elements
   - Epic grouping where applicable

3. **Iteration Mapping**
   - Suggested breakdown for 4-hour hackathon
   - Milestone checkpoints
   - Deployable increments

4. **Parallelization Opportunities**
   - Stories that can be developed simultaneously
   - Dependencies and blockers
   - Team member role assignments

5. **Risk Mitigation**
   - Potential blockers and solutions
   - Fallback options for complex stories
   - Testing strategy for each iteration

## Quality Standards

### Story Quality Checklist:

- [ ] Stories are small enough to complete in 1-2 hours
- [ ] Acceptance criteria are specific and testable
- [ ] Complexity estimates are realistic
- [ ] Dependencies are clearly identified
- [ ] Stories support parallel development
- [ ] Each story delivers user value
- [ ] Stories are written from user perspective

### Hackathon Feasibility Checklist:

- [ ] Total story effort fits within 4-hour timebox
- [ ] Stories can be tested within time constraints
- [ ] Deployment is possible after each iteration
- [ ] Team workload is balanced
- [ ] Risk mitigation strategies are in place

## Example Story Format

```markdown
### [Priority] Story Title

**Description**: Brief description of what this story accomplishes

**Acceptance Criteria**:

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

**Complexity**: Low/Medium/High

**Estimated Effort**: X hours

**Dependencies**: List any blockers or dependencies

**Team Member**: Suggested developer assignment
```

## Success Metrics

### Document Quality:

- Clear, actionable user stories
- Realistic time estimates
- Balanced team workload
- Identified parallelization opportunities

### Hackathon Readiness:

- Stories fit within 4-hour constraint
- Clear iteration milestones
- Testable deliverables
- Deployable increments

## Notes

- **Keep it Simple**: Focus on core functionality over nice-to-have features
- **Test Early**: Ensure testing is built into each story
- **Deploy Often**: Aim for working software after each iteration
- **Team Balance**: Distribute work evenly across developers
- **Risk Management**: Identify and mitigate potential blockers early
