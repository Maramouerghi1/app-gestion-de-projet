const express = require("express");
const db = require("../db");
const router = express.Router();

// Middleware pour vérifier si l'utilisateur est administrateur
function isAdmin(req, res, next) {
  const utilisateur = req.user; // L'utilisateur connecté
  if (utilisateur.role !== "admin") {
    return res.status(403).json({
      message:
        "Accès refusé. Seul un administrateur peut effectuer cette action.",
    });
  }
  next();
}

// Consulter la liste des demandeurs
router.get("/demandeurs", isAdmin, (req, res) => {
  const query = 'SELECT * FROM utilisateur WHERE role = "demandeur"';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Erreur interne", error: err });
    }
    res.status(200).json({ demandeurs: results });
  });
});

// Bloquer un demandeur (changer est_bloque à TRUE)
router.put("/demandeurs/bloquer", isAdmin, (req, res) => {
  const { mail } = req.params;
  const query =
    'UPDATE utilisateur SET est_bloque = TRUE WHERE mail = ? AND role = "demandeur"';
  db.query(query, [mail], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur interne", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Demandeur non trouvé" });
    }
    res.status(200).json({ message: "Demandeur bloqué avec succès" });
  });
});

// Débloquer un demandeur (changer est_bloque à FALSE)
router.put("/demandeurs/debloquer", isAdmin, (req, res) => {
  const { mail } = req.params;
  const query =
    'UPDATE utilisateur SET est_bloque = FALSE WHERE mail = ? AND role = "demandeur"';
  db.query(query, [mail], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur interne", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Demandeur non trouvé" });
    }
    res.status(200).json({ message: "Demandeur débloqué avec succès" });
  });
});

// Rechercher des demandeurs par nom, prénom ou email
router.get("/demandeurs/recherche", isAdmin, (req, res) => {
  const { nom, prenom, email } = req.query;

  let query = 'SELECT * FROM utilisateur WHERE role = "demandeur"';
  const params = [];

  if (nom) {
    query += " AND nom LIKE ?";
    params.push(`%${nom}%`);
  }
  if (prenom) {
    query += " AND prenom LIKE ?";
    params.push(`%${prenom}%`);
  }
  if (email) {
    query += " AND email LIKE ?";
    params.push(`%${email}%`);
  }

  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Erreur interne", error: err });
    }
    res.status(200).json({ demandeurs: results });
  });
});

module.exports = router;
