module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    product_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    category: DataTypes.STRING,
    price: DataTypes.DECIMAL(10, 2),
    description: DataTypes.TEXT,
    quantity: DataTypes.INTEGER,
  }, {
    tableName: 'products',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  });

  Product.associate = (models) => {
    Product.hasMany(models.Sale, {
      foreignKey: 'product_id',
      as: 'sales',
    });
  };

  return Product;
};
