# MERN Employee Management System

A full-stack application for managing employee data, built using the **MERN** stack (MongoDB, Express.js, React.js, Node.js). This project includes CRUD functionality, image uploads, and secure authentication.

---

## Features

- **Authentication**: Secure user authentication with JWT.
- **CRUD Operations**: Create, read, update, and delete employee details.
- **File Uploads**: Image uploads for employee profiles (JPEG/PNG supported).
- **Responsive UI**: Built with Material-UI for modern design.
- **Backend Validation**: Data validation using Joi and Mongoose.
- **Role-based Access**: Restrict actions based on user roles.

---

## Tech Stack

### Frontend
- **React.js**: Frontend library for building the user interface.
- **Material-UI**: Component library for styling.

### Backend
- **Node.js**: Backend runtime environment.
- **Express.js**: Backend web framework.
- **Mongoose**: MongoDB object modeling tool.
- **JWT**: For secure authentication.

### Database
- **MongoDB**: NoSQL database for storing employee data.

---

## Installation and Setup

### Prerequisites

- Node.js (v14 or above)
- MongoDB (local or cloud instance)

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AnshAg111/mern-employee-management.git

2. **Install the dependencies**:

    ```bash
    cd backend
    yarn install

3.  ```bash
    cd ../frontend
    yarn install

4. **Setup Environment Variables**:
    Create a .env file in the config folder inside the backend folder with the following:

    PORT=8000
    MONGO_URI=your-mongodb-uri
    JWT_SECRET=your-jwt-secret

5. **Start the development servers**:

    Backend:
    ```bash
    cd backend
    yarn run dev

6.  Frontend:
    ```bash
    cd ../frontend
    yarn start

7. **Access the app**: Open your browser and navigate to http://localhost:3000



