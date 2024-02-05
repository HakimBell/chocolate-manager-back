require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const port = 3000;

// La fameuse ligne étrange qui permet beaucoup de chose bien !
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// Connexion à la base de données
mongoose.connect(process.env.MONGO_URL);

const productSchema = new mongoose.Schema({
  name: String,
  imageUrl: String,
  description: String,
  originCountry: String,
  price: Number,
  grams: Number,
});

const Product = mongoose.model("Product", productSchema);

app.get("/", async (req, res) => {
  const products = await Product.find();
  res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
  res.json(products);
});

app.post("/add", async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.json(newProduct);
});

app.delete("/delete/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;
