const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: Array,
      required: true,
    },
    offer: {
      type: Boolean,
      required: true,
    },
    regularePrice: {
      type: Number,
      require: true,
    },
    discountPrice: {
      type: Number,
      require: true,
    },
    productQuantity: {
      type: Number,
      require: true,
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    addCart: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        Qty: { type: Number, default: 1 },
      },
    ],
    userRef: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
