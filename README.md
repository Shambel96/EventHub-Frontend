🎉 Event Management System – Frontend

A modern web application that allows users to browse, search, and manage events. Built with scalability, clean architecture, and team collaboration in mind.

---

🚀 Tech Stack

- Framework: (React / Nuxt / Vue – update based on your choice)
- State Management: (Redux / Pinia / Context API)
- Styling: Tailwind CSS / CSS Modules
- API Communication: Axios / Fetch
- Version Control: Git + GitHub

---

📂 Project Structure

src/
 ├── components/        # Reusable UI components
 ├── pages/             # Application pages
 ├── layouts/           # Layout wrappers
 ├── services/          # API calls
 ├── store/             # State management
 ├── utils/             # Helper functions
 ├── assets/            # Images, styles
 └── hooks/             # Custom hooks (if React)

---

🌿 Git Workflow (Team Standard)

We follow a feature-based Git workflow for clean collaboration.

🔹 Main Branches

- "main" → Production-ready code
- "develop" → Active development branch

---

🔹 Supporting Branches

- "feature/*" → New features
- "bugfix/*" → Bug fixes
- "hotfix/*" → Urgent production fixes
- "release/*" → Release preparation

---

🔹 Branch Naming Examples

feature/event-list-page
feature/login-auth
feature/event-filter

bugfix/navbar-mobile
hotfix/login-crash
release/v1.0.0

---

🔄 Development Workflow

1. Clone Repository

git clone <repo-url>
cd event-frontend

---

2. Start from Develop

git checkout develop
git pull origin develop

---

3. Create Feature Branch

git checkout -b feature/your-feature-name

---

4. Make Changes & Commit

We use Conventional Commits:

feat: add event card component
fix: resolve search bug
style: improve button design
refactor: optimize API calls

---

5. Push Changes

git push origin feature/your-feature-name

---

6. Create Pull Request (PR)

- Target branch → "develop"
- Add description
- Attach screenshots (for UI changes)

---

7. Code Review & Merge

- Address feedback
- Merge into "develop"

---

🔁 Keeping Your Branch Updated

git checkout develop
git pull origin develop

git checkout feature/your-feature
git merge develop

---

🚀 Release Process

git checkout develop
git checkout -b release/v1.0.0

After testing:

git checkout main
git merge release/v1.0.0

git checkout develop
git merge release/v1.0.0

---

🚨 Hotfix Process

git checkout main
git checkout -b hotfix/issue-name

After fixing:

git checkout main
git merge hotfix/issue-name

git checkout develop
git merge hotfix/issue-name

---

📌 Best Practices

- Never push directly to "main"
- Always pull latest changes before starting
- Keep PRs small and focused
- Write clear commit messages
- Delete merged branches

git branch -d feature/your-feature

---

🧪 Running the Project

npm install
npm run dev

---

📈 Key Features

- Browse events
- Search events
- Filter by category & duration
- User authentication
- Create & manage events

---

🤝 Contribution Guide

1. Fork the repo
2. Create your branch ("feature/...")
3. Commit your changes
4. Open a Pull Request

---

📄 License

This project is licensed under the MIT License.

---

👨‍💻 Team Notes

- Follow the Git workflow strictly
- Maintain clean and readable code
- Communicate through PRs and issues

---

🔥 This workflow ensures scalability, clean collaboration, and production safety for the Event Management System frontend.