const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('CartGuest', {
    id: {
      type: DataTypes.UUID,
      defaultValue:DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false

    }
  }, {timestamps: false});
};