'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class incomes extends Model {
    static associate(models) {
    }
  };
  incomes.init({
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    incomeDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },{
    sequelize,
    modelName: 'incomes',
}
);
  return incomes;
};