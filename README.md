# Node.js Blogging Application Setup Guide

This guide provides step-by-step instructions for setting up and running the Node.js Blogging Application locally.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js: [Download and Install Node.js](https://nodejs.org/)
- MongoDB: [Download and Install MongoDB](https://www.mongodb.com/try/download/community)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository_url>
cd your-app-name

```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Configuration

- Set up a MongoDB database. If you don't have one, you can create a free account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- Create a `.env` file in the project root.
- Set the following environment variables in the `.env` file:

  ```dotenv
  DATABASE_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<your-database-name>?retryWrites=true&w=majority
  JWT_SECRET=your_jwt_secret_key
  ```

  Replace `<username>`, `<password>`, and `<your-database-name>` with your MongoDB credentials and database name. The `JWT_SECRET` should be replaced with a secure secret key for JWT authentication.

  Ensure the `.env` file is included in your `.gitignore` file to prevent it from being pushed to the repository.

### 4. Run the Application

```bash
npm start
```

The application will run on `http://localhost:3000`.

### 5. Explore API Endpoints

Use a tool like Postman to interact with the API endpoints.

### 6. Testing

#### Unit Tests

Run Jest unit tests:

```bash
npm test
```

#### Performance Testing

Explore performance testing using k6:

```bash
k6 run path/to/performance/test.js
```


**Additional Notes**

Blog Recommendation Controller:

Challenges:
- Implementing TF-IDF for content-based recommendations was initially complex.
- Ensuring efficiency with a large number of blog posts.

Approach: 
- Proactively learned TF-IDF, grasping its role in content-based recommendation.
- Asynchronous processing optimized performance for similarity calculation.

Performance Testing with k6:

Challenges:
- First-time experience with performance testing.
- Overcoming the learning curve of k6 scripting.

Approach:
- Leveraged YouTube tutorials to grasp k6 and performance testing concepts.
