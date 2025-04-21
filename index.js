const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql");
const authRoutes = require("./routes/auth");
const employeRoutes = require("./routes/employes");
const adminRoutes = require("./routes/AdminRoutes");
const demandeurRoutes = require("./routes/Demandeur");

const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connexion à MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "pfe",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Erreur de connexion MySQL :", err);
    process.exit(1); // Arrête l'application en cas d'erreur de connexion à la base
  }
  console.log("✅ Connecté à la base de données MySQL !");
});
// Middleware temporaire pour simuler un utilisateur connecté (admin)
app.use((req, res, next) => {
  // Simule un utilisateur connecté administrateur
  req.user = {
    id: 1,
    email: "admin@example.com",
    role: "admin", // ← c’est ce que ton middleware `isAdmin` vérifie
  };
  next();
});

// Routes
app.get("/", (req, res) => {
  res.json({ message: "API is working!" });
});
app.use("/api/auth", authRoutes);
app.use(". api/employes", employeRoutes);
app.use(". api/admin", adminRoutes);
app.use("/api", demandeurRoutes);

// Démarre le serveur
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
