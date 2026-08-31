# 09. Testing & Quality Assurance

## Testing Strategy
The DevResource platform was validated using structured test cases spanning unit, integration, authentication, business logic (matching formula), and UI theme responsiveness.

## Key Test Cases

| Test ID | Test Scenario | Steps | Expected Result | Status |
|---|---|---|---|---|
| **TC-01** | Admin Authentication | Submit `admin@example.com` / `admin123` | JWT generated, redirects to Admin Dashboard | **PASSED** |
| **TC-02** | Invalid Login Attempt | Submit invalid password | Returns 401 error message | **PASSED** |
| **TC-03** | Developer Account Creation | Add developer with skills | Developer stored in DB, appears in directory | **PASSED** |
| **TC-04** | Skill Matching Accuracy | Run matcher on task with 3 skills | Rahul (3/3) = 100%, Neha (2/3) = 67%, Amit (0/3) = 0% | **PASSED** |
| **TC-05** | Resource Assignment | Assign Rahul to task | Task updated with assignedDeveloper, Toast appears | **PASSED** |
| **TC-06** | Developer Status Update | Rahul changes task to `In Progress` | Status saved in DB, progress bar updates | **PASSED** |
| **TC-07** | Role-Based Access Restriction | Developer attempts admin route | Redirected to dashboard, 403 on API | **PASSED** |
| **TC-08** | Theme Persistence | Switch to Dark theme and refresh | Theme remains Dark after refresh | **PASSED** |
