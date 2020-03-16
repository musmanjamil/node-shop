const express = require("express");
const router = express();
const {
  allProducts,
  creatProduct,
  getProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/productsController");
const { protect } = require("../middlewares/auth");

router.route("/products").get(allProducts);
router.route("/product/new").post(protect, creatProduct);
router
  .route("/product/:id")
  .get(getProduct)
  .patch(protect, updateProduct)
  .delete(protect, deleteProduct);

module.exports = router;
