const express = require("express");
const router = express.Router();
const db = require("../db");

// Middleware pour vérifier si l'utilisateur est un demandeur
function isdemandeur(req, res, next) {
  if (!req.user || req.user.role !== "demandeur") {
    return res.status(403).json({ message: "Accès refusé" });
  }
  next();
}

// Ajouter une demande
router.post("/ajouterD", isdemandeur, (req, res) => {
  const { titre } = req.body;

  // Vérifier si le titre est bien fourni
  if (!titre || titre.trim() === "") {
    return res.status(400).json({ message: "Le titre est requis" });
  }

  const date = new Date().toISOString().slice(0, 10); // Format YYYY-MM-DD

  const sql = "INSERT INTO demande (titre, date) VALUES (?, ?)";
  db.query(sql, [titre, date], (err, result) => {
    if (err) {
      console.error("Erreur lors de l'ajout de la demande :", err);
      return res.status(500).json({ message: "Erreur serveur" });
    }
    res.status(201).json({ message: "Demande envoyée avec succès !" });
  });
});

module.exports = router;
