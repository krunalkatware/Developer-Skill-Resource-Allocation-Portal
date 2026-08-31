# DevResource — Comprehensive Testing Guide & Verification Suite

This document contains test cases and step-by-step verification procedures for validating **DevResource (Developer Skill & Resource Allocation Portal)**.

---

## 1. Authentication & Role-Based Access Tests

### Test Case 1.1: Admin Login
- **Input**: Email = `admin@example.com`, Password = `admin123`
- **Expected Outcome**: Generates JWT token, navigates to `/dashboard`, displays Admin Dashboard with full management options (Developers, Skills, Projects, Tasks, Allocation).
- **Result**: PASS

### Test Case 1.2: Invalid Credentials
- **Input**: Email = `admin@example.com`, Password = `wrongpassword`
- **Expected Outcome**: 401 Unauthorized response, shows clear error message on login card without page crash.
- **Result**: PASS

### Test Case 1.3: Developer Login & Restricted Access
- **Input**: Email = `rahul@example.com`, Password = `dev123`
- **Expected Outcome**: Logs in as developer, displays Developer Dashboard with assigned tasks. Direct URL navigation to `/developers` or `/skills` redirects safely to dashboard.
- **Result**: PASS

---

## 2. Developer Management Tests

### Test Case 2.1: Create New Developer
- **Steps**: Click "+ Add Developer", fill in Name ("Vikram Rao"), Email ("vikram@example.com"), select Skills (React: Advanced, Node.js: Intermediate), click "Create Developer".
- **Expected Outcome**: Developer created in MongoDB, appears immediately in table, success Toast appears.
- **Result**: PASS

### Test Case 2.2: Search & Filter Developers
- **Steps**: Type "Full Stack" in search bar or filter by Availability = "Available".
- **Expected Outcome**: Table filters dynamically to show only matching developers.
- **Result**: PASS

### Test Case 2.3: Delete Developer with Task Protection
- **Steps**: Delete a developer who is assigned to a task.
- **Expected Outcome**: Developer is removed; task's `assignedDeveloper` is automatically set to `null` (unassigned) without orphaned references.
- **Result**: PASS

---

## 3. Skill Matching Engine Tests (Core Feature)

### Test Case 3.1: Deterministic Match Formula Calculation
- **Task**: "Create Product Dashboard" requiring `React`, `JavaScript`, `MongoDB` (3 skills total).
- **Developer 1 (Rahul Sharma)**: Has `React`, `JavaScript`, `MongoDB` (3/3 matched) → **100% (Excellent Match)**
- **Developer 2 (Neha Singh)**: Has `React`, `JavaScript` (2/3 matched) → **67% (Good Match)**, Missing `MongoDB` displayed in red tag.
- **Developer 3 (Amit Patil)**: Has `Java`, `Spring Boot`, `MySQL` (0/3 matched) → **0% (Low Match)**, Missing `React`, `JavaScript`, `MongoDB`.
- **Expected Outcome**: Matching modal displays developers in descending rank order with exact match percentages and clear visual checkmark/cross badges.
- **Result**: PASS

### Test Case 3.2: Direct Assignment Confirmation
- **Steps**: Click "Assign Developer" next to Rahul Sharma in the match modal → Click "Confirm Assignment".
- **Expected Outcome**: Task is updated with Rahul Sharma as assigned developer, modal closes, table reflects assigned state, and success toast displays.
- **Result**: PASS

---

## 4. Work Tracking & Developer Status Lifecycle Tests

### Test Case 4.1: Developer Changes Task Status
- **Steps**: Log in as Rahul Sharma → In My Assigned Tasks table, change status dropdown of "Create Product Dashboard" from `To Do` → `In Progress` → `Completed`.
- **Expected Outcome**: Updates in database instantly via `PUT /api/tasks/:id/status`, success toast appears, and dashboard stats increment automatically.
- **Result**: PASS

---

## 5. UI Theme System & Persistence Tests

### Test Case 5.1: Light / Dark Theme Switching
- **Steps**: Click the theme toggle button in the top navbar (☀ Light / 🌙 Dark).
- **Expected Outcome**: Background, sidebar, cards, inputs, tables, and modals transition smoothly between light (#F6F8FC) and dark blue-gray (#0F172A).
- **Result**: PASS

### Test Case 5.2: Theme Persistence on Browser Reload
- **Steps**: Switch to Dark mode → Refresh the browser page (`F5`).
- **Expected Outcome**: Page reloads in Dark mode; `localStorage.getItem('devresource_theme')` preserves `'dark'`.
- **Result**: PASS
