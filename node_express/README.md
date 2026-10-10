# Node Express Learning Project

This project is a simple Express.js backend created to learn how to build a REST API with Node.js, Express, and MongoDB using Mongoose.

## What I have done

- Set up an Express server with JSON request parsing.
- Created a modular project structure using `src/config`, `src/controllers`, `src/models`, and `src/routes`.
- Connected the app to MongoDB using Mongoose.
- Built a `User` model with:
  - username, email, and password fields
  - unique validation for username and email
  - password hashing before saving
  - password comparison for login checks
- Implemented user authentication endpoints:
  - `POST /api/v1/users/register`
  - `POST /api/v1/users/login`
  - `POST /api/v1/users/logout`
- Built a `Post` model with name, description, and age fields.
- Implemented basic post CRUD endpoints:
  - `POST /api/v1/posts/create`
  - `GET /api/v1/posts/all`
  - `PATCH /api/v1/posts/update/:id`
  - `DELETE /api/v1/posts/delete/:id`
- Added validation and error handling for invalid requests and duplicate records.
- Used environment variables for database connection and server configuration.

## Project structure

```text
node_express/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── user.contollers.js
│   │   └── post.controller.js
│   ├── models/
│   │   ├── user.model.js
│   │   └── post.model.js
│   ├── routes/
│   │   ├── user.route.js
│   │   └── post.router.js
│   ├── app.js
│   └── index.js
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Technologies used

- Node.js
- Express.js
- MongoDB
- Mongoose
- dotenv
- bcryptjs
- nodemon

## Environment variables

Create a `.env` file in this folder with values like:

```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017/your_database_name
```

## Run the project

```bash
npm install
npm run dev
```

The server will start on the port defined in the `.env` file or default to `8000`.

## Notes

This project is mainly for learning backend development patterns such as routing, controllers, models, validation, database connection, and REST API creation.
