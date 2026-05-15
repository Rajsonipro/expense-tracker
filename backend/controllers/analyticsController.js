import Transaction from '../models/Transaction.js';
import Budget from '../models/Budget.js';

export const getForecast = async (req, res) => {
  try {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const currentDate = today.getDate();

    // Get all expenses for the current month
    const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
    
    const transactions = await Transaction.find({
      userId: req.user._id,
      type: 'expense',
      date: { $gte: startOfMonth, $lte: today }
    });

    // Calculate total spent so far
    const totalSpent = transactions.reduce((acc, curr) => acc + curr.amount, 0);

    // Calculate average daily spend
    const averageDailySpend = currentDate > 0 ? (totalSpent / currentDate) : 0;

    // Forecast = (Average Daily Spend * Days in Month)
    const forecastedTotal = averageDailySpend * daysInMonth;

    // See if there's a budget for this month
    const budget = await Budget.findOne({ userId: req.user._id, month: currentMonth, year: currentYear });
    
    let status = 'On Track';
    if (budget && forecastedTotal > budget.limitAmount) {
        status = 'Over Budget Projected';
    }

    res.json({
      currentDay: currentDate,
      daysInMonth: daysInMonth,
      totalSpentSoFar: totalSpent,
      averageDailySpend: parseFloat(averageDailySpend.toFixed(2)),
      forecastedTotal: parseFloat(forecastedTotal.toFixed(2)),
      budgetLimit: budget ? budget.limitAmount : null,
      status
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
