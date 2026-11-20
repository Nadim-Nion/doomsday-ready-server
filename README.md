# 🚀 Doomsday Ready — Backend

A RESTful backend for **Doomsday Ready**, a movie rewatch planning application built for MCU fans preparing for Avengers: Doomsday.

The backend is built with Node.js, Express.js, MongoDB, Mongoose, and TypeScript, following a modular and maintainable architecture.

Currently, **Feature 1: Movies and Rewatch Order** has been implemented. The application allows users to manage movies, define prerequisite relationships, detect circular dependencies, and generate an ordered rewatch plan.

---

## 📦 Tech Stack

- **Node.js** — JavaScript runtime
- **Express.js** — REST API framework
- **MongoDB** — NoSQL database
- **Mongoose** — MongoDB Object Document Mapper (ODM)
- **TypeScript** — Type-safe development
- **Zod** — Request validation (where implemented)

---

## 📌 Implemented Features

### Feature 1: Movies and Rewatch Order

- Create movies with a unique title, release year, and runtime.
- Define prerequisite movies that should be watched first.
- Retrieve all movies with their prerequisite information.
- Update movie information and watched status.
- Update prerequisite relationships.
- Prevent direct and indirect circular dependencies.
- Generate a rewatch order using graph traversal.
- Ensure every prerequisite movie appears exactly once.
- Exclude the selected target movie from its own rewatch order.
- Calculate the number of watched prerequisite movies.
- Calculate the total runtime of unwatched prerequisite movies.

### Feature 2: Cinemas and Watch-Party Booking

- Not implemented yet.

---

## 📌 AI Tools and Development Assistance

I used AI-powered development tools, including ChatGPT and AI coding assistants, as supporting tools throughout the development process.

My use of AI included:

- **Understanding requirements:** Getting help interpreting the assessment requirements, identifying expected functionality, and breaking down complex tasks into smaller implementation steps.
- **Boilerplate generation:** Using AI assistance to generate and understand initial project boilerplate and repetitive setup code.
- **Algorithm understanding:** Exploring unfamiliar algorithms and understanding their concepts, logic, possible approaches, and time and space complexity before implementing them.
- **Debugging and learning:** Using AI assistance to understand errors, investigate potential solutions, and improve my understanding of the technologies used.

AI tools were used as learning and development aids, not as a replacement for understanding the implementation. I reviewed and evaluated the generated suggestions and adapted them to the project's requirements.

The core business logic and algorithmic implementation for the Movie and Rewatch Order feature were developed as part of my own implementation. I remain responsible for understanding and explaining the code submitted in this project.

---

## 📁 Project Structure

```text
src/
│
├── app/
│   ├── builder/
│   │   └── QueryBuilder.ts
│   │
│   ├── config/
│   │   └── index.ts
│   │
│   ├── db/
│   │   └── index.ts
│   │
│   ├── errors/
│   │   ├── AppError.ts
│   │   ├── handleCastError.ts
│   │   ├── handleDuplicateError.ts
│   │   ├── handleValidationError.ts
│   │   └── handleZodError.ts
│   │
│   ├── interface/
│   │   ├── error.ts
│   │   └── index.d.ts
│   │
│   ├── middlewares/
│   │   ├── auth.ts
│   │   ├── globalErrorHandler.ts
│   │   ├── notFound.ts
│   │   └── validateRequest.ts
│   │
│   ├── modules/
│   │   ├── academicSemester/
│   │   ├── student/
│   │   ├── user/
│   │   └── movie/
│   │       ├── movie.constant.ts
│   │       ├── movie.controller.ts
│   │       ├── movie.interface.ts
│   │       ├── movie.model.ts
│   │       ├── movie.route.ts
│   │       ├── movie.service.ts
│   │       └── movie.validation.ts
│   │
│   ├── routes/
│   │   └── index.ts
│   │
│   ├── utils/
│   │   ├── catchAsync.ts
│   │   ├── sendEmail.ts
│   │   ├── sendImageToCloudinary.ts
│   │   └── sendResponse.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── .env
├── .env.example
├── .gitignore
├── .prettierrc
├── eslint.config.ts
├── package.json
├── package-lock.json
└── tsconfig.json
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/Nadim-Nion/express-project-setup.git

cd express-project-setup
```

### 2. Install dependencies

