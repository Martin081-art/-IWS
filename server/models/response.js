module.exports = (sequelize, DataTypes) => {
  const Response = sequelize.define('Response', {
    response_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    query_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'queries',
        key: 'query_id'
      }
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('automated', 'manual'),
      allowNull: false
    },
    response_time: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'responses',
    timestamps: false
  });

  Response.associate = (models) => {
    Response.belongsTo(models.Query, {
      foreignKey: 'query_id',
      as: 'query'
    });
  };

  return Response;
};