#  Event Management System – Frontend

A modern **Event Management Platform** built with **Vue.js and Nuxt**, allowing users to browse, search, and create events easily.

---

#  Tech Stack

* **Framework:** Nuxt.js (Vue 3)
* **Language:** JavaScript / TypeScript
* **Styling:** TailwindCSS / CSS
* **State Management:** Pinia
* **HTTP Client:** Axios / Fetch
* **Version Control:** Git + GitHub

---

# 📂 Project Structure (Nuxt)

```
EventHub-Frontend/
│
├── public/               # Static public files
├── src/                  # Application source code
│   ├── assets/           # Images, fonts, global styles
│   ├── components/       # Reusable Vue components
│   ├── composables/      # Reusable logic (Nuxt composables)
│   ├── layouts/          # Layout templates
│   ├── middleware/       # Route middleware
│   ├── pages/            # Application routes (Nuxt auto routing)
│   ├── plugins/          # Vue/Nuxt plugins
│   ├── stores/           # Pinia stores
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Helper functions
│   └── app.vue           # Root application component
│
├── nuxt.config.ts        # Nuxt configuration
├── tailwind.config.ts    # Tailwind CSS configuration
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

---

# 🌿 Git Workflow

We follow a **feature-based Git workflow** to maintain a clean and scalable development process.

---

# 🧭 Branch Structure

### Main Branches

```
main
develop
```

### Branch Purposes

**main**

* Production-ready code
* Always stable
* Only updated through pull requests

**develop**

* Integration branch
* All completed features are merged here

---

# 🌱 Supporting Branches

### Feature Branches

Used when developing new features.

```
feature/<feature-name>
```

Examples:

```
feature/event-list-page
feature/event-card-component
feature/event-filter
feature/user-dashboard
feature/auth-login
```

---

### Bugfix Branches

Used to fix issues found during development.

```
bugfix/<issue-name>
```

Examples:

```
bugfix/navbar-responsive
bugfix/search-not-working
bugfix/event-card-layout
```

---

### Hotfix Branches

Used for **urgent production fixes**.

```
hotfix/<issue-name>
```

Example:

```
hotfix/login-crash
```

---

### Release Branches

Used to prepare production deployment.

```
release/<version>
```

Example:

```
release/v1.0.0
```

---

# 🔄 Development Workflow

## 1️⃣ Clone Repository

```
git clone https://github.com/Shambel96/EventHub-Frontend.git
cd EventHub-Frontend
```

---

## 2️⃣ Switch to Develop Branch

```
git checkout develop
git pull origin develop
```

---

## 3️⃣ Create Feature Branch

```
git checkout -b feature/event-list-page
```

---

## 4️⃣ Implement Feature

Example: Creating a **Nuxt event card component**

```
src/components/EventCard.vue
src/pages/events/index.vue
```

---

## 5️⃣ Commit Changes

We use **Conventional Commits**.

```
feat: add event card component
feat: implement event list page
fix: resolve event search bug
style: improve event card design
refactor: optimize event API call
```

Commit command:

```
git add .
git commit -m "feat: add event list page"
```

---

## 6️⃣ Push Feature Branch

```
git push origin feature/event-list-page
```

---

## 7️⃣ Create Pull Request

On GitHub:

* Base branch → `develop`
* Add description
* Add screenshots for UI changes (Optional)

---

## 8️⃣ Code Review

Team members review:

* Code quality
* Component structure
* Nuxt best practices

After approval → **merge into `develop`**

---

# 🔁 Sync Your Branch

Before continuing work:

```
git checkout develop
git pull origin develop

git checkout feature/event-list-page
git merge develop
```

---

# 🚀 Release Workflow

When the application is ready for deployment.

Create release branch:

```
git checkout develop
git checkout -b release/v1.0.0
```

After testing:

```
git checkout main
git merge release/v1.0.0

git checkout develop
git merge release/v1.0.0
```

---

# 🚨 Hotfix Workflow

If production has an urgent issue.

```
git checkout main
git checkout -b hotfix/login-error
```

Fix and commit:

```
git commit -m "fix: resolve login crash"
```

Merge back:

```
git checkout main
git merge hotfix/login-error

git checkout develop
git merge hotfix/login-error
```

---

# 🧹 Delete Merged Branch

```
git branch -d feature/event-list-page
```

---

# 📌 Best Practices

* ✔ Always branch from `develop`
* ✔ Never push directly to `main`
* ✔ Write clear commit messages
* ✔ Keep Pull Requests small
* ✔ Review code before merging

---

# 📦 Run Project

Install dependencies:

```
npm install
```

Start development server:

```
npm run dev
```

---

# 🎯 Key Features

* Browse events
* Search events
* Filter by category
* View event details
* User authentication
* Create and manage events

---

# 👨‍💻 Team Guidelines

* Follow component-based architecture
* Keep components reusable
* Use Pinia for global state
* Maintain consistent code formatting
* Follow Git workflow strictly



### Ezi wust Yemiker or alasfelagi ngr kale iyaworan update inaregewalen