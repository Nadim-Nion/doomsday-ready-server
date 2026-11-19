# 🚀 Doomsday Ready (Backend)

---

A scalable and production-ready backend starter template built with Express.js, Node.js, MongoDB, Mongoose, and TypeScript. This boilerplate is designed to help developers quickly kickstart RESTful API development with a well-structured and maintainable architecture.

---

## 📦 Tech Stack

- Node.js – JavaScript runtime
- Express.js – Web framework for building APIs
- MongoDB – NoSQL database
- Mongoose – ODM for MongoDB
- TypeScript – Strongly typed JavaScript

---

## 📁 Project Structure

```bash
dist/
node_modules/
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
│   │   └── user/
│   │       ├── user.constant.ts
│   │       ├── user.controller.ts
│   │       ├── user.interface.ts
│   │       ├── user.model.ts
│   │       ├── user.route.ts
│   │       ├── user.service.ts
│   │       ├── user.utils.ts
│   │       └── user.validation.ts
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
git clone https://github.com/Nadim-Nion/express-project-setup
cd express-project-setup
```

### 2. Install dependencies

```bash
npm install bcrypt cloudinary cookie-parser cors dotenv express http-status jsonwebtoken mongoose multer nodemailer validator zod

npm install -D @eslint/js @types/bcrypt @types/cookie-parser @types/cors @types/eslint__js @types/express @types/jsonwebtoken @types/multer @types/nodemailer @types/validator eslint globals jiti prettier tsx typescript typescript-eslint
```

### 3. Create environment file

Create a .env file in the root directory and add:

```bash
PORT=5000
DATABASE_URL=mongodb://127.0.0.1:27017/your-db-name
```

Follow .env.example file to know about the .env structure

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

## 🧪 Scripts

```bash
npm run start:dev     # Run in development mode with hot reload
npm run build         # Compile TypeScript to JavaScript
npm run start:prod    # Run compiled app
npm run lint          # Run ESLint
npm run lint:fix      # Fix lint issues
npm run format        # Format code using Prettier
```

---

## 🛠️ Features

- Modular architecture for scalability
- Type-safe development with TypeScript
- Centralized error handling
- Environment-based configuration
- Clean and maintainable folder structure
- MongoDB integration using Mongoose
- Middleware support (auth, validation, etc.)

---

## ⚠️ Error Handling

This project includes a centralized error handling mechanism:

- Custom error classes
- Global error handler middleware
- Validation error formatting (e.g., Zod or Mongoose)

---

## 🔐 Environment Variables

| Variable       | Description               |
| -------------- | ------------------------- |
| `PORT`         | Application running port  |
| `DATABASE_URL` | MongoDB connection string |

---

## 📌 API Base URL

```bash
http://localhost:<PORT>/api/v1
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Fork the repository
- Create a new branch
- Submit a pull request

---

## 📄 License

This project is licensed under the MIT License.

---

## ✨ Author

Nadim Mahmud Nion <br />
Full Stack (MERN) Developer
