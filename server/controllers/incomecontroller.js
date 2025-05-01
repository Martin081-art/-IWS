const db = require('../models');
const IncomeStatement = db.IncomeStatement;

// Create income
exports.createIncome = async (req, res) => {
  try {
    const { month, income, expenses } = req.body;

    if (!month || income === undefined || expenses === undefined) {
      return res.status(400).json({ message: 'Month, income, and expenses are required' });
    }

    const profit = parseFloat(income) - parseFloat(expenses);

    const newIncome = await IncomeStatement.create({ 
      month, 
      income: parseFloat(income), 
      expenses: parseFloat(expenses), 
      profit 
    });

    res.status(201).json({
      message: 'Income statement created successfully',
      income: newIncome,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating income statement', error: err.message });
  }
};

// Get all income statements
exports.getAllIncome = async (req, res) => {
  try {
    const incomes = await IncomeStatement.findAll();
    res.status(200).json(incomes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching income statements', error: err.message });
  }
};

// Get one income statement by ID
exports.getIncomeById = async (req, res) => {
  try {
    const income = await IncomeStatement.findByPk(req.params.id);
    if (income) {
      res.status(200).json(income);
    } else {
      res.status(404).json({ message: 'Income statement not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching income statement', error: err.message });
  }
};

// Update income
exports.updateIncome = async (req, res) => {
  try {
    const { income, expenses } = req.body;

    if (income === undefined || expenses === undefined) {
      return res.status(400).json({ message: 'Income and expenses are required' });
    }

    const incomeStatement = await IncomeStatement.findByPk(req.params.id);
    if (!incomeStatement) {
      return res.status(404).json({ message: 'Income statement not found' });
    }

    const profit = parseFloat(income) - parseFloat(expenses);

    await incomeStatement.update({
      income: parseFloat(income),
      expenses: parseFloat(expenses),
      profit,
    });

    res.status(200).json({
      message: 'Income statement updated successfully',
      income: incomeStatement,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating income statement', error: err.message });
  }
};

// Delete income
exports.deleteIncome = async (req, res) => {
  try {
    const income = await IncomeStatement.findByPk(req.params.id);
    if (income) {
      await income.destroy();
      res.status(200).json({ message: 'Income statement deleted successfully' });
    } else {
      res.status(404).json({ message: 'Income statement not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting income statement', error: err.message });
  }
};
