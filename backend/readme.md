# IkramFashionShop — Backend Architecture & Development Guide

## 1. Project Overview

IkramFashionShop is a full-stack fashion e-commerce platform. Its backend provides a REST API responsible for business logic, authentication, product management, shopping carts, orders, inventory, and sales analytics.

The backend will be developed using:

- **Python** — programming language.
- **FastAPI** — REST API framework.
- **Pydantic** — data validation and serialization.
- **PostgreSQL** — relational database.
- **SQLAlchemy 2.x** — database ORM.
- **Alembic** — database schema migrations.
- **Pytest** — automated testing.
- **Ruff** — code formatting and linting.
- **Docker** — application containerization.
- **GitHub Actions** — continuous integration and delivery automation.

The main objective is to create a maintainable, secure, testable backend while following Clean Architecture principles and a layered design.

---

## 2. Architecture Choice

We will use a **Modular Monolith with Clean Architecture principles**.

A modular monolith means that the backend runs as one application, but its code is separated into independent business modules, such as products, users, carts, orders, and analytics.

Clean Architecture separates business rules from frameworks, databases, and external services.

This approach is appropriate because it provides:

- Clear separation of responsibilities.
- Easier unit and integration testing.
- Maintainable business logic.
- Reusable services and components.
- Controlled database access.
- Easier onboarding and collaboration.
- A path to future growth without introducing microservices prematurely.

We will not create unnecessary abstractions for every function. Each layer must have a clear purpose.

## 3. Architecture Diagram

```text
                    React Frontend
                          |
                     HTTP / JSON
                          |
                          v
+------------------------------------------------+
|              PRESENTATION LAYER                |
|       FastAPI Routers / Pydantic Schemas       |
+------------------------------------------------+
                          |
                          v
+------------------------------------------------+
|              APPLICATION LAYER                 |
|        Use Cases / Application Services        |
|         Repository and Service Contracts       |
+------------------------------------------------+
                          |
                          v
+------------------------------------------------+
|                 DOMAIN LAYER                    |
|       Entities / Value Objects / Rules         |
+------------------------------------------------+
                          ^
                          | Implements contracts
+------------------------------------------------+
|              INFRASTRUCTURE LAYER               |
|    SQLAlchemy / Repositories / External APIs   |
+------------------------------------------------+
                          |
                          v
                     PostgreSQL
```

The diagram describes responsibilities, not a requirement for every request to pass through every layer. A simple health endpoint does not need a domain entity or repository.

### Dependency rule

Dependencies should point toward the core business logic:

- The **domain layer** must not depend on FastAPI, SQLAlchemy, or external services.
- The **application layer** depends on domain concepts and required interfaces.
- The **infrastructure layer** implements the interfaces needed by the application.
- The **presentation layer** exposes use cases through HTTP.
- The application setup wires the concrete implementations together.

For example, a product service should not execute SQL queries directly. It should use an appropriate repository contract, implemented by the infrastructure layer.

---

## 4. Backend Folder Structure

The following is our target structure. We will create files progressively as the corresponding features are developed.

