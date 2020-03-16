const express = require("express");
const router = express();
// Import controller methods
const {
  allOrders,
  newOrder,
  deleteOrder
} = require("../controllers/ordersController");
const { protect } = require("../middlewares/auth");
router.route("/orders").get(protect, allOrders);

router.route("/:id/order").post(protect, newOrder);

router.route("/order/:id").delete(protect, deleteOrder);

module.exports = router;
