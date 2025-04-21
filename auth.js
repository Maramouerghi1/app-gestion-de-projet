const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("../db");

// Route POST /register
router.post("/inscription", (req, res) => {
  const { nom, prenom, adresse, tel, mail, password, role } = req.body;

  // Vérifier que le rôle est valide
  const validRoles = ["demandeur", "chef_de_projet", "membre_equipe", "admin"];

  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: "Rôle invalide" });
  }

  // Hasher le mot de passe
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ message: "Erreur interne", error: err });
    }

    // Insérer l'utilisateur dans la base de données avec les informations supplémentaires
    const query = `
      INSERT INTO utilisateur (nom, prenom, adresse, tel, mail, password, role) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [nom, prenom, adresse, tel, mail, hashedPassword, role],
      (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Erreur interne", error: err });
        }

        res
          .status(201)
          .json({ message: `Inscription réussie, utilisateur ${role} créé` });
      }
    );
  });
});

// Route POST /login
router.post("/connexion", (req, res) => {
  const { mail, password } = req.body;

  // Vérifier si l'utilisateur existe
  const query = "SELECT * FROM utilisateur WHERE mail = ?";
  db.query(query, [mail], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur interne", error: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const utilisateur = result[0];

    // Vérifier le mot de passe
    bcrypt.compare(password, utilisateur.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: "Erreur interne", error: err });
      }

      if (!isMatch) {
        return res.status(401).json({ message: "Mot de passe incorrect" });
      }

      // Retourner un message de succès avec les détails de l'utilisateur et son rôle
      res.status(200).json({
        message: "Connexion réussie",
        utilisateur: {
          id: utilisateur.id,
          nom: utilisateur.nom,
          prenom: utilisateur.prenom,
          adresse: utilisateur.adresse,
          telephone: utilisateur.tel,
          email: utilisateur.mail,
          role: utilisateur.role,
        },
      });
    });
  });
});
module.exports = router;