```text
backend/
│
├── app/
│   ├── main.py
│   │
│   ├── api/
│   │   ├── __init__.py
│   │   ├── router.py
│   │   └── dependencies.py
│   │
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py
│   │   ├── security.py
│   │   ├── logging.py
│   │   └── exceptions.py
│   │
│   ├── modules/
│   │   │
│   │   ├── users/
│   │   │   ├── domain/
│   │   │   ├── application/
│   │   │   ├── infrastructure/
│   │   │   └── presentation/
│   │   │
│   │   ├── products/
│   │   │   ├── domain/
│   │   │   ├── application/
│   │   │   ├── infrastructure/
│   │   │   └── presentation/
│   │   │
│   │   ├── carts/
│   │   │   ├── domain/
│   │   │   ├── application/
│   │   │   ├── infrastructure/
│   │   │   └── presentation/
│   │   │
│   │   ├── orders/
│   │   │   ├── domain/
│   │   │   ├── application/
│   │   │   ├── infrastructure/
│   │   │   └── presentation/
│   │   │
│   │   ├── payments/
│   │   │   ├── domain/
│   │   │   ├── application/
│   │   │   ├── infrastructure/
│   │   │   └── presentation/
│   │   │
│   │   └── analytics/
│   │       ├── domain/
│   │       ├── application/
│   │       ├── infrastructure/
│   │       └── presentation/
│   │
│   └── infrastructure/
│       └── database/
│           ├── __init__.py
│           ├── base.py
│           └── session.py
│
├── tests/
│   ├── conftest.py
│   ├── unit/
│   ├── integration/
│   ├── api/
│   └── security/
│
├── alembic/
│   └── versions/
│
├── alembic.ini
├── .env.example
├── .gitignore
├── .dockerignore
├── Dockerfile
├── requirements.txt
├── pyproject.toml
├── compose.yaml
└── README.md
```

### Important organizational rule

Each business module owns its feature-specific logic. For example, product-related business rules belong in `modules/products/`, while order-related rules belong in `modules/orders/`.

The shared `core/` directory is reserved for genuinely cross-cutting concerns. It must not become a place where unrelated business logic accumulates.

---

## 5. Explanation of Each Folder and File

### 5.1 `app/main.py`

**Purpose:** Application entry point.

Responsibilities:

- Create the FastAPI application.
- Configure application metadata.
- Register API routers.
- Register global exception handlers.
- Configure middleware such as CORS.
- Configure lifespan behavior when necessary.

It should not contain product management logic, database queries, or complex business operations.

### 5.2 `app/api/`

**Purpose:** Application-wide API organization.

#### `router.py`

Registers the routers belonging to API version 1.

For example:

- Users router.
- Products router.
- Carts router.
- Orders router.
- Admin analytics router.

Endpoints will use a common prefix, such as `/api/v1`.

#### `dependencies.py`

Contains shared FastAPI dependencies when appropriate, such as:

- Retrieving the authenticated user.
- Enforcing shared role-based access requirements.
- Providing application services through dependency injection.

Feature-specific authorization rules should remain close to the relevant feature.

### 5.3 `app/core/`

**Purpose:** Cross-cutting configuration and utilities.

#### `config.py`

Contains typed application settings loaded from environment variables using `pydantic-settings`.

Examples:

- Application environment.
- Database connection URL.
- CORS origins.
- Authentication configuration.
- External service configuration.

Secrets must never be hardcoded or committed to Git.

#### `security.py`

Contains reusable security utilities when appropriate, such as:

- Password hashing and verification.
- Token creation and verification.
- Security-related helper functions.

Authentication workflows and account-related use cases still belong in the users module.

#### `logging.py`

Configures application logging and safe log formatting.

Never log passwords, access tokens, payment details, or unnecessary personal information.

#### `exceptions.py`

Contains shared exception types or error-handling utilities if they are genuinely needed across multiple modules.

Business-specific exceptions should normally remain within their owning module.

### 5.4 `app/modules/`

**Purpose:** Contains the application's business modules.

Each module represents a business capability and follows the same layered organization where appropriate.

---

### 5.4.1 Users Module

Path: `app/modules/users/`

Responsible for customer accounts and identity-related operations.

Potential features:

- Customer registration.
- Login and logout workflows.
- Password management.
- Profile management.
- Address management.
- Role assignment and account status.
- Authentication-related application use cases.

The module is divided into domain, application, infrastructure, and presentation layers.

### 5.4.2 Products Module

Path: `app/modules/products/`

Responsible for the product catalog.

Potential features:

- Product creation and updates.
- Product descriptions and images.
- Product categories.
- Prices.
- Sizes and colors.
- Product variants and SKUs.
- Active/inactive status.
- Product search and filtering.

