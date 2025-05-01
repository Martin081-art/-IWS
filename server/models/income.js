module.exports = (sequelize, DataTypes) => {
  return sequelize.define('IncomeStatement', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    month: { type: DataTypes.STRING },
    income: { type: DataTypes.DECIMAL(10, 2) },
    expenses: { type: DataTypes.DECIMAL(10, 2) },
    profit: { type: DataTypes.DECIMAL(10, 2) },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'income_statements',
    timestamps: false
  });
};
