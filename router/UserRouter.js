const express = require("express");
const Userrouter = express.Router();
const {
  deleteUserFunc,
  UpdateUserFunc,
  CreateProductFunc,
  getProducts,
  updateWishList,
  wishlist,
  getProductCart,
  addTocartUser,
  getAllProductsCard,
  increaseProduct,
  decreaseProduct,
  removeProduct,
  filterProduct,
  recentProduct,
} = require("../controllers/UserFunc");
const { verifyToken } = require("../utils/VerifyToken.js");

Userrouter.delete("/DeleteUser/:id", verifyToken, deleteUserFunc);
Userrouter.put("/UpdateUser/:id", verifyToken, UpdateUserFunc);
Userrouter.post("/createProduct/:id", verifyToken, CreateProductFunc);
Userrouter.get("/products", getProducts);
Userrouter.put("/wishlist/:id", verifyToken, updateWishList);
Userrouter.get("/getWishlist", verifyToken, wishlist);
Userrouter.get("/product/addToCart/:id", getProductCart);
Userrouter.put("/product/addToCart/user/:id", verifyToken, addTocartUser);
Userrouter.get(
  "/product/getallProductsCart/user/:id",
  verifyToken,
  getAllProductsCard
);
Userrouter.put("/product/addQuantity/:id", verifyToken, increaseProduct);
Userrouter.put("/product/removeQuantity/:id", verifyToken, decreaseProduct);
Userrouter.put("/product/removeProduct/:id", verifyToken, removeProduct);
Userrouter.get("/product/filtredProducts", filterProduct);
Userrouter.get("/product/recentProducts", recentProduct);

module.exports = Userrouter;