Product business rules must not depend on HTTP request objects or database session details.

### 5.4.3 Carts Module

Path: `app/modules/carts/`

Responsible for shopping cart operations.

Potential features:

- Creating and retrieving a cart.
- Adding products to a cart.
- Updating quantities.
- Removing items.
- Calculating a cart summary.
- Validating product availability.

The backend must calculate prices and totals. It must never trust totals sent by the React frontend.

### 5.4.4 Orders Module

Path: `app/modules/orders/`

Responsible for order creation and order lifecycle management.

Potential features:

- Creating an order from a cart.
- Recording purchased items and price snapshots.
- Tracking order status.
- Retrieving a customer's order history.
- Managing authorized order updates.
- Validating stock and order transitions.

Order creation and stock updates require appropriate transaction handling. Historical purchase prices must remain stable even when product prices later change.

### 5.4.5 Payments Module

Path: `app/modules/payments/`

Responsible for integration with a payment provider.

Potential features:

- Creating payment sessions.
- Recording provider references.
- Processing verified payment notifications.
- Tracking payment status.
- Handling refunds when supported.

Never store raw payment-card details. Verify payment-provider webhooks and make payment processing idempotent where appropriate.

### 5.4.6 Analytics Module

Path: `app/modules/analytics/`

Responsible for business metrics displayed in the admin dashboard.

Potential features:

- Revenue over a selected period.
- Number of qualifying orders.
- Average order value.
- Products sold.
- Best-selling products.
- Inventory summaries.
- Sales by category.

Metrics must be calculated from database records using documented definitions. Revenue, gross profit, and inventory value are different measures.

Admin analytics endpoints must enforce admin authorization on the backend.

---

## 6. Responsibilities of the Four Layers

Every feature module may contain the following layers.

### 6.1 Domain Layer

Example path:

`app/modules/products/domain/`

Contains:

- Business entities.
- Value objects.
- Domain rules.
- Domain-specific exceptions.

Example files:

- `entities.py`
- `exceptions.py`

An entity represents a business concept. A product entity may contain rules concerning valid prices or product state.

Domain code should use ordinary Python wherever practical. It should not import FastAPI, SQLAlchemy, or Pydantic HTTP schemas.

### 6.2 Application Layer

Example path:

`app/modules/products/application/`

Contains:

- Use cases.
- Application services.
- Repository interfaces.
- Coordination between business rules and persistence.

Example files:

- `interfaces.py`
- `services.py`

Examples of use cases:

- `CreateProduct`
- `GetProduct`
- `ListProducts`
- `UpdateProduct`

A service coordinates a business operation. It should not return FastAPI-specific responses or execute database queries directly.

### 6.3 Infrastructure Layer

Example path:

`app/modules/products/infrastructure/`

Contains:

- SQLAlchemy ORM models.
- Repository implementations.
- Database queries.
- External service adapters when relevant.

Example files:

- `models.py`
- `repositories.py`

The repository implementation fulfills the contract defined by the application layer.

SQLAlchemy models represent persistence concerns. They should not automatically be treated as API response schemas or independent domain entities.

### 6.4 Presentation Layer

Example path:

`app/modules/products/presentation/`

Contains:

- FastAPI routers.
- Pydantic request schemas.
- Pydantic response schemas.
- HTTP status codes.
- Request and response mapping.

Example files:

- `router.py`
- `schemas.py`

A route should validate the request, invoke the appropriate use case, and return the result.

Avoid placing complex business rules and SQL queries directly inside route functions.

---

## 7. Shared Database Infrastructure

Path: `app/infrastructure/database/`

### `base.py`

Contains the SQLAlchemy declarative base and metadata configuration used by ORM models.

### `session.py`

Contains the database engine and session factory, along with appropriate session lifecycle helpers.

Database sessions must be managed predictably and cleaned up after use. Do not create a new engine for every request.

