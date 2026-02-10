# 🚀 Enterprise E-Commerce API

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

A production-ready, scalable E-Commerce backend built with **NestJS**, **GraphQL (Mercurius)**, and **Fastify**. This API is designed to handle complex business logic including role-based access control, inventory management, audit logging, and payment processing.

🔗 **Live Demo (GraphQL Playground):** [https://enterprise-ecommerce-api.onrender.com/graphiql](https://enterprise-ecommerce-api.onrender.com/graphiql)

---

## 🌟 Key Features

* **🛡️ Authentication & Security:**
    * JWT-based Authentication (Access & Refresh Tokens).
    * Role-Based Access Control (RBAC) with `USER` and `ADMIN` roles.
    * Argon2 password hashing.
    * Throttling & Rate Limiting to prevent abuse.
* **📦 Catalog Management:**
    * Create, update, and delete products and categories.
    * Inventory tracking with atomic stock decrements.
    * Rich media support (Image uploads via Cloudinary).
* **🛒 Shopping Experience:**
    * Persistent Shopping Cart (Redis/Database backed).
    * Coupon & Promotion system (Percentage discounts, Expiry logic).
    * Order lifecycle management (Pending -> Paid -> Shipped).
* **💳 Payments:**
    * Stripe Integration for secure checkout.
    * Webhook handling for payment confirmation.
* **🔍 Observability:**
    * **Audit Logging:** Tracks high-risk actions (e.g., Price changes, Coupon creation) with "Who, What, When".
    * Structured Logging with Pino.

---

## 🛠️ Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | NestJS | Modular, scalable Node.js framework. |
| **Language** | TypeScript | Strictly typed for reliability. |
| **API Layer** | GraphQL (Mercurius) | Efficient data fetching with generated types. |
| **Server** | Fastify | High-performance underlying HTTP server. |
| **Database** | MySQL (TiDB Cloud) | Serverless, distributed SQL database. |
| **ORM** | TypeORM | Data mapping and migration management. |
| **Caching/Queues** | Redis | Session storage and background jobs. |
| **File Storage** | Cloudinary | CDN for product images. |
| **Deployment** | Docker & Render | Containerized CI/CD pipeline. |

---

## 📖 API Documentation (GraphQL)

The API is self-documenting via the GraphQL Playground.

**Endpoint:** `POST /graphql`

### Example Query: Fetch Products
```graphql
query GetProducts {
  products {
    id
    name
    price
    stock
    category {
      name
    }
    images {
      url
      isPrimary
    }
  }
}
```
### Example Mutation: Login
```graphql
mutation Login {
  login(loginInput: {
    email: "admin@example.com",
    password: "password123"
  }) {
    accessToken
    user {
      id
      role
    }
  }
}
```
### ☁️ Deployment
This project is configured for seamless deployment on Render.com.