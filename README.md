# Solar Aid Web

A full-stack web application for solar energy management and analysis using the MERN stack with modern development tools.

## Tech Stack

- **Frontend:** React 18 + Vite
- **Backend:** Node.js + Express.js
- **Database:** MongoDB
- **Additional Tools:** Axios, React Router, TailwindCSS (optional)

## Project Structure

```
solar-aid-web/
├── client/                 # React frontend (Vite)
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                 # Express backend
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   ├── middleware/
│   ├── server.js
│   └── package.json
├── README.md
├── .gitignore
└── .env.example
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas)
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd solar-aid-web
   ```

2. **Setup Backend:**
   ```bash
   cd server
   npm install
   cp ../.env.example .env
   # Edit .env with your MongoDB URI and other configurations
   npm run dev
   ```
   The backend will run on `http://localhost:5000` (or as configured)

3. **Setup Frontend:**
   ```bash
   cd ../client
   npm install
   cp ../.env.example .env.local
   # Update environment variables if needed
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

### Running the Application

**Development Mode:**
- Backend: `cd server && npm run dev`
- Frontend: `cd client && npm run dev`

**Production Build:**
- Backend: `npm start`
- Frontend: `npm run build`

## Git Workflow Rules for Group Members

### Branch Naming Convention
- Feature branches: `feature/feature-name`
- Bug fixes: `bugfix/bug-name`
- Hotfixes: `hotfix/hotfix-name`
- Example: `feature/user-authentication`, `bugfix/login-error`

### Commit Message Guidelines
Follow conventional commits format:
```
type(scope): description

feature: Add new feature
fix: Fix a bug
docs: Update documentation
style: Format code
refactor: Refactor code
test: Add tests
chore: Update dependencies
```

### Pull Request Process
1. Create a feature branch from `main`
2. Make your changes with clear, atomic commits
3. Push to your branch
4. Create a Pull Request with a descriptive title and description
5. Request review from at least one team member
6. Address review comments
7. Merge only after approval
8. Delete the feature branch after merging

### Code Review Checklist
- [ ] Code follows project style guidelines
- [ ] No console errors or warnings
- [ ] Tests pass (when applicable)
- [ ] Documentation is updated
- [ ] No hardcoded values or secrets

### Important Rules
- **Never push to `main`** - all changes must go through PRs
- Always pull the latest changes before starting new work: `git pull origin main`
- Keep commits small and logical
- Write meaningful commit messages
- Test your changes locally before pushing
- Resolve conflicts promptly

## test Report
## Testing Environment Configuration Details

This project uses Jest and Supertest for integration testing. The test environment is completely isolated from production/development data by using `mongodb-memory-server`, which spins up a temporary in-memory database during test runs.

### Prerequisites

The following testing libraries are required (installed via `npm install --save-dev`):
- `jest`
- `supertest`
- `mongodb-memory-server`
- `cross-env`
- `jest-html-reporter`

### Environment Variables

No special `.env` variables are strictly required to run tests, because `tests/setup.js` automatically provisions the target `MONGODB_URI` using the memory server. However, if your tests require other environment variables like `JWT_SECRET`, ensure they are present in the `server/.env` file.

### Executing Tests

To run the integration testing suite locally:

1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Make sure you have installed all dependencies, including dev dependencies:
   ```bash
   npm install
   ```
3. Execute the tests in terminal:
   ```bash
   npm run test
   ```
4. Generate and view the HTML Test Report:
   ```bash
   npm run test:ui
   ```
   *This command runs the tests and automatically opens `test-report.html` in your default browser, allowing you to view detailed logs and capture screenshots of successful or failed test outputs.*

### Performance Testing Configuration

This project implements load testing using Artillery.
To simulate user traffic and observe concurrent request handling, ensure your server is running (`npm start`) and execute:

```bash
cd server
npm run test:performance
```
The load tests will target the `/api/health` and base routes with sequential phases of warmup and sustained loading over 30 seconds.

## Environment Variables

See `.env.example` for required environment variables. Create a `.env` file in both `client/` and `server/` directories with your actual values.

## Weather Insight Integration

This system integrates OpenWeather API to:
- Provide real-time weather data for Colombo
- Estimate daily solar efficiency based on cloud coverage
- Recommend ideal days for solar installation
- Improve overall solar assessment accuracy

**Security:**
- API key is stored securely in the backend `.env` file
- All API calls originate from the backend to prevent key exposure
- No sensitive keys are exposed to the frontend browser

## Contact & Support

For questions or issues, please contact the project maintainers or create a GitHub issue.

---

**Last Updated:** February 2026
