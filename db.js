const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "pfe",
});

db.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à MySQL :", err);
    process.exit(1);
  }
  console.log("Connecté à MySQL avec succès");
});

module.exports = db; // Assurez-vous d'exporter la connexion pour l'utiliser ailleurs
