import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const User = db.define(
  "users",
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true, // field ini tidak boleh bernilai nol/ empty string.
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true, // field ini tidak boleh bernilai nol/ empty string.
      },
    },
    role: {
      type: DataTypes.STRING,
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

export default User;
