const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('Product', {
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
    descripcion:{
      type: DataTypes.TEXT
    },
    tipo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    caracteristicas: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    categoria:{
        type:DataTypes.STRING,
        allowNull:false
    },
    imagenes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
        validate:{
          isUrl:true
        }
      },
    precio: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    stock:{
        type:DataTypes.INTEGER
    },
    marca: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ref: {
      type: DataTypes.STRING
    },
    estado:{
      type:DataTypes.STRING

    },
    enable:{
      type:DataTypes.BOOLEAN,
      allowNull:false,
      defaultValue:true,
    }
  }, {timestamps: false});
};