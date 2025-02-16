# Team Workflow

## Introduction

This document outlines the workflow for our team to ensure smooth collaboration and efficient project management.

## Tools

- **Version Control**: Git and GitHub
- **Project Management**: GitHub Project
- **Communication**: Discord

## Branching Strategy

1. **main**: Production-ready code.
2. **develop**: Integration branch for features.
3. **feature/**: New features or improvements.
4. **bugfix/**: Bug fixes.

## Workflow

1. **Create a Branch**:

   - Branch off from `develop`.
   - Name the branch according to the task (e.g., `feature/login-page`).

2. **Develop**:

   - Write code and commit changes.
   - Ensure commits are atomic and messages are descriptive.

3. **Pull Request**:

   - Open a pull request against `develop`.
   - Request reviews from team members.

4. **Code Review**:

   - Review pull requests.
   - Provide constructive feedback.
   - Approve changes if satisfactory.

5. **Merge**:

   - Merge the pull request after approval.
   - Ensure the `develop` branch is up-to-date.

6. **Testing**:

   - Test the integrated code in the `develop` branch.
   - Report and fix any issues.

7. **Release**:

   - Merge `develop` into `main` for production release.
   - Tag the release with a version number.

## Project Setup

1. **Clone Repository**:

- Clone the repository from GitHub to your local machine.
- `git clone https://github.com/chingu-voyages/V53-tier2-team-23`

2. **Install Dependencies**:

- Navigate to the project directory.
- Install the required dependencies using the package manager (e.g., `npm install`).

## Development

1. Start the backend server:

```
cd backend
npm start
```

2. Start the frontend server:

```
cd client
npm start
```

## Linting

```
cd frontend
npm run lint
```

## Building for Production

1. Build the frontend:

```
cd frontend
npm run build
```

2. Deploy the backend and frontend:

- Follow your deployment process to deploy the backend and frontend.

## Contributing

1. Create a new branch for your feature or bugfix:

```
git checkout -b feature/your-feature-name
```

2. Commit your changes:

```
git add .
git commit -m "Description of your changes"
```

3. Push your branch to the repository:

```
git push origin feature/your-feature-name
```

4. Create a pull request:

- Go to the repository on GitHub and create a pull request.

## Code Style

- Follow the ESLint rules defined in the project.
- Use 2 spaces for indentation.
- Use single quotes for strings.
- Always use semicolons at the end of statements.
- Avoid using console.log (use warn instead).
- Remove unused variables.
- Use strict equality (===).
- Do not use var (use let or const instead).

## Communication

- **Daily Standups**: Brief updates on progress.
- **Weekly Meetings**: Discuss challenges and plan for the week.
- **Ad-hoc Discussions**: Use Discord for quick questions and clarifications.

## Code Quality

- Follow coding standards and best practices.
- Ensure code is well-documented.

## Conclusion

Adhering to this workflow will help us maintain a high standard of code quality and ensure efficient collaboration within the team.
