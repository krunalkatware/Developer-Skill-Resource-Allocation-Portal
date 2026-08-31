# 05. Use Cases

## Key Actors
1. **Resource Manager (Admin)**: Manages team members, skill inventories, projects, deliverables, and allocates developers using the matching engine.
2. **Software Developer (Team Member)**: Views assigned work items and updates task delivery status.

## Use Case Summary Table

| Use Case ID | Use Case Name | Primary Actor | Description |
|---|---|---|---|
| **UC-01** | Authenticate User | Admin / Developer | Log into portal with email and password |
| **UC-02** | Manage Developers | Admin | Create, search, filter, edit, or delete developer profiles |
| **UC-03** | Manage Skills Library | Admin | Maintain organization skill taxonomy and proficiencies |
| **UC-04** | Create & Manage Projects | Admin | Define project milestones, client, status, and deadlines |
| **UC-05** | Create Work Tasks | Admin | Create deliverables with required technical skills |
| **UC-06** | Run Skill Matching Engine | Admin | Calculate developer match percentages for a task |
| **UC-07** | Allocate Developer to Task | Admin | Confirm and assign developer to task |
| **UC-08** | Track & Update Task Status | Developer | Change status from `To Do` → `In Progress` → `Completed` |
| **UC-09** | Toggle UI Theme | All Users | Switch between Light and Dark themes with persistence |
