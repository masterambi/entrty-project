// "use strict";
// const { Model } = require("sequelize");
// const { Product } = require("./index");
// module.exports = (sequelize, DataTypes) => {
//   class Cart extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//       Cart.belongsTo(models.User, { foreignKey: "user_id" });
//       Cart.belongsTo(models.Product, {
//         foreignKey: "product_id",
//         as: "product",
//       });
//     }
//   }
//   Cart.init(
//     {
//       quantity: {
//         allowNull: false,
//         type: DataTypes.INTEGER,
//         validate: {
//           notNull: {
//             args: true,
//             msg: "quantity is required",
//           },
//           notEmpty: {
//             args: true,
//             msg: "quantity is required",
//           },
//           min: {
//             args: [1],
//             msg: "quantity must be a positive integer",
//           },
//           isInt: {
//             args: true,
//             msg: "quantity must be a positive integer",
//           },
//         },
//       },
//       status: {
//         allowNull: false,
//         type: DataTypes.BOOLEAN,
//         defaultValue: false,
//         validate: {
//           notNull: {
//             args: true,
//             msg: "status is required",
//           },
//           notEmpty: {
//             args: true,
//             msg: "status is required",
//           },
//         },
//       },
//       user_id: {
//         allowNull: false,
//         type: DataTypes.INTEGER,
//         validate: {
//           notNull: {
//             args: true,
//             msg: "user_id is required",
//           },
//           notEmpty: {
//             args: true,
//             msg: "user_id is required",
//           },
//         },
//       },
//       product_id: {
//         allowNull: false,
//         type: DataTypes.INTEGER,
//         validate: {
//           notNull: {
//             args: true,
//             msg: "product_id is required",
//           },
//           notEmpty: {
//             args: true,
//             msg: "product_id is required",
//           },
//         },
//       },
//     },
//     {
//       sequelize,
//       modelName: "Cart",
//     }
//   );

//   Cart.afterUpdate(async (cart, options) => {
//     if (cart.status === true) {
//       try {
//         const product = await sequelize.models.Product.findByPk(
//           cart.product_id
//         );
//         product.stock -= cart.quantity;
//         await product.save();
//       } catch (err) {
//         throw err;
//       }
//     }
//   });

//   return Cart;
// };
