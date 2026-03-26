Act as a senior full-stack developer.

Help me build a simple web-based Technote Logbook System using:

* Next.js (App Router)
* TypeScript
* Prisma ORM
* PostgreSQL (NeonDB)
* TailwindCSS
* shadcn/ui

---

## 🎯 SYSTEM GOAL

This system will replace a paper-based notebook used by a technician store.

IMPORTANT:
This is NOT a POS system.
Do NOT use add-to-cart or checkout logic.

This system should work like a DIGITAL LOGBOOK where the user manually inputs records.

---

## 🧩 MAIN FEATURES

### 1. Dashboard

* Show:

  * Total Sales Today
  * Total Repairs Today
  * Total Utang Balance
  * Recent Activity

---

### 2. Customers

* Add / Edit / Delete
* Fields:

  * name
  * contact
  * address

---

### 3. Sales (Simple Log Only)

NO CART.

User manually inputs:

* customer (optional)
* description (example: "charger", "screen repair")
* amount
* date

---

### 4. Repairs

* customer
* device
* issue
* service_fee
* status (Pending, Ongoing, Done, Claimed)

---

### 5. Utang (Credit)

* customer
* description
* total_amount
* paid_amount
* balance (auto compute)
* status (Paid / Unpaid)

Allow updating payments later.

---

### 6. Activity Log

* Combine sales, repairs, and utang
* Show latest first
* Mobile-friendly

---

## 🗄️ DATABASE (PRISMA)

Create these models:

* User
* Customer
* Sale
* Repair
* Utang

Rules:

* Keep schema simple
* Use relations
* Add createdAt and updatedAt
* NO SaleItem model

---

## 🎨 UI REQUIREMENTS

* Clean and minimal design
* Mobile-first (very important)
* Use shadcn/ui components:

  * Card
  * Table
  * Dialog
  * Input
  * Button

Layout:

* Sidebar:

  * Dashboard
  * Customers
  * Sales
  * Repairs
  * Utang

---

## ⚙️ DEVELOPMENT RULES

* Use Server Actions
* Use React Server Components by default
* Use Client Components only for forms
* Use TypeScript properly (no "any")
* Keep code clean and modular

---

## 🚀 HOW TO WORK

Build step-by-step in this order:

1. Project setup (Next.js + Tailwind + shadcn + Prisma + NeonDB)
2. Prisma schema
3. Authentication
4. Layout (sidebar)
5. Dashboard
6. Customers
7. Sales
8. Repairs
9. Utang
10. Activity Log

---

## 📌 OUTPUT FORMAT

For every step:

1. Explain briefly
2. Provide COMPLETE code
3. Show how to run/test
4. Wait for my confirmation

---

Start now with STEP 1: Full project setup.
