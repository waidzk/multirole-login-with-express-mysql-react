import Product from "../models/ProductModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";

export const getProducts = async (req, res) => {
  try {
    let response;
    //req.role berasal dari middleware setelah kita login
    if (req.role === "admin") {
      //jika yang login adalah admin
      response = await Product.findAll({
        attributes: ["uuid", "name", "price"],
        //menyertakan model user
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    } else {
      //Jika yang login adalah user
      response = await Product.findAll({
        attributes: ["uuid", "name", "price"],
        // (maka Products yang muncul hanya yang punya yang login)
        where: {
          //req.userId berasal dari middleware setelah kita login
          userId: req.userId,
        },
        //menyertakan model user
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!product) return res.status(404).json({ msg: "Product Not Found!" });
    let response;
    //req.role berasal dari middleware setelah kita login
    if (req.role === "admin") {
      //jika yang login adalah admin
      response = await Product.findOne({
        attributes: ["uuid", "name", "price"],
        where: {
          id: product.id,
        },
        //menyertakan model user
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    } else {
      //Jika yang login adalah user
      response = await Product.findOne({
        attributes: ["uuid", "name", "price"],
        // (maka Products yang muncul hanya yang punya yang login)
        where: {
          //req.userId berasal dari middleware setelah kita login
          [Op.and]: [{ id: product.id }, { userId: req.userId }],
        },
        //menyertakan model user
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createProduct = async (req, res) => {
  const { name, price } = req.body;
  try {
    await Product.create({
      name: name,
      price: price,
      userId: req.userId,
    });
    res.status(201).json({ msg: "Product created successfully!" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!product) return res.status(404).json({ msg: "Product Not Found!" });
    const { name, price } = req.body;
    //req.role berasal dari middleware setelah kita login
    if (req.role === "admin") {
      await Product.update({name, price}, {
        where:{
          id: product.id
        }
      })
    } else {
      if(req.userId !== product.userId) return res.status(403).json({msg: "Akses terlarang!"})
      await Product.update({name, price}, {
        where: {
          //req.userId berasal dari middleware setelah kita login
          [Op.and]: [{ id: product.id }, { userId: req.userId }],
        },
      })
    }
    res.status(200).json({msg: "Product updated succcessfully"});
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!product) return res.status(404).json({ msg: "Product Not Found!" });
    //req.role berasal dari middleware setelah kita login
    if (req.role === "admin") {
      await Product.destroy({
        where:{
          id: product.id
        }
      })
    } else {
      if(req.userId !== product.userId) return res.status(403).json({msg: "Akses terlarang!"})
      await Product.destroy({
        where: {
          //req.userId berasal dari middleware setelah kita login
          [Op.and]: [{ id: product.id }, { userId: req.userId }],
        },
      })
    }
    res.status(200).json({msg: "Product deleted succcessfully"});
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
