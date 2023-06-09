const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue:DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    direccion: {
      type: DataTypes.STRING
    },
    telefono: {
      type: DataTypes.STRING
      
    },
    nit: {
      type: DataTypes.INTEGER
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true
    },
    contrasena: {
      type: DataTypes.STRING },


    tipo:{
      type:DataTypes.ENUM('admin','usuario'),
      allowNull:false
    },
    googleToken:{
      type: DataTypes.STRING
    },
    refreshToken:{
      type: DataTypes.STRING
    }
  }, {timestamps: false});
};
