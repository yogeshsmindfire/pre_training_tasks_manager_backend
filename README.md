# Task Manager API

This is the backend server for a Task Manager application. It allows users to register, log in, and manage their tasks.

## Features

- User registration and authentication (JWT-based)
- Create, Read, Update, and Delete (CRUD) operations for tasks
- Tasks have a title, description, and status (pending, in-progress, completed)
- Users can only access their own tasks

## Folder Structure

```
d:\Pre-training\Tasks\pre_training_tasks_manager_backend\
├───.gitignore
├───.prettierignore
├───.prettierrc.json
├───eslint.config.js
├───nodemon.json
├───package-lock.json
├───package.json
├───tsconfig.json
├───.git\...
├───.husky\
│   ├───pre-commit
│   └───_\
├───.vscode\
│   └───launch.json
├───node_modules\...
└───src\
    ├───server.ts
    ├───worker.ts
    ├───constants\
    │   └───constants.ts
    ├───controllers\
    │   ├───authController.ts
    │   └───taskController.ts
    ├───cron\
    │   └───taskNotifier.ts
    ├───middleware\
    │   └───authMiddleware.ts
    ├───models\
    │   ├───Task.ts
    │   ├───User.interface.ts
    │   └───User.ts
    └───routes\
        ├───authRoutes.ts
        └───taskRoutes.ts
```

## Local Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd tasks-server
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file** in the root of the project and add the following environment variables:
    ```
    PORT=3000
    MONGO_URI=<your-mongodb-connection-string>
    JWT_SECRET=<your-jwt-secret>
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This will start the server with nodemon, which will automatically restart the server on file changes.

5.  **Build the project:**
    ```bash
    npm run build
    ```
    This will transpile the TypeScript code to JavaScript in the `build` directory.

6.  **Start the production server:**
    ```bash
    npm start
    ```

### Scripts

-   `start`: Starts the production server.
-   `prestart`: Runs `npm run build` before starting the server.
-   `build`: Transpiles TypeScript to JavaScript.
-   `prebuild`: Runs `npm run lint` before building.
-   `dev`: Starts the development server with nodemon.
-   `lint`: Lints the TypeScript files in `src`.
-   `lint:fix`: Fixes linting errors automatically.
-   `format`: Formats the code with Prettier.

## API Endpoints

### Authentication (`/api/auth`)

-   `GET /login`: Check if user is authenticated.
-   `POST /login`: Log in a user.
    -   **Body:** `{ "email": "user@example.com", "password": "password123" }`
-   `POST /register`: Register a new user.
    -   **Body:** `{ "name": "Test User", "email": "user@example.com", "password": "password123" }`
-   `POST /logout`: Log out a user.
-   `POST /verify`: Verify JWT token.

### Tasks (`/api/tasks`)

All task routes require authentication.

-   `GET /`: Fetch all tasks for the logged-in user.
-   `POST /`: Create a new task.
    -   **Body:** `{ "title": "New Task", "description": "Task description" }`
-   `POST /:taskId`: Update a task.
    -   **Body:** `{ "title": "Updated Title", "description": "Updated description", "status": "in-progress" }`
-   `DELETE /:taskId`: Delete a task.
