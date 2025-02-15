import express from "express";
import cors from "cors";
import WohozoRoutes from "./routes/wohozo.route.js";
import connectDB from "./lib/db.js";
import bodyParser from "body-parser";

// const formRoutes = require("./routes/router");
const app = express();
const PORT = 6969;

// Middleware
const allowedOrigins = [
  "http://localhost:3000", // Local Development
  "https://wohozocreator-4n1qgruj0-nagarajas-projects.vercel.app", // Vercel Deployment
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Needed for cookies/authentication
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
