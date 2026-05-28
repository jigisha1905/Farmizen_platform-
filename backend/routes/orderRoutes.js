const express = require("express");
const router = express.Router();

const {
  placeOrder,
  getOrders
} = require("../controllers/orderController");

router.post("/place", placeOrder);

router.get("/:userId", getOrders);

module.exports = router;