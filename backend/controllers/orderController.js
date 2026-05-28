const db = require("../config/db");

// Place Order
const placeOrder = (req, res) => {

  const { user_id, total_amount } = req.body;

  const sql =
    "INSERT INTO orders (user_id, total_amount) VALUES (?, ?)";

  db.query(
    sql,
    [user_id, total_amount],
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.status(201).json({
        message: "Order Placed Successfully",
        orderId: result.insertId
      });

    }
  );
};

// Get User Orders
const getOrders = (req, res) => {

  const userId = req.params.userId;

  const sql =
    "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC";

  db.query(sql, [userId], (err, result) => {

    if (err) {
      return res.status(500).json(err);
    }

    res.status(200).json(result);

  });

};

module.exports = {
  placeOrder,
  getOrders
};