### `alembic/`

Contains versioned database schema migrations.

Every shared schema change must have a reviewed migration.

Use Alembic to generate and apply migrations. Review autogenerated migrations before committing them, and test migrations against a disposable database.

Do not rely on SQLAlchemy `create_all()` as the production schema migration strategy.

---

## 8. Testing Architecture

Path: `tests/`

### `tests/unit/`

Tests isolated business rules and application services without relying on external infrastructure.

Examples:

- Rejecting an invalid product price.
- Validating order status transitions.
- Calculating totals correctly.
- Enforcing cart quantity rules.

### `tests/integration/`

Tests interactions between application components and real infrastructure.

Examples:

- Repository queries.
- Database constraints.
- Transactions.
- Database persistence.
- Migration compatibility.

Use a dedicated test database, never the production database.

### `tests/api/`

Tests HTTP behavior.

Examples:

- Successful responses.
- Invalid request payloads.
- Correct HTTP status codes.
- Pagination and filtering.
- Not-found responses.
- Response schema validation.

### `tests/security/`

Tests authorization and security boundaries.

Examples:

- A customer cannot retrieve another customer's orders.
- A customer cannot create an admin account by changing a request payload.
- An unauthenticated user cannot access protected endpoints.
- An ordinary customer cannot invoke admin-only endpoints.

### `tests/conftest.py`

Contains reusable pytest fixtures, test application setup, dependency overrides, and test settings.

Tests should be deterministic, repeatable, and independent of production data.

---

## 9. Development Workflow

Every feature should follow this workflow.

### Step 1 — Define requirements

Document the user story, acceptance criteria, inputs, outputs, permissions, validation rules, and expected error cases.

### Step 2 — Implement business rules

Create or update the domain model and rules where necessary.

Write unit tests for important business invariants.

### Step 3 — Implement the use case

Create an application service and the smallest necessary interfaces.

Keep business orchestration independent from FastAPI and concrete database implementations.

### Step 4 — Implement persistence

Create SQLAlchemy models and repository implementations.

Add and review Alembic migrations whenever the database schema changes.

### Step 5 — Expose the endpoint

Create Pydantic schemas and a thin FastAPI router.

Define response models, status codes, validation, and authorization requirements.

### Step 6 — Write tests

Add unit, API, integration, and security tests as appropriate.

Test both successful behavior and failure cases.

### Step 7 — Verify locally

Run formatting, linting, type checking, tests, and relevant migration checks.

Use Swagger UI to inspect the API during development.

### Step 8 — Document and commit

Update the README or relevant technical documentation.

Use descriptive commit messages, such as:

```text
feat(products): add product listing
test(products): cover product filtering
fix(orders): validate stock before checkout
docs(architecture): document repository pattern
```

### Step 9 — Create a pull request

Run CI and review the changes before merging into the protected main branch.

---

## 10. Code Quality and Local Commands

Use Ruff for formatting and linting, pytest for automated tests, and one configured type checker such as mypy.

After installing and configuring the tools, run:

```bash
ruff format .
ruff check .
pytest -q
```

For coverage, install `pytest-cov` and run:

```bash
pytest --cov=app --cov-report=term-missing
```

If mypy is selected and configured, run:

```bash
mypy app/
```

All quality-checking tools and their settings should be documented in `pyproject.toml` and installed through the project's development dependencies.

---

## 11. Docker and Environment Configuration

Docker will provide a reproducible runtime for the API and its supporting services.

The backend should include:

- A `Dockerfile` for the API.
- A Compose configuration for local development with PostgreSQL.
- A `.dockerignore` file.
- A `.env.example` file containing placeholder configuration.
- Health checks and sensible service startup behavior.

Example `.env.example`:

```dotenv
APP_NAME=IkramFashionShop API
APP_ENV=development
DEBUG=true
API_V1_PREFIX=/api/v1
DATABASE_URL=postgresql+psycopg://app_user:change_me@localhost:5432/ikram_fashion_shop
CORS_ORIGINS=http://localhost:5173
```

