const User = require("../model/User.js");
const Product = require("../model/product.js");
const customError = require("../utils/customError.js");
const bcrypt = require("bcrypt");

const deleteUserFunc = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      next(customError(404, "id not found !!"));
    } else {
      const GetUser = await User.findOne({ _id: req.params.id });
      await User.deleteOne({ _id: GetUser._id });
      res
        .clearCookie("TOKEN_ACCESSY")
        .status(200)
        .json({ msg: "user has been deleted successfully " });
    }
  } catch (error) {
    next(error);
  }
};

const UpdateUserFunc = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      next(customError(404, "id not found !!"));
    } else {
      const FILTER = { _id: req.params.id };
      if (req.body.password) {
        req.body.password = bcrypt.hashSync(req.body.password, 10);
      }
      const UPDATE = await User.findOneAndUpdate(
        FILTER,
        {
          $set: {
            password: req.body.password,
            username: req.body.username,
            email: req.body.email,
            avatar: req.body.avatar,
          },
        },
        {
          new: true,
        }
      );
      const { password: pass, ...rest } = UPDATE._doc;
      responseData = rest;
      res
        .status(200)
        .json({ res: responseData, msg: "user Updated successfully" });
    }
  } catch (error) {
    next(error);
  }
};

const CreateProductFunc = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      next(customError(404, "id not found !!"));
    } else {
      const CREATEPRODUCT = await new Product(req.body);
      const New_Product = await CREATEPRODUCT.save();
      res.status(200).json({
        msg: "product has been created successfully",
        data: New_Product,
      });
    }
  } catch (error) {
    next(error);
  }
};

const getProducts = async (_, res, next) => {
  try {
    const GetProducts = await Product.find({});
    if (!GetProducts || GetProducts.length < 0) {
      next(customError(204, "no products found"));
    }
    res.status(200).json(GetProducts);
  } catch (error) {
    next(error);
  }
};
const updateWishList = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      next(customError(404, "id not found !!"));
    } else {
      const filter = { _id: req.body.productId };
      const getProduct = await Product.findOne(filter);
      if (!getProduct.wishlist || !Array.isArray(getProduct.wishlist)) {
        getProduct.wishlist = [];
      }
      const UserIndex = await getProduct.wishlist.indexOf(req.user.id);
      if (UserIndex == -1) {
        getProduct.wishlist.push(req.user.id);
      } else {
        getProduct.wishlist.splice(UserIndex, 1);
      }
      const Updated = await getProduct.save();
      res.status(200).json({
        msg: "add to wish list",
        data: Updated,
        isInWishList: UserIndex == -1,
      });
    }
  } catch (error) {
    next(error);
  }
};

const wishlist = async (req, res, next) => {
  try {
    // Find all products where current user is in the wishlist array
    const wishlistedProducts = await Product.find({
      wishlist: req.user.id,
    });

    res.json(wishlistedProducts);
  } catch (err) {
    next(err);
  }
};

const getProductCart = async (req, res, next) => {
  try {
    const filter = { _id: req.params.id };
    const productCart = await Product.findOne(filter);
    if (!productCart) {
      next(customError(404, "product not found !!"));
    }
    res.status(200).json({ data: productCart });
  } catch (error) {
    next(error);
  }
};

//
const addTocartUser = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      next(customError(404, "id not found !!"));
    }
    const { productId } = req.body;
    const Update = await Product.findOne({ _id: productId });
    if (Update) {
      // Initialize addCart as an array if it's not already
      if (!Update.addCart || !Array.isArray(Update.addCart)) {
        Update.addCart = [];
      }
      // Check if user already exists in the array
      const existingUser = Update.addCart.find(
        (item) => item.id.toString() === req.user.id.toString()
      );

      if (!existingUser) {
        Update.addCart.push({ id: req.user.id, Qty: 1 });
      } else {
        existingUser.Qty++;
      }
    }
    const userindex = await Update.addCart.findIndex(
      (item) => item.id == req.user.id
    );
    const data = await Update.save(); // Don't forget to save the changes to the database
    res.status(200).json({ data, isCardExists: userindex == -1 });
  } catch (error) {
    next(error);
  }
};

//
const getAllProductsCard = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      next(customError(404, "id of user not found !!"));
    }
    const card = await Product.find({ addCart: { $exists: true } });
    if (!card || card.length === 0) {
      res.status(200).json([]);
    }
    const filter = await card.filter((x) => {
      return x.addCart.find((x) => x.id == req.user.id);
    });
    return res.status(200).json(filter);
  } catch (error) {
    next(error);
  }
};

//
const increaseProduct = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      next(customError(404, "id of user not found !!"));
    }
    const add = await Product.findOne({ _id: req.body.id });
    const gettoadd = add.addCart.find((item) => item.id == req.user.id);
    if (gettoadd) {
      gettoadd.Qty++;
    }
    await add.save();
    res.status(200).json(gettoadd);
  } catch (error) {
    next(error);
  }
};

//
const decreaseProduct = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      next(customError(404, "id of user not found !!"));
    }
    const minase = await Product.findOne({ _id: req.body.id });
    const gettominase = minase.addCart.find((item) => item.id == req.user.id);
    if (gettominase) {
      if (gettominase.Qty == 1) {
        gettominase.Qty = 1;
      } else {
        gettominase.Qty--;
      }
    }
    await minase.save();
    res.status(200).json(minase);
  } catch (error) {
    next(error);
  }
};

const removeProduct = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      next(customError(404, "id of user not found !!"));
    }
    const removeproductCard = await Product.findOne({ _id: req.body.id });
    const index = removeproductCard.addCart.findIndex(
      (item) => item.id == req.user.id
    );
    if (removeproductCard) {
      removeproductCard.addCart.splice(index, 1);
    }
    await removeproductCard.save();
    res.status(200).json(removeproductCard);
  } catch (error) {
    next(error);
  }
};

const filterProduct = async (req, res, next) => {
  try {
    const limit = 4;
    const startIndex = req.query.startIndex || 0;
    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";
    const filter = await Product.find({
      title: { $regex: searchTerm, $options: "i" },
    })
      .limit(limit)
      .skip(startIndex)
      .sort({ [sort]: order });
    res.status(200).json(filter);
  } catch (error) {
    next(error);
  }
};

const recentProduct = async (_, res, next) => {
  try {
    const limit = 4;
    const sort = "createdAt";
    const order = "desc";
    const getRecentProducts = await Product.find({})
      .limit(limit)
      .sort({ [sort]: order });
    res.status(200).json(getRecentProducts);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  recentProduct,
  addTocartUser,
  deleteUserFunc,
  UpdateUserFunc,
  CreateProductFunc,
  getProducts,
  updateWishList,
  wishlist,
  getProductCart,
  getAllProductsCard,
  increaseProduct,
  decreaseProduct,
  removeProduct,
  filterProduct,
};
