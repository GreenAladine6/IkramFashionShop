# IkramFashionShop 👗

A full-stack fashion e-commerce platform with a public storefront, customer accounts, shopping cart, order history, and an administrative dashboard for managing products, inventory, orders, and business revenue.

The project is designed as a hands-on software engineering learning experience using **Python, FastAPI, React, PostgreSQL, Docker, and GitHub Actions CI/CD**.

## 📌 Project Status

**Status:** Planning / Initial Development

**Project type:** Full-stack e-commerce application

**Main objective:** Build a production-oriented application while practicing Python backend development, React frontend development, database design, API integration, automated testing, containerization, and deployment.

## 🎯 Objectives

- Refresh Python fundamentals through practical backend development.
- Build REST APIs using FastAPI.
- Create a responsive React frontend based on Figma designs.
- Implement secure authentication and role-based authorization.
- Design and manage a relational database using PostgreSQL.
- Develop customer and administrator dashboards.
- Calculate business metrics from real order data.
- Containerize the application using Docker and Docker Compose.
- Automate testing and quality checks using GitHub Actions.
- Implement a CI/CD pipeline for deployment.
- Document technical decisions and development progress.

## 🛍️ Main Features

### 1. Public Storefront

- Home page with featured products and collections.
- Product catalog with categories and filters.
- Product details, prices, sizes, colors, and available stock.
- Search and sorting.
- Shopping cart and quantity management.
- Checkout and order creation.
- Responsive layout for mobile, tablet, and desktop.

### 2. Customer Account

- Registration, login, and logout.
- Profile management.
- Address management.
- Persistent shopping cart.
- Order history and order details.
- Order status tracking.
- Access to only the authenticated customer's own data.

### 3. Admin Dashboard

- Overview of sales and business performance.
- Revenue and order statistics.
- Product and category management.
- Inventory and stock management.
- Customer management.
- Order management and status updates.
- Sales charts and best-selling products.
- Date-based reporting and filtering.

**Important:** Revenue statistics must be calculated from actual database records, not hardcoded values. Revenue, order totals, and profit are different metrics; profit will require product cost data.

### 4. Authentication and Authorization

Two main roles will be implemented:

- **CUSTOMER:** Access the public storefront, personal profile, cart, and own orders.
- **ADMIN:** Access administrative features, product management, order management, and business analytics.

The backend must enforce permissions independently of the frontend. Hiding an admin page in React is not sufficient authorization.

### 5. DevOps and Deployment

- Docker containers for the frontend, backend, and database.
- Docker Compose for local development.
- Automated tests with GitHub Actions.
- Backend linting and code quality checks.
- Frontend linting and build validation.
- Docker image build validation.
- Environment-based configuration.
- Automated deployment after the CI pipeline is successful.

## 🧰 Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript |
| Build tool | Vite |
| UI design | Figma |
| Styling | CSS or Tailwind CSS |
| Backend | Python + FastAPI |
| API format | REST + JSON |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| Migrations | Alembic |
| Validation | Pydantic |
| Authentication | Secure password hashing + JWT or secure sessions |
| Backend testing | Pytest + HTTPX |
| Frontend testing | Vitest + React Testing Library |
| API documentation | FastAPI / OpenAPI |
| Version control | Git + GitHub |
| Containerization | Docker + Docker Compose |
| CI/CD | GitHub Actions |
| Deployment | To be decided |

Additional technologies will be introduced when needed rather than adding unnecessary complexity at the beginning.

## 🏗️ Proposed Architecture

The frontend communicates with the backend through HTTP requests. The backend validates requests, enforces permissions, applies business rules, and accesses PostgreSQL.

```text
                    Customers / Admin
                           |
                           v
                   React + TypeScript
                      (Vite frontend)
                           |
                       REST API
                           |
                           v
                    FastAPI Backend
                           |
              +------------+------------+
              |            |            |
              v            v            v
          Routers       Services      Schemas
              |            |
              +------------+
                           |
                           v
                       SQLAlchemy
                           |
                           v
                       PostgreSQL

GitHub Repository --> GitHub Actions --> Tests / Build
                                         |
                                         v
                                    Deployment
```

### Architectural principles

- Keep HTTP routes separate from business logic.
- Validate inputs and outputs using Pydantic.
- Keep database access organized through SQLAlchemy.
- Use Alembic to track database schema changes.
- Store secrets in environment variables, never in source code.
- Use centralized error handling and meaningful HTTP status codes.
- Keep frontend components reusable and organized by feature.
- Never trust client-supplied prices or administrative permissions.
- Use database transactions for order creation and stock updates.

## 📂 Proposed Repository Structure