These values are examples for local development. Production credentials must be managed securely and must never be committed to Git.

---

## 12. CI/CD with GitHub Actions

Continuous Integration (CI) automatically checks code changes.

Continuous Delivery or Deployment (CD) packages and releases verified changes.

The target pipeline is:

```text
Developer pushes code
        |
        v
GitHub Actions starts
        |
        v
Install dependencies
        |
        v
Formatting + linting + type checking
        |
        v
Unit + API + integration tests
        |
        v
Migration validation
        |
        v
Docker image build
        |
        v
Required checks pass?
        |
        +---- No ----> Fix issues; block merge
        |
        +---- Yes ---> Merge to protected main
                            |
                            v
                     Publish image
                            |
                            v
                       Deploy app
                            |
                            v
                   Health / smoke tests
```

### CI requirements

- Run quality checks on pull requests and pushes to the main branch.
- Require successful CI checks before merging.
- Keep development and production settings separate.
- Store credentials in GitHub Actions secrets or the hosting provider's secret manager.
- Run database integration tests against a dedicated test database.
- Validate migrations and production Docker builds.
- Do not expose production credentials to untrusted pull requests.
- Avoid printing secrets in logs.

### CD requirements

- Deploy only verified revisions.
- Run migrations as a controlled release step.
- Back up production data and prepare a recovery plan for risky schema changes.
- Verify application health after deployment.
- Keep deployment and database rollback procedures documented.

The first pipeline will focus on CI. Automated deployment will be added after the application has reliable tests and a working container build.

---

## 13. Security Rules

- Never commit `.env` files or real credentials.
- Hash passwords using an appropriate password-hashing algorithm.
- Enforce role-based authorization on the backend.
- Verify customer ownership for carts, addresses, and orders.
- Never trust frontend-supplied prices, totals, discounts, or roles.
- Validate request data and uploaded files.
- Configure CORS with explicit trusted origins.
- Use HTTPS in production.
- Use secure cookie settings when authentication relies on cookies.
- Rate-limit sensitive endpoints where appropriate.
- Avoid logging tokens, passwords, and payment details.
- Verify payment-provider notifications.
- Review dependency updates and security alerts.

---

## 14. Definition of Done

A feature is complete when:

- [ ] Its requirements and acceptance criteria are satisfied.
- [ ] Its logic is implemented in the appropriate layer.
- [ ] Inputs and outputs are validated.
- [ ] Authorization is enforced where required.
- [ ] Relevant unit and integration tests pass.
- [ ] API behavior is tested.
- [ ] Formatting, linting, and type checks pass.
- [ ] Database migrations are reviewed and tested where applicable.
- [ ] Documentation is updated.
- [ ] CI passes.
- [ ] The change is reviewed before merging.

---

## 15. Development Roadmap

1. [ ] Initialize FastAPI and configuration.
2. [ ] Implement the root and health endpoints.
3. [ ] Configure Ruff, pytest, and the initial CI workflow.
4. [ ] Connect PostgreSQL using SQLAlchemy.
5. [ ] Configure Alembic migrations.
6. [ ] Implement product listing through the architectural layers.
7. [ ] Add database integration tests.
8. [ ] Implement authentication and role-based authorization.
9. [ ] Implement product and inventory management.
10. [ ] Implement shopping carts and order processing.
11. [ ] Implement admin analytics using real order data.
12. [ ] Add Docker Compose and production container builds.
13. [ ] Implement deployment and post-deployment health checks.
14. [ ] Review security, monitoring, backups, and operational documentation.

---

## Final Principle

**Keep business logic independent, responsibilities clear, tests repeatable, database changes controlled, and every merged change verified by CI.**

Build one complete feature at a time, understand the purpose of every layer, and introduce complexity only when the requirements justify it.