# 04. Non-Functional Requirements

## 1. Usability & UI Aesthetics
- **NFR-1.1**: The portal shall adhere to modern corporate SaaS design guidelines with rounded corners (10–14px), subtle box shadows, and clear typography (Inter).
- **NFR-1.2**: The interface shall provide a clean, bright Light Theme by default and a Dark Blue-Gray Theme (avoiding pitch black) with smooth transitions.
- **NFR-1.3**: Theme preference shall persist across page reloads and browser sessions via `localStorage`.

## 2. Responsiveness
- **NFR-2.1**: The layout shall seamlessly adapt across desktop (>= 1200px), laptop (992px–1199px), tablet (768px–991px), and mobile devices (< 768px) with collapsible sidebar and scrollable tables.

## 3. Performance & Efficiency
- **NFR-3.1**: Skill matching calculations shall execute in sub-100ms for active task queries.
- **NFR-3.2**: Page loads and navigation shall utilize client-side routing via React Router DOM without full page reloads.

## 4. Security & Data Integrity
- **NFR-4.1**: Passwords must be hashed using `bcryptjs` with salt factor 10 before database persistence.
- **NFR-4.2**: API endpoints shall validate JWT tokens and restrict administrative actions to verified Admin users.

## 5. Reliability & Error Handling
- **NFR-5.1**: Database connection failures shall produce explicit, actionable error logs rather than failing silently.
- **NFR-5.2**: Client-side feedback shall be provided via animated, non-intrusive Toast notifications.
