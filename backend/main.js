import express from "express";
import cors from "cors";
import WohozoRoutes from "./routes/wohozo.route.js";
import connectDB from "./lib/db.js";

const app = express();
const PORT = 6969;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.json());

// Connect to the database
connectDB();

// Mount routes
app.use("/", WohozoRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
