# 07. Database Design & Schemas

The system uses 4 core models in MongoDB:

```mermaid
erDiagram
    USER ||--o{ TASK : "assigned to"
    USER ||--o{ SKILL : "possesses with proficiency"
    PROJECT ||--|{ TASK : "contains"
    SKILL ||--o{ TASK : "required for"

    USER {
        ObjectId _id
        string name
        string email
        string password
        string role
        string department
        string designation
        number experience
        string phone
        string availability
        array skills
    }

    SKILL {
        ObjectId _id
        string name
        string category
        string description
    }

    PROJECT {
        ObjectId _id
        string name
        string client
        string description
        date startDate
        date endDate
        string status
        string priority
        ObjectId createdBy
    }

    TASK {
        ObjectId _id
        ObjectId project
        string title
        string description
        string priority
        string status
        number estimatedHours
        date deadline
        array requiredSkills
        ObjectId assignedDeveloper
    }
```

## Schema Details

### 1. User Collection (`users`)
- `name` (String, required)
- `email` (String, required, unique, indexed)
- `password` (String, bcrypt hashed)
- `role` (Enum: `admin`, `developer`)
- `department` (String, default: `Engineering`)
- `designation` (String, default: `Software Engineer`)
- `experience` (Number, default: 1)
- `phone` (String)
- `availability` (Enum: `Available`, `Partially Allocated`, `Fully Allocated`)
- `skills`: Sub-document array `[{ skill: ObjectId (ref: Skill), proficiency: 'Beginner'|'Intermediate'|'Advanced'|'Expert' }]`

### 2. Skill Collection (`skills`)
- `name` (String, required, unique)
- `category` (String, default: `General`)
- `description` (String)

### 3. Project Collection (`projects`)
- `name` (String, required)
- `client` (String, default: `Internal`)
- `description` (String)
- `startDate` (Date)
- `endDate` (Date)
- `status` (Enum: `Planning`, `In Progress`, `Completed`, `On Hold`)
- `priority` (Enum: `Low`, `Medium`, `High`, `Urgent`)
- `createdBy` (ObjectId, ref: `User`)

### 4. Task Collection (`tasks`)
- `project` (ObjectId, ref: `Project`, required)
- `title` (String, required)
- `description` (String)
- `priority` (Enum: `Low`, `Medium`, `High`, `Urgent`)
- `status` (Enum: `To Do`, `In Progress`, `Completed`)
- `estimatedHours` (Number, default: 8)
- `deadline` (Date)
- `requiredSkills` (Array of ObjectId, ref: `Skill`)
- `assignedDeveloper` (ObjectId, ref: `User`, default: null)
