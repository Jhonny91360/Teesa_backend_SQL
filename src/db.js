require('dotenv').config();
const { Sequelize } = require('sequelize');
const UserModel=require("./models/User")
const ServiceModel=require("./models/Service")
const CartModel=require("./models/Cart")
const ProductModel=require("./models/Product")
const PurchasedModel=require("./models/Purchased")
const PurchasedProductModel=require("./models/PurchasedProduct")
const ReviewModel = require('./models/Reviews')
const CartProductsModel=require("./models/CartProducts")

const { DB_USER, DB_PASSWORD, DB_HOST, DB_DEPLOY, BD, DB_DEPLOYRAIL } = process.env;
// PARA DEPLOY CON RENDER
// const sequelize = new Sequelize(
//    DB_DEPLOY,
//    {
//       logging: false, 
//       native: false, 
//       dialectOptions: {
//          ssl: {
//             require: true
//          }
//       }
//    }
// )

// PARA DEPLOY CON RAILWAY
/* const sequelize = new Sequelize(
   DB_DEPLOYRAIL,
   {
      logging: false, 
      native: false, 
      
   }
) */

 const sequelize = new Sequelize(
    `postgres:${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${BD}`,
    {
       logging: false, 
       native: false
    }
 )

UserModel(sequelize);
ProductModel(sequelize);
CartModel(sequelize);
ServiceModel(sequelize)
PurchasedModel(sequelize)
PurchasedProductModel(sequelize)
ReviewModel(sequelize)
CartProductsModel(sequelize);

const { User, Cart, Product, CartProducts,  Service, Purchased, PurchasedProduct, Review } = sequelize.models;
User.hasOne(Cart)
Cart.belongsTo(User)
Cart.hasMany(CartProducts)
CartProducts.belongsTo(Cart)
CartProducts.belongsTo(Product)
Product.hasMany(CartProducts)

User.hasMany(Service)
Service.belongsTo(User)
User.hasMany(Purchased)
Purchased.belongsTo(User)
Product.hasMany(PurchasedProduct)
PurchasedProduct.belongsTo(Product)
Purchased.hasMany(PurchasedProduct)
PurchasedProduct.belongsTo(Purchased)

User.belongsToMany(Product, {through: Review});
Product.belongsToMany(User, {through: Review});
Review.belongsTo(User);


module.exports = {
    sequelize, ...sequelize.models
}