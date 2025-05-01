module.exports = (sequelize, DataTypes) => {
  const Query = sequelize.define('Query', {
    query_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
    },
    email: {
      type: DataTypes.STRING(100),
    },
    message: {
      type: DataTypes.TEXT,
    },
    reply: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    
    status: {
      type: DataTypes.ENUM('pending', 'complete'),
      defaultValue: 'pending',
    },
    auto_replied: {
      type: DataTypes.TINYINT(1),
      defaultValue: 0,
    },
    reply_message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    
  });

  return Query;
};
