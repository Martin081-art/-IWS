const db = require('../models');
const Product = db.Product;

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, category, price, description, quantity } = req.body;
    const newProduct = await Product.create({ name, category, price, description, quantity });
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Error creating product:', err); // Log the detailed error
    res.status(500).json({ message: 'Error creating product', error: err.message });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching products' });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching product' });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const { name, category, price, description, quantity } = req.body;
    const product = await Product.findByPk(req.params.id);
    if (product) {
      product.name = name || product.name;
      product.category = category || product.category;
      product.price = price || product.price;
      product.description = description || product.description;
      product.quantity = quantity || product.quantity;

      await product.save();
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating product' });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      await product.destroy();
      res.status(200).json({ message: 'Product deleted successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting product' });
  }
};
