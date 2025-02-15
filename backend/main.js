import express from "express";
import cors from "cors";
import WohozoRoutes from "./routes/wohozo.route.js";
import connectDB from "./lib/db.js";
import bodyParser from "body-parser";

// const formRoutes = require("./routes/router");
const app = express();
const PORT = 6969;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.json());
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true }));
// Connect to the database
connectDB();

// Mount routes
app.use("/", WohozoRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
