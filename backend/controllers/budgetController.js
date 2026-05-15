import Budget from '../models/Budget.js';

export const getBudget = async (req, res) => {
  try {
    const { month, year } = req.query;
    if (!month || !year) {
      const budgets = await Budget.find({ userId: req.user._id }).sort({ year: -1, month: -1 });
      return res.json(budgets);
    }
    const budget = await Budget.findOne({ userId: req.user._id, month, year });
    res.json(budget || null);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createBudget = async (req, res) => {
  try {
    const { month, year, limitAmount } = req.body;

    const existingBudget = await Budget.findOne({ userId: req.user._id, month, year });
    
    if (existingBudget) {
      existingBudget.limitAmount = limitAmount;
      const updatedBudget = await existingBudget.save();
      return res.json(updatedBudget);
    }

    const budget = await Budget.create({
      userId: req.user._id,
      month,
      year,
      limitAmount,
    });

    res.status(201).json(budget);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      res.status(404);
      throw new Error('Budget not found');
    }

    if (budget.userId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized');
    }

    const updatedBudget = await Budget.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedBudget);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
