const router = require("express").Router();
const ProductModel = require("../models/ProductModel");
const authenticateToken = require("./AuthToken");

router.post("/addProductsToList", authenticateToken, async (req, res) => {
  try {
    const { name, description, price, quantity } = req.body;

    // Check if the product already exists (optional)
    const existingProduct = await ProductModel.findOne({ name });
    if (existingProduct) {
      return res.status(400).json({ error: "Product already exists" });
    }

    const product = new ProductModel({ name, description, price, quantity });
    await product.save();
    res.status(201).json(product); // Return the created product
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ error: "Server error" });
  }
});
router.get("/getProductsAdmin", authenticateToken, async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.status(200).json(products);
  } catch (err) {
    console.error("Error getting products:", err);
    res.status(500).json({ error: "Server error" });
  }
});
// PATCH /api/products/:id (Update product)
router.patch("/editProductAdmin/:id", authenticateToken, async (req, res) => {
  try {
    const productId = req.params.id;
    const { quantity } = req.body;

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      { quantity },
      { new: true } // Return the updated product
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: "Server error" });
  }
});
router.delete(
  "/removeProductAdmin/:id",
  authenticateToken,
  async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await ProductModel.findByIdAndDelete(productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json({ message: "Product deleted" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "server errror" });
    }
  }
);

module.exports = router;
