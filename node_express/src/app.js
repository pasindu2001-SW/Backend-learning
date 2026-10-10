import express from "express";

const app = express();  // create an express app

app.use(express.json());

//routes imports
import userRoutes from './routes/user.route.js';
import postRoutes from './routes/post.router.js';

//routes definition
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/posts', postRoutes);

//example route http://localhost:3000/api/v1/users/register

export default app;