// produit.js

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 3000;

// Middleware pour parser le corps des requêtes
app.use(express.json());

// Connexion à MongoDB
mongoose
  .connect("mongodb://localhost:27017/microservice-produit", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connecté à MongoDB"))
  .catch((err) => console.error("Erreur de connexion à MongoDB:", err));

// Modèle Produit
const produitSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  description: { type: String, required: true },
  prix: { type: Number, required: true },
  stock: { type: Number, required: true },
});

const Produit = mongoose.model("Produit", produitSchema);

// Routes du microservice produit

// POST /produit/ajouter : Ajouter un produit
app.post("/produit/ajouter", async (req, res) => {
  const { nom, description, prix, stock } = req.body;
  try {
    const produit = new Produit({ nom, description, prix, stock });
    await produit.save();
    res.status(201).json(produit);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'ajout du produit" });
  }
});

// GET /produit/:id : Afficher un produit par son ID
app.get("/produit/:id", async (req, res) => {
  try {
    const produit = await Produit.findById(req.params.id);
    if (!produit)
      return res.status(404).json({ message: "Produit non trouvé" });
    res.json(produit);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération du produit" });
  }
});

// PATCH /produit/:id/stock : Mettre à jour le stock d'un produit
app.patch("/produit/:id/stock", async (req, res) => {
  const { stock } = req.body;
  try {
    const produit = await Produit.findByIdAndUpdate(
      req.params.id,
      { stock },
      { new: true }
    );
    if (!produit)
      return res.status(404).json({ message: "Produit non trouvé" });
    res.json(produit);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du stock" });
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
