const express = require("express");
const db = require("../db");
const router = express.Router();

// Vérifie si l'utilisateur est administrateur
function isAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Accès refusé" });
  }
  next();
}

// Liste des employés (chefs de projet et membres d’équipe)
router.get("/", isAdmin, (req, res) => {
  const query = `
    SELECT * FROM utilisateur
    WHERE role IN ('chef_de_projet', 'membre_equipe')
  `;
  db.query(query, (err, results) => {
    if (err)
      return res.status(500).json({ message: "Erreur interne", error: err });
    res.status(200).json({ employes: results });
  });
});

// Ajouter un employé
router.post("/", isAdmin, (req, res) => {
  const { nom, prenom, adresse, tel, mail, password, role } = req.body;

  if (!["chef_de_projet", "membre_equipe"].includes(role)) {
    return res.status(400).json({ message: "Rôle invalide pour un employé" });
  }

  const query = `
    INSERT INTO utilisateur (nom, prenom, adresse, tel, mail, password, role)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(
    query,
    [nom, prenom, adresse, tel, mail, password, role],
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Erreur lors de l'ajout", error: err });
      res.status(201).json({ message: "Employé ajouté avec succès" });
    }
  );
});

// Modifier un employé
router.put("/:id", isAdmin, (req, res) => {
  const { nom, prenom, adresse, tel, mail } = req.body;
  const { id } = req.params;

  const query = `
    UPDATE utilisateur
    SET nom = ?, prenom = ?, adresse = ?, tel = ?, mail = ?
    WHERE id = ? AND role IN ('chef_de_projet', 'membre_equipe')
  `;
  db.query(query, [nom, prenom, adresse, tel, mail, id], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Erreur de mise à jour", error: err });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Employé non trouvé" });
    res.status(200).json({ message: "Employé mis à jour avec succès" });
  });
});

// Supprimer un employé
router.delete("/:id", isAdmin, (req, res) => {
  const { id } = req.params;

  const query = `
    DELETE FROM utilisateur
    WHERE id = ? AND role IN ('chef_de_projet', 'membre_equipe')
  `;
  db.query(query, [id], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Erreur de suppression", error: err });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Employé non trouvé" });
    res.status(200).json({ message: "Employé supprimé avec succès" });
  });
});

module.exports = router;
