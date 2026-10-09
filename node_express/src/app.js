import express from "express";

const app = express();  // create an express app

app.use(express.json());

export default app;