```text
ikram-fashion-shop/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── core/
│   │   ├── api/
│   │   │   └── v1/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── db/
│   │   └── utils/
│   ├── tests/
│   ├── alembic/
│   ├── alembic.ini
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── types/
│   │   └── App.tsx
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
│
├── docs/
│   ├── requirements.md
│   ├── architecture.md
│   ├── database-design.md
│   ├── api-documentation.md
│   ├── figma-design.md
│   ├── development-log.md
│   └── decisions/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

This is the target structure, not a requirement to create every file on day one. We will introduce directories as the application grows.

## 🗄️ Initial Database Design

The following entities are planned:

| Entity | Purpose |
|---|---|
| User | Customer and administrator accounts |
| Address | Customer shipping addresses |
| Category | Product categorization |
| Product | Product descriptions, prices, and details |
| ProductVariant | Size, color, SKU, and variant-specific stock |
| Cart | A customer's active shopping cart |
| CartItem | Products and quantities in a cart |
| Order | Customer purchase and order status |
| OrderItem | Purchased products, quantities, and price snapshots |
| Payment | Payment provider reference and payment status |

Additional entities may be introduced for promotions, product images, inventory movements, and audit logs.

### Important data rules

- Store money using a suitable decimal database type, never floating-point arithmetic.
- Store the purchase price in each order item so historical orders remain accurate after a product price changes.
- Calculate order totals on the backend.
- Validate stock before confirming an order.
- Use database transactions to protect stock and order consistency.
- Keep payment records separate from order records.
- Never store raw card details.
- Protect customer data through ownership checks.

## 📊 Business Metrics

The admin dashboard will progressively calculate:

- **Total revenue:** Sum of qualifying paid orders, minus any applicable refunds.
- **Number of orders:** Count of orders within the selected period and relevant statuses.
- **Average order value:** Qualifying revenue divided by the number of qualifying orders.
- **Products sold:** Total qualifying quantities sold.
- **Best-selling products:** Products ranked by units sold or revenue.
- **Inventory value:** Available stock multiplied by the selected unit-cost basis.
- **Profit:** Revenue minus relevant product costs and other costs, once those costs are modeled.

Metric definitions and order statuses must be documented to avoid inconsistent calculations. Cancelled or unpaid orders must not automatically count as realized revenue.

## 🗺️ Development Roadmap

### Phase 1 — Planning and Design

- [ ] Define business requirements.
- [ ] Identify customer and admin user journeys.
- [ ] Create the Figma design system.
- [ ] Design storefront and product pages.
- [ ] Design login, registration, and customer account pages.
- [ ] Design the admin dashboard.
- [ ] Draft the database entity-relationship diagram.
- [ ] Document initial architecture decisions.

**Deliverable:** Approved requirements, initial designs, and technical plan.

### Phase 2 — Project Setup

- [ ] Create the GitHub repository.
- [ ] Initialize the FastAPI application.
- [ ] Initialize the React + TypeScript application.
- [ ] Configure PostgreSQL and SQLAlchemy.
- [ ] Configure Alembic migrations.
- [ ] Add environment variable templates.
- [ ] Create initial health-check endpoints.
- [ ] Configure formatting, linting, and tests.
- [ ] Create initial Dockerfiles and Docker Compose configuration.

**Deliverable:** A locally running application with frontend, backend, and database.

### Phase 3 — Backend Foundations

- [ ] Design database models.
- [ ] Implement database migrations.
- [ ] Define request and response schemas.
- [ ] Implement consistent API error handling.
- [ ] Add API versioning.
- [ ] Test the first endpoints using Swagger UI.
- [ ] Write unit and integration tests.

**Deliverable:** A tested backend foundation.

### Phase 4 — Authentication and Accounts

- [ ] Implement registration.
- [ ] Implement secure password hashing.
- [ ] Implement login and logout.
- [ ] Add authorization dependencies.
- [ ] Enforce CUSTOMER and ADMIN roles.
- [ ] Implement profile and address management.
- [ ] Test authentication and authorization failures.

**Deliverable:** Secure account access with role-based permissions.

### Phase 5 — Product Catalog

- [ ] Implement categories and products.
- [ ] Implement product variants and stock.
- [ ] Add product listing and detail endpoints.
- [ ] Add filtering, searching, and pagination.
- [ ] Implement admin product management.
- [ ] Add product image handling.

**Deliverable:** A functional product catalog.

### Phase 6 — Shopping Cart and Orders

- [ ] Implement persistent carts.
- [ ] Add cart item management.
- [ ] Validate product availability and quantities.
- [ ] Implement checkout and order creation.
- [ ] Add order item price snapshots.
- [ ] Implement order status management.
- [ ] Display order history for customers.
- [ ] Test stock and transaction edge cases.

**Deliverable:** A complete order lifecycle.

### Phase 7 — React Storefront

- [ ] Implement reusable UI components.
- [ ] Build the home page and product catalog.
- [ ] Build product detail pages.
- [ ] Connect the frontend to FastAPI.
- [ ] Implement cart interactions.
- [ ] Add customer login and registration.
- [ ] Build profile and order history pages.
- [ ] Implement loading, empty, and error states.
- [ ] Verify responsive layouts against Figma.

**Deliverable:** A working customer-facing application.

### Phase 8 — Admin Dashboard and Analytics

- [ ] Build the admin layout and navigation.
- [ ] Implement product and inventory management.
- [ ] Implement order management.
- [ ] Create revenue and sales aggregation endpoints.
- [ ] Add date-range filters.
- [ ] Display statistics and charts.
- [ ] Validate dashboard calculations against database records.

**Deliverable:** A functional business management dashboard.

### Phase 9 — Docker and CI/CD

- [ ] Containerize the frontend.
- [ ] Containerize the backend.
- [ ] Configure PostgreSQL in Docker Compose.
- [ ] Add health checks and service dependencies.
- [ ] Run the application with a single Compose command.
- [ ] Create GitHub Actions workflows.
- [ ] Run backend tests and frontend checks automatically.
- [ ] Validate production builds.
- [ ] Add deployment configuration.
- [ ] Configure production secrets securely.
- [ ] Deploy to the chosen hosting platform.

**Deliverable:** A reproducible deployment with automated quality checks.

### Phase 10 — Final Validation

- [ ] Test the full customer journey.
- [ ] Test admin authorization.
- [ ] Test invalid inputs and API errors.
- [ ] Test stock consistency and order totals.
- [ ] Review security and dependency vulnerabilities.
- [ ] Verify mobile responsiveness.
- [ ] Document deployment and backup procedures.
- [ ] Prepare screenshots and a project demonstration.

**Deliverable:** A documented, tested, deployable portfolio project.

## 🔄 Git Workflow

Use small, descriptive commits and feature branches.

Example branches:

```text
main
develop
feature/project-setup
feature/authentication
feature/product-catalog
feature/shopping-cart
feature/order-management
feature/admin-dashboard
feature/ci-cd
```

Example commits:

```text
chore: initialize FastAPI application
feat: add user registration endpoint
feat: implement product catalog
test: add order service tests
fix: validate product stock during checkout
ci: add backend test workflow
docs: document database schema
```

Prefer pull requests and automated checks before merging significant changes into `main`.

## 🧪 Quality and Testing Strategy

- **Unit tests:** Validate individual functions and business rules.
- **Integration tests:** Validate API endpoints and database interactions.
- **Authorization tests:** Verify that customers cannot access admin endpoints or another customer's orders.
- **Frontend tests:** Verify component behavior and user interactions.
- **End-to-end tests:** Validate complete journeys such as browsing, adding to cart, and placing an order.
- **CI checks:** Run automated tests, linting, type checking, and build validation on pushes and pull requests.

Tests should cover both successful operations and failure cases.

## 🔐 Security Checklist

- [ ] Never commit `.env` files or real credentials.
- [ ] Maintain a safe `.env.example` with placeholder values.
- [ ] Hash passwords using a suitable password-hashing algorithm.
- [ ] Validate authorization on the backend.
- [ ] Use secure cookie settings or an appropriately designed token strategy.
- [ ] Configure CORS for explicitly allowed origins.
- [ ] Validate and constrain incoming data.
- [ ] Prevent customers from modifying order totals or their own roles.
- [ ] Protect checkout and inventory updates against concurrent requests.
- [ ] Use HTTPS in production.
- [ ] Keep dependencies updated.
- [ ] Configure database backups and secret rotation.

## 📝 Development Log

After every significant work session, record:

- Date
- Objective
- Tasks completed
- Files or modules changed
- Problems encountered
- Solutions and lessons learned
- Tests executed
- Next steps

See [`docs/development-log.md`](docs/development-log.md).

## 🚀 Definition of Done

A feature is complete when:

1. Its requirements are clear.
2. Its backend or frontend implementation is complete.
3. Validation and error handling are implemented.
4. Relevant automated tests pass.
5. Authorization and security have been checked where applicable.
6. The feature is integrated with the rest of the application.
7. Documentation is updated.
8. CI checks pass.

## 📚 Learning Goals

By the end of this project, I aim to be able to:

- Design and implement a structured FastAPI backend.
- Build REST APIs and validate data using Pydantic.
- Model relational data and manage database migrations.
- Develop reusable React + TypeScript components.
- Integrate a frontend with a backend API.
- Implement authentication and authorization.
- Write unit and integration tests.
- Containerize an application with Docker.
- Configure CI/CD with GitHub Actions.
- Deploy and maintain a full-stack application.
- Explain the architecture and technical decisions in a code review or interview.

## 📌 Current Next Steps

1. Finalize the project requirements.
2. Create the GitHub repository.
3. Design the main pages in Figma.
4. Set up the FastAPI and React projects.
5. Connect PostgreSQL.
6. Build the first endpoint and consume it from React.
7. Introduce Docker and automated testing early.

**Development principle:** Build incrementally, understand every important line of code, test each feature, and document decisions as the project evolves.