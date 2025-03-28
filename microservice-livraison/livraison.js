// livraison.js

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 3002;

// Middleware pour parser le corps des requêtes
app.use(express.json());

// Connexion à MongoDB
mongoose
  .connect("mongodb://localhost:27017/microservice-livraison", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connecté à MongoDB"))
  .catch((err) => console.error("Erreur de connexion à MongoDB:", err));

// Modèle Livraison
const livraisonSchema = new mongoose.Schema({
  commandeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Commande",
    required: true,
  },
  transporteurId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transporteur",
    required: true,
  },
  dateLivraison: { type: Date, required: true },
});

const Livraison = mongoose.model("Livraison", livraisonSchema);

// Routes du microservice livraison

// POST /livraison/planifier : Planifier une livraison
app.post("/livraison/planifier", async (req, res) => {
  const { commandeId, transporteurId, dateLivraison } = req.body;
  try {
    const livraison = new Livraison({
      commandeId,
      transporteurId,
      dateLivraison,
    });
    await livraison.save();
    res.status(201).json(livraison);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la planification de la livraison" });
  }
});

// GET /livraison/:id : Afficher une livraison par son ID
app.get("/livraison/:id", async (req, res) => {
  try {
    const livraison = await Livraison.findById(req.params.id);
    if (!livraison)
      return res.status(404).json({ message: "Livraison non trouvée" });
    res.json(livraison);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération de la livraison" });
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur "Livraison" démarré sur le port ${PORT}`);
});
