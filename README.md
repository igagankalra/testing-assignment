# Greentube QA Assignment

TypeScript + Playwright + Cucumber BDD test project for the Greentube take-home assignment.

---

## Project Structure

```
greentube-assignment/
├── features/
│   ├── manual/
│   │   ├── registration.feature   # Part 1 & 2: Gherkin scenarios for Registration
│   │   └── login.feature          # Part 1 & 2: Gherkin scenarios for Login
│   └── api/
│       └── petstore.feature       # Part 3: Cucumber BDD for Petstore API
├── src/
│   ├── api/
│   │   ├── endpoints/
│   │   │   └── pet.ts             # Pet API endpoint constants and URLs
│   │   └── PetApiClient.ts        # API Client Pattern — all HTTP calls live here
│   ├── steps/
│   │   ├── petstore.steps.ts      # Cucumber step definitions for API feature
│   │   └── petstore.api.spec.ts   # Playwright API test spec (standalone)
│   ├── support/
│   │   ├── world.ts               # Cucumber World — shared state between steps
│   │   └── hooks.ts               # Before/After hooks
│   └── types/
│       └── petstore.types.ts      # TypeScript interfaces for API data models
├── .env                           # Environment variables (git-ignored)
├── .env.example                   # Example environment configuration
├── cucumber.config.js             # Cucumber runner configuration
├── playwright.config.ts           # Playwright test runner configuration
├── tsconfig.json                  # TypeScript compiler options
└── package.json                   # Dependencies and scripts
```

---

## Setup

```bash
# Install dependencies
npm install
```

---

## Environment Configuration

Create a `.env` file in the project root (copy from `.env.example`):

```env
# Petstore API Configuration
API_BASE_URL=https://petstore.swagger.io/v2

# UI Test Configuration (for future use)
BASE_URL=https://www.gametwist.com/en/

# Browser Configuration
HEADLESS=true
```

**Note:** The `.env` file is git-ignored for security. Use `.env.example` as a template.

---

## Running Tests

### Option A: Cucumber BDD (Gherkin + Step Definitions)
```bash
# Run all scenarios
npm test

# Run only API scenarios (tagged @api)
npm run test:api

# Run smoke tests only
npm run test:smoke
```

### Option B: Playwright Test Spec (direct)
```bash
# Run the Playwright API spec
npm run test:api:playwright
```

---

## Key Design Decisions

### API Endpoints (`src/api/endpoints/`)
API URLs are centralized in endpoint definition files (e.g., `pet.ts`). This provides:
- Single source of truth for all endpoint paths
- Easy switching between environments (dev, staging, prod)
- Clear separation of concerns — endpoints separate from HTTP logic

### Environment Configuration (`.env`)
API base URLs and configuration are loaded from environment variables via `.env` file:
- Supports multiple environments without code changes
- Sensitive data kept out of version control
- Configuration via `dotenv/config` imported in `world.ts`

### API Client Pattern (`PetApiClient.ts`)
All HTTP interactions are encapsulated in a single class. Tests call business-level
methods like `client.createPet()` — not raw HTTP calls. This means:
- One place to update base URL or auth headers
- Tests are readable and focused on *what* is being tested, not *how*
- Works seamlessly with externalized endpoint URLs

### Unique Pet IDs
Each test run uses `Date.now() % 1000000` as the pet ID. This prevents collisions
when multiple engineers run tests against the same public Petstore API simultaneously.

### Cucumber World
Shared state (last HTTP response, created pet) lives on the `CustomWorld` instance.
Steps communicate through `this.lastResponse` and `this.createdPet`, not global variables.

---

## Assignment Requirements Checklist

| Requirement | Status | Where |
|---|---|---|
| Gherkin scenarios for Registration | ✅ | `features/manual/registration.feature` |
| Gherkin scenarios for Login | ✅ | `features/manual/login.feature` |
| Automation decision table | ✅ | Comments in feature files |
| POST /pet | ✅ | `TC-API-01` |
| GET /pet/{id} | ✅ | `TC-API-02` |
| PUT /pet | ✅ | `TC-API-03` |
| DELETE /pet/{id} | ✅ | `TC-API-04` |
| Verify 200 status code | ✅ | `TC-API-01, 02, 03, 04` |
| Verify 404 status code | ✅ | `TC-API-04, 05` |
| POST response matches GET response | ✅ | `TC-API-02` |