```bash
npm install
```

If setting up the project from scratch, install the required dependencies:

```bash
npm install bcrypt cloudinary cookie-parser cors dotenv express http-status jsonwebtoken mongoose multer nodemailer validator zod
```

Development dependencies:

```bash
npm install -D @eslint/js @types/bcrypt @types/cookie-parser @types/cors @types/eslint__js @types/express @types/jsonwebtoken @types/multer @types/nodemailer @types/validator eslint globals jiti prettier tsx typescript typescript-eslint
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=5000
DATABASE_URL=mongodb://127.0.0.1:27017/doomsday-ready
```

Refer to `.env.example` for the required environment variable structure.

---

## ▶️ Running the Application

### Development mode

```bash
npm run start:dev
```

### Production build

```bash
npm run build
npm run start:prod
```

---

## 🧪 Available Scripts

```bash
npm run start:dev   # Run in development mode with hot reload
npm run build       # Compile TypeScript into JavaScript
npm run start:prod  # Run the compiled application
npm run lint        # Run ESLint
npm run lint:fix    # Automatically fix lint issues
npm run format      # Format code using Prettier
```

---

## 🎬 Feature 1: Movies and Rewatch Order

### Movie Data Model

Each movie contains the following properties:

| Field           | Type       | Description                                         |
| --------------- | ---------- | --------------------------------------------------- |
| `_id`           | ObjectId   | Unique movie identifier                             |
| `title`         | String     | Unique movie title                                  |
| `releaseYear`   | Number     | Movie release year                                  |
| `runtime`       | Number     | Runtime in minutes (1–300)                          |
| `prerequisites` | ObjectId[] | References to prerequisite movies                   |
| `watched`       | Boolean    | Whether the movie has been watched (default: false) |
| `createdAt`     | Date       | Creation timestamp                                  |
| `updatedAt`     | Date       | Last update timestamp                               |

### Prerequisite Relationships

Movies can depend on other movies through MongoDB ObjectId references.

For example:

```text
Iron Man ───────────────┐
                        ├── The Avengers
Captain America: TFA ───┘
                              │
                              ▼
                       Civil War
```

The `prerequisites` field stores the IDs of movies that must be watched before the current movie.

A movie can have multiple prerequisites, and the same prerequisite can be shared by multiple movies.

### Circular Dependency Detection

A movie must never depend on itself, either directly or indirectly.

The application uses **Depth-First Search (DFS)** to detect circular dependencies.

Two sets are used during traversal:

- `visiting`: Tracks movies currently being explored.
- `visited`: Tracks movies that have already been completely explored.

If DFS encounters a movie that is already in the `visiting` set, a circular dependency exists.

The API rejects such create or update operations with:

- HTTP Status: `409 Conflict`
- Error Code: `CIRCULAR_DEPENDENCY`

### Rewatch Order Generation

The rewatch order is generated using DFS-based topological traversal.

The algorithm:

1. Starts from the selected target movie.
2. Recursively explores its prerequisites.
3. Traverses the prerequisites of those movies.
4. Uses a visited set to prevent duplicate entries.
5. Adds each movie after exploring all its prerequisites.
6. Excludes the target movie from the final result.

This ensures every prerequisite appears before the movie that depends on it.

**Time Complexity:** O(V + E), where V is the number of movies and E is the number of prerequisite relationships.

### Rewatch Statistics

The rewatch-order endpoint also returns:

- Total number of prerequisite movies.
- Number of watched prerequisite movies.
- Number of unwatched prerequisite movies.
- Total runtime of unwatched prerequisite movies.

---

## 🔗 API Documentation

**Base URL**

```text
http://localhost:5000/api/v1
```

### 1. Create a Movie

**Endpoint**

```http
POST /movies
```

**Request Body**

```json
{
  "title": "The Avengers",
  "releaseYear": 2012,
  "runtime": 143,
  "prerequisites": ["IRON_MAN_OBJECT_ID", "CAPTAIN_AMERICA_OBJECT_ID"]
}
```

**Description**

Creates a new movie with optional prerequisite movie references.

The `watched` property defaults to `false`.

**Success Response:** `201 Created`

### 2. Get All Movies

**Endpoint**

```http
GET /movies
```

**Description**

Retrieves all movies along with their populated prerequisite information.

**Success Response:** `200 OK`

