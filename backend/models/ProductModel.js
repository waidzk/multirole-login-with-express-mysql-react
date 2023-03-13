import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import User from "./UserModel.js";

const { DataTypes } = Sequelize;

const Product = db.define(
  "product",
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      validate: {
        notEmpty: true, // field ini tidak boleh bernilai nol/ empty string.
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true, // field ini tidak boleh bernilai nol/ empty string.
        len: [3, 100], //min 3 karakter dan maks 100 karakter
      },
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true, // field ini tidak boleh bernilai nol/ empty string.
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true, // field ini tidak boleh bernilai nol/ empty string.
      },
    },
  },
  {
    freezeTableName: true,
  }
);

//merelasikan antara product dengan user sesuai foreign key nya yaitu userId
User.hasMany(Product);
Product.belongsTo(User, { foreignKey: "userId" });

export default Product;
