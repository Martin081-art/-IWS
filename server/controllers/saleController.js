const db = require('../models');
const { Product, Sale, User } = db;

// Create a sale
exports.createSale = async (req, res) => {
  const { product_id,quantity, customer } = req.body;
  const userId = req.user.id; // The sales personnel making the sale

  try {
    // Check if product exists
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check stock availability
    if (product.quantity < quantity) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    // Verify user and role
    const salesPersonnel = await User.findByPk(userId);
    if (!salesPersonnel) {
      return res.status(404).json({ message: 'Sales personnel not found' });
    }
    if (salesPersonnel.role !== 'sales') {
      return res.status(403).json({ message: 'User does not have sales role' });
    }

    // Create the sale record
    const sale = await Sale.create({
      product_id,
      quantity,
      customer,
      sales_personnel_id: userId,
      price: product.price * quantity,
      name: product.name, // Add product name to sale
    });

    // Decrease product stock
    product.quantity -= quantity;
    await product.save();

    res.status(201).json({
      message: 'Sale recorded successfully!',
      sale: {
        product_id: sale.product_id,
        quantity: sale.quantity,
        customer: sale.customer,
        sales_personnel_id: sale.sales_personnel_id,
        price: sale.price,
        name: sale.name, // Include product name in response
      },
    });
  } catch (error) {
    console.error('Error recording sale:', error);

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Validation Error',
        errors: error.errors.map(e => e.message),
      });
    }

    if (error.name === 'SequelizeDatabaseError') {
      return res.status(500).json({
        message: 'Database error occurred',
        error: error.message,
      });
    }

    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


// Get all sales with associated product and salesperson
exports.getAllSales = async (req, res) => {
  try {
    const sales = await Sale.findAll({
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['product_id', 'name', 'price'], // Adjust to use the correct field names
        },
        {
          model: User,
          as: 'salesperson',
          attributes: ['user_id', 'username', 'email'], // Adjust to use the correct field names
        },
      ],
    });

    res.status(200).json(sales);
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
