import Expense from "../model/expense.js"

export const createExpense = async (req, res) => {
    try {
        const { category, amount, type, note,date } = req.body
        const expense = await Expense.create({
            category, amount, type, note,date,userId: req.user.userId,
        })
        return res.status(200).json({
            message: "expense added",
            expense:expense
        })
    } catch (error) {
        console.error(error.message)
        return res.status(400).json({
            message: "something went wrong"
        })
    }
}

export const getExpenses = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { month, category, type, from, to } = req.query;

    const filter = {
      userId,
    };

    // Type filter
    if (type) {
      filter.type = type;
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Month filter
    if (month) {
      const startDate = new Date(`${month}-01`);

      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);

      filter.date = {
        $gte: startDate,
        $lt: endDate,
      };
    }

    // Custom date range
    if (from || to) {
      filter.date = {};

      if (from) {
        filter.date.$gte = new Date(from);
      }

      if (to) {
        const endDate = new Date(to);
        endDate.setDate(endDate.getDate() + 1);

        filter.date.$lt = endDate;
      }
    }

    const expenses = await Expense.find(filter)
      .sort({ date: -1 });

    return res.status(200).json({
      expenses,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const userId = req.user.userId;
    const expenseId = req.params.id;

    const { category, amount, type, note, date } = req.body;

    const expense = await Expense.findOneAndUpdate(
      {
        _id: expenseId,
        userId: userId,
      },
      {
        category,
        amount,
        type,
        note,
        date,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    return res.status(200).json({
      message: "Expense updated successfully",
      expense,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const userId = req.user.userId;
    const expenseId = req.params.id;

    const expense = await Expense.findOneAndDelete({
      _id: expenseId,
      userId: userId,
    });

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    return res.status(200).json({
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};