// authentification.js

const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const app = express();
const PORT = 3003;

// Middleware pour parser le corps des requêtes
app.use(express.json());

// Connexion à MongoDB
mongoose
  .connect("mongodb://localhost:27017/microservice-authentification", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connecté à MongoDB"))
  .catch((err) => console.error("Erreur de connexion à MongoDB:", err));

// Modèle Utilisateur
const utilisateurSchema = new mongoose.Schema({
  email: { type: String, required: true },
  motDePasse: { type: String, required: true },
});

const Utilisateur = mongoose.model("Utilisateur", utilisateurSchema);

// Routes du microservice authentification

// POST /auth/login : Authentifier un utilisateur
app.post("/auth/login", async (req, res) => {
  const { email, motDePasse } = req.body;
  try {
    const utilisateur = await Utilisateur.findOne({ email });
    if (!utilisateur)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    const isMatch = await bcrypt.compare(motDePasse, utilisateur.motDePasse);
    if (!isMatch)
      return res.status(400).json({ message: "Mot de passe incorrect" });

    const token = jwt.sign({ id: utilisateur._id }, "votreSecret", {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'authentification" });
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur "Authentification" démarré sur le port ${PORT}`);
});