### 3. Update a Movie

**Endpoint**

```http
PATCH /movies/:id
```

**Request Body Example**

```json
{
  "watched": true
}
```

Prerequisites and other movie information can also be updated.

The API validates prerequisite changes and rejects updates that would introduce circular dependencies.

**Success Response:** `200 OK`

### 4. Get Rewatch Order

**Endpoint**

```http
GET /movies/:id/rewatch-order
```

**Description**

Returns all transitive prerequisites of the selected movie in a valid topological order.

The target movie itself is excluded.

**Example Response**

```json
{
  "success": true,
  "data": {
    "targetMovie": {
      "_id": "TARGET_MOVIE_ID",
      "title": "Avengers: Doomsday"
    },
    "totalPrerequisites": 7,
    "watchedCount": 2,
    "unwatchedCount": 5,
    "totalRuntime": 746,
    "movies": [
      {
        "_id": "IRON_MAN_ID",
        "title": "Iron Man",
        "releaseYear": 2008,
        "runtime": 126,
        "watched": true
      },
      {
        "_id": "CAPTAIN_AMERICA_ID",
        "title": "Captain America: The First Avenger",
        "releaseYear": 2011,
        "runtime": 124,
        "watched": true
      }
    ]
  }
}
```

_Note: The response above illustrates the response structure; the movie array is shortened for readability._

**Success Response:** `200 OK`

---

## ⚠️ Validation and Error Handling

The movie module handles the following validation scenarios:

| Scenario                               | Expected HTTP Status |
| -------------------------------------- | -------------------- |
| Duplicate movie title                  | 409 Conflict         |
| Invalid movie ID                       | 400 Bad Request      |
| Nonexistent movie                      | 404 Not Found        |
| Invalid prerequisite ID                | 400 Bad Request      |
| Duplicate prerequisite references      | 400 Bad Request      |
| Movie depends on itself                | 409 Conflict         |
| Direct or indirect circular dependency | 409 Conflict         |
| Invalid runtime                        | 400 Bad Request      |

Circular dependency errors use the following error code:

```json
{
  "success": false,
  "code": "CIRCULAR_DEPENDENCY",
  "message": "This dependency would create a circular dependency"
}
```

The application uses centralized error-handling middleware to process application errors, Mongoose errors, and duplicate-key errors.

---

## 🛠️ Architecture and Design

The backend follows a modular architecture with separation of concerns:

| Layer       | Responsibility                          |
| ----------- | --------------------------------------- |
| Routes      | Define API endpoints                    |
| Controllers | Handle HTTP requests and responses      |
| Services    | Implement business logic and algorithms |
| Models      | Define MongoDB schemas                  |
| Validations | Validate incoming request data          |
| Middlewares | Handle request processing and errors    |

This structure keeps the movie business logic separate from HTTP handling and database schema definitions.

---

## 🧪 Testing

The movie feature should be tested against the following scenarios:

- Create a movie without prerequisites.
- Create a movie with multiple prerequisites.
- Reject duplicate movie titles.
- Update movie details and watched status.
- Reject invalid prerequisite references.
- Reject direct circular dependencies.
- Reject indirect circular dependencies.
- Generate an empty rewatch order when a movie has no prerequisites.
- Include shared prerequisites exactly once.
- Exclude the target movie from its rewatch order.
- Ensure prerequisites appear before dependent movies.
- Calculate watched count correctly.
- Calculate unwatched runtime correctly.

API endpoints can be tested using Postman.

---

## 🔐 Environment Variables

| Variable       | Description               |
| -------------- | ------------------------- |
| `PORT`         | Application server port   |
| `DATABASE_URL` | MongoDB connection string |

Never commit your actual `.env` file or database credentials to version control.

---

## 🗺️ Future Development

The following functionality is planned but not yet implemented:

- Cinema management.
- Cinema bundle configuration.
- Minimum bundle calculation using Dynamic Programming.
- Watch-party booking recommendations.
- Additional automated tests.
- Further performance and concurrency improvements.

---

## 🤝 Contributing

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Implement your changes.
4. Submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.

---

## ✨ Author

**Nadim Mahmud Nion**

Full Stack (MERN) Developer

[GitHub](https://github.com/Nadim-Nion) · [Portfolio](https://nion-portfolio.netlify.app/)
