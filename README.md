# Mental Health Support Platform (Backend)

A secure backend API built to support mental health services, user management, and therapy scheduling. 

api: rest api for uploading files + graphql api

## 🚀 Features

### Implemented
- **Authentication System**: Secure user signup and login using **JWT** (JSON Web Tokens) and **bcrypt** password hashing.
- **Role-Based Access**: Schemas designed to support distinct user roles (Patients, Therapists).
- **Database Architecture**: Relational database models and migrations built with **PostgreSQL**.
**PHQ9 screening**: for patients for depression screening
**file uploads** : using multer and save in server for verifying therapists crendentials
**Therapist recommendation enginer**: top ranked therapists are recommended using TF IDF algorithm 

### Upcoming
- Appointment booking and management
- booking consultations

---

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (Sequelize ORM)
- **Authentication**: JWT, Bcrypt
-**file upload** :multer
---

## ⚙️ Getting Started

### Prerequisites
- Node.js installed on your system
- PostgreSQL installed and running locally

### Installation

 **Clone the repository:**
Navigate to the server directory:
cd Mental-Health-Support-Platform/server

Install dependencies:
npm install

Set up environment variables:
Create a .env file in the root folder adhering to .env.example  with your environment configuration (database credentials, secrets, port, etc.).
