const { CartProducts, Product } = require('../db');

const getCartProducts = async (req, res) => {
  try {
    const { CartId } = req.query;
    let cartProducts;

    if (CartId) {

    cartProducts = await CartProducts.findAll({
      where: { CartId },
      include: {
        model: Product,
        attributes: ['id', 'nombre', 'precio', 'descripcion', 'imagenes', 'categoria', 'marca', 'ref','tipo' ], 
      },
    });
  } else {
    cartProducts = []; 
  }

    res.status(200).json({ cartProducts});
  } catch (error) {
    console.error('Error al obtener los CartProducts:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = getCartProducts;