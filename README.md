<div align="center">

# 🎟️ EventHub

### Discover Events. Create Experiences. Bring People Together.

**A modern event management platform designed to make discovering, exploring, and managing events easier through an intuitive web experience.**

<br/>

[![Nuxt](https://img.shields.io/badge/Nuxt_4-00DC82?style=for-the-badge&logo=nuxt.js&logoColor=white)](https://nuxt.com/)
[![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Pinia](https://img.shields.io/badge/Pinia-FFD859?style=for-the-badge&logo=vue.js&logoColor=333333)](https://pinia.vuejs.org/)

<br/>

[Overview](#-overview) •
[Features](#-features) •
[Tech Stack](#-technology-stack) •
[Installation](#-getting-started) •
[Architecture](#-project-architecture) •
[Contributors](#-contributors)

</div>

---

## 📌 Overview

**EventHub** is the frontend application of a full-stack event management system designed to provide users with an accessible and intuitive way to interact with event-related services.

Built with **Nuxt 4, Vue 3, TypeScript, and Tailwind CSS**, the application follows a component-oriented development approach with an emphasis on maintainability, reusable UI elements, and a consistent user experience.

The frontend communicates with the EventHub backend to support data-driven application functionality.

### 🎯 Project Objectives

- Provide an intuitive interface for event discovery and exploration.
- Simplify interactions with event-related functionality.
- Build a responsive and maintainable frontend application.
- Organize UI components and application logic into reusable units.
- Integrate with backend APIs for data management and user interactions.
- Establish a foundation for future improvements and additional features.

---

## ✨ Features

EventHub's frontend is organized around the workflows of an event management platform.

### 🎫 Event Discovery

- Explore event-related information.
- Display event data through the application interface.
- Support event discovery and navigation workflows.

### 🧩 Component-Based Development

- Reusable Vue components.
- Organized pages and layouts.
- Centralized application state management with Pinia.
- TypeScript support for maintainable development.
- Reusable application logic where appropriate.

### 🎨 Modern User Interface

- Utility-first styling with Tailwind CSS.
- Consistent component styling.
- Responsive interface design.
- Structured layouts and navigation.

### 🔗 Backend Integration

- Integration with the EventHub backend API.
- Support for data-driven interfaces.
- Separation of presentation logic from server-side business logic.
- A foundation for displaying event information and handling user interactions.

> **Note:** The features available to users depend on the functionality implemented in the current frontend and its integration with the backend.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| [Nuxt 4](https://nuxt.com/) | Frontend framework and application tooling |
| [Vue.js 3](https://vuejs.org/) | Reactive UI and component development |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe application development |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS styling |
| [Pinia](https://pinia.vuejs.org/) | State management |
| [Node.js](https://nodejs.org/) | JavaScript runtime |
| [npm](https://www.npmjs.com/) | Dependency management |
| [Git](https://git-scm.com/) | Version control |
| [GitHub](https://github.com/) | Source code hosting and collaboration |

---

## 🏗️ Project Architecture

EventHub follows a component-oriented frontend architecture.

```text
                    ┌─────────────────────────┐
                    │       EventHub UI       │
                    │                         │
                    │   Pages and Layouts     │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │     Vue Components      │
                    │                         │
                    │    Reusable UI          │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   Application Logic     │
                    │                         │
                    │   Stores and Utilities  │
                    └────────────┬────────────┘
                                 │
                         HTTP / API Requests
                                 │
                    ┌────────────▼────────────┐
                    │    EventHub Backend     │
                    │                         │
                    │  NestJS REST API        │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │      PostgreSQL         │
                    │                         │
                    │  Persistent Application │
                    │          Data           │
                    └─────────────────────────┘
```

### Architecture Responsibilities

**Frontend**
- Renders pages and UI components.
- Manages client-side state.
- Handles user interactions.
- Communicates with backend services.

**Backend**
- Processes API requests.
- Implements server-side application logic.
- Handles authentication and authorization.
- Manages persistent application data.

**Database**
- Stores application data and relationships.
- Supports event and user-related operations.

---

## 🔗 Related Repositories

EventHub consists of separate frontend and backend applications.

| Component | Technology | Repository |
|---|---|---|
| 🎨 Frontend | Nuxt 4, Vue 3, TypeScript | [EventHub-Frontend](https://github.com/Shambel96/EventHub-Frontend) |
| ⚙️ Backend | NestJS, TypeScript, Prisma | [EventHub-Backend](https://github.com/Shambel96/EventHub-Backend) |

### How They Work Together

The frontend provides the user interface, while the backend handles server-side operations and database access.

The applications communicate through HTTP requests to the backend API.

For local development, both applications should be configured to use the appropriate local URLs and permitted origins.

---

## 🚀 Getting Started

Follow these steps to run the frontend locally.

### Prerequisites

Make sure you have installed:

- **Node.js** — a version compatible with the project's dependencies.
- **npm** — the Node.js package manager.
- **Git** — for cloning the repository.

### 1. Clone the Repository

```bash
git clone https://github.com/Shambel96/EventHub-Frontend.git
```

Navigate to the project directory:

```bash
cd EventHub-Frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

If the application requires environment variables for backend connectivity or other services, create a `.env` file in the project root.

For example:

```dotenv
NUXT_PUBLIC_API_BASE=http://localhost:3000
```

This is an example configuration variable. Use the actual variable name expected by the frontend's API client.

Ensure that the backend is running at the configured address before testing API-dependent features.

**Security:** Never commit private credentials, tokens, or secrets to the repository.

### 4. Start the Development Server

```bash
npm run dev
```

Open the local URL displayed in your terminal.

Nuxt commonly uses:

```text
http://localhost:3000
```

If that port is occupied, the development server may use another port.

### 5. Build for Production

```bash
npm run build
```

### 6. Preview the Production Build

```bash
npm run preview
```

---

## 📜 Available Scripts

The following are the standard scripts expected for the development workflow. Verify them against the project's `package.json`.

| Command | Purpose |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build the application |
| `npm run generate` | Generate a static version of the application, if configured |
| `npm run preview` | Preview the production build |

---

## 🧑‍💻 Development Workflow

A consistent workflow helps keep the codebase maintainable as the application grows.

### Create a Feature Branch

Update your local development branch:

```bash
git checkout develop
git pull origin develop
```

Create a feature branch:

```bash
git checkout -b feature/event-discovery
```

Implement your changes and commit them:

```bash
git add .
git commit -m "feat: improve event discovery"
```

Push your branch:

```bash
git push -u origin feature/event-discovery
```

Open a pull request targeting the team's designated integration branch.

> **Note:** Use the branch names and merge rules established by your team's actual workflow.

### Commit Message Examples

```text
feat: add event listing interface
fix: resolve event display issue
style: improve responsive layouts
refactor: simplify reusable components
docs: update README
```

---

## 🧪 Testing and Quality

Before merging frontend changes, verify the following:

- [ ] The application starts successfully.
- [ ] Pages and components render correctly.
- [ ] Navigation works as expected.
- [ ] The interface works across different screen sizes.
- [ ] API requests use the correct backend configuration.
- [ ] Loading, empty, and error states behave correctly where implemented.
- [ ] The production build completes successfully.
- [ ] Existing functionality continues to work after changes.

Run the production build:

```bash
npm run build
```

If automated tests and linting are configured, run the corresponding commands before submitting a pull request.

---

## 🔒 Security Considerations

When developing and deploying EventHub:

- Never expose private credentials in frontend code.
- Treat all `NUXT_PUBLIC_` environment variables as public.
- Keep authorization enforcement on the backend.
- Validate sensitive operations on the server.
- Use HTTPS for production API communication.
- Configure backend CORS for the appropriate frontend origins.
- Avoid returning sensitive user information to the browser.

Frontend checks can improve the user experience, but they must not replace backend authorization.

---

## 🚧 Future Improvements

Potential areas for continued development include:

- [ ] Improve event discovery and navigation.
- [ ] Expand event search and filtering.
- [ ] Improve loading, empty, and error states.
- [ ] Expand responsive layouts.
- [ ] Improve accessibility and keyboard navigation.
- [ ] Optimize application performance.
- [ ] Expand automated testing.
- [ ] Improve API integration documentation.
- [ ] Add screenshots and a live demo link.

These are potential enhancements, not claims that all features are already implemented.

---

## 🤝 Contributing

Contributions and constructive feedback are welcome.

To contribute:

1. Fork the repository or create a feature branch if you are a team member.
2. Make your changes.
3. Test the affected functionality.
4. Commit your changes with descriptive messages.
5. Push your branch.
6. Open a pull request with a clear explanation of the changes.

For larger changes, discuss the proposed implementation with the team before starting work.

---

## 👨‍💻 Contributors

EventHub is developed collaboratively by:

- **Shambel Dechu**
- **Beata Teka**
- **Moges Sisay**

---

<div align="center">

### 🎟️ EventHub — Making Event Management Simpler

**Built with Nuxt, Vue, TypeScript, and NestJS.**

<br/>

[Frontend Repository](https://github.com/Shambel96/EventHub-Frontend) · [Backend Repository](https://github.com/Shambel96/EventHub-Backend)

⭐ If you find this project interesting, consider starring the repository.

</div>
