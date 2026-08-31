# 08. Module Description

## Module Breakdown

### 1. Authentication & Session Module
- Manages secure login using JWT tokens and bcrypt hash comparisons.
- Provides session restoration via `/api/auth/me` and profile updates via `/api/auth/profile`.

### 2. Developer Management Module
- Maintains developer profiles, departments, phone contacts, availability statuses, and dynamic skill matrix with 4 proficiency levels (`Beginner`, `Intermediate`, `Advanced`, `Expert`).
- Automatically handles unassigning tasks when a developer is deleted.

### 3. Skills Taxonomy Module
- Manages technical competencies and tracks live counts of developer ownership and task requirements.

### 4. Project Deliverables Module
- Tracks organization projects, deadlines, and automatically calculates delivery progress based on completed task percentages.

### 5. Task & Work Items Module
- Facilitates creating deliverables, setting required skill tags, setting deadlines, and assigning engineers.
- Permits assigned developers to transition statuses (`To Do` → `In Progress` → `Completed`).

### 6. Skill Matching & Recommendation Engine (Core Module)
- Calculates deterministic matching scores:
  $$\text{Match Percentage} = \frac{\text{Matched Required Skills}}{\text{Total Required Skills}} \times 100$$
- Returns ranked candidate list with match tiers (`Excellent Match`, `Good Match`, `Partial Match`, `Low Match`), checkmarked matched skills, crossed missing skills, and one-click assignment.

### 7. Resource Allocation Matrix Module
- Provides an executive view of active allocations, available developer capacity, and unassigned work items.
