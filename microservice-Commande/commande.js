// commande.js

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 3001;

// Middleware pour parser le corps des requêtes
app.use(express.json());

// Connexion à MongoDB
mongoose
  .connect("mongodb://localhost:27017/microservice-commande", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connecté à MongoDB"))
  .catch((err) => console.error("Erreur de connexion à MongoDB:", err));

// Modèle Commande
const commandeSchema = new mongoose.Schema({
  produitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Produit",
    required: true,
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  quantite: { type: Number, required: true },
  status: { type: String, default: "En attente" },
});

const Commande = mongoose.model("Commande", commandeSchema);

// Routes du microservice commande

// POST /commande/creer : Créer une commande
app.post("/commande/creer", async (req, res) => {
  const { produitId, clientId, quantite } = req.body;
  try {
    const commande = new Commande({ produitId, clientId, quantite });
    await commande.save();
    res.status(201).json(commande);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la création de la commande" });
  }
});

// GET /commande/:id : Afficher une commande par son ID
app.get("/commande/:id", async (req, res) => {
  try {
    const commande = await Commande.findById(req.params.id);
    if (!commande)
      return res.status(404).json({ message: "Commande non trouvée" });
    res.json(commande);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération de la commande" });
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur "Commande" démarré sur le port ${PORT}`);
});
