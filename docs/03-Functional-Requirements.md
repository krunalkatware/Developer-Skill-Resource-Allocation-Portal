# 03. Functional Requirements

## 1. User Authentication & Authorization (FR-1)
- **FR-1.1**: System shall authenticate users using email and bcrypt-hashed passwords.
- **FR-1.2**: System shall issue a signed JSON Web Token (JWT) on successful login with role claims (`admin` or `developer`).
- **FR-1.3**: System shall protect restricted routes and disallow unauthorized developer access to management endpoints.

## 2. Developer Management (FR-2)
- **FR-2.1**: Admin shall have the ability to create, read, update, and delete developer accounts.
- **FR-2.2**: System shall record developer name, email, department, designation, experience, contact phone, workload availability, and skill array.
- **FR-2.3**: System shall permit search by name, email, department, and filtering by workload availability (`Available`, `Partially Allocated`, `Fully Allocated`).

## 3. Technical Skills Management (FR-3)
- **FR-3.1**: Admin shall have the ability to maintain the global technical skills library (Name, Category, Description).
- **FR-3.2**: System shall calculate real-time usage metrics (number of developers possessing the skill and number of tasks requiring the skill).

## 4. Project Management (FR-4)
- **FR-4.1**: Admin shall have the ability to create and manage projects (Name, Client, Description, Status, Priority, Start/End Dates).
- **FR-4.2**: System shall calculate dynamic project progress based on completed tasks versus total tasks.

## 5. Task Management (FR-5)
- **FR-5.1**: Admin shall create tasks associated with specific projects, setting priority, deadline, estimated hours, and required skills.
- **FR-5.2**: System shall support assigning or unassigning developers to tasks.

## 6. Skill Matching Engine (FR-6) — Core Feature
- **FR-6.1**: System shall compute match percentage using the formula:
  $$\text{Match Percentage} = \frac{\text{Matched Required Skills}}{\text{Total Required Skills}} \times 100$$
- **FR-6.2**: System shall rank developers by match percentage (descending), availability status, and experience.
- **FR-6.3**: System shall explicitly display matched skills (with checkmarks) and missing skills (with crossmarks).
- **FR-6.4**: Admin shall be able to assign recommended developers directly from the matching modal.

## 7. Developer Workspace & Status Tracking (FR-7)
- **FR-7.1**: Logged-in developers shall view only their assigned tasks and associated projects.
- **FR-7.2**: Developers shall have the ability to update their task status (`To Do`, `In Progress`, `Completed`), updating dashboard metrics automatically.
