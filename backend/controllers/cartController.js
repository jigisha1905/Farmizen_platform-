const db = require("../config/db");

// Add Product To Cart
const addToCart = (req, res) => {

  const { user_id, product_id, quantity } = req.body;

  const sql =
    "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)";

  db.query(
    sql,
    [user_id, product_id, quantity],
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.status(201).json({
        message: "Product Added To Cart"
      });

    }
  );
};

// Get User Cart
const getCart = (req, res) => {

  const userId = req.params.userId;

  const sql = `
    SELECT
      cart.id,
      products.name,
      products.price,
      products.image,
      cart.quantity
    FROM cart
    JOIN products
    ON cart.product_id = products.id
    WHERE cart.user_id = ?
  `;

  db.query(sql, [userId], (err, result) => {

    if (err) {
      return res.status(500).json(err);
    }

    res.status(200).json(result);

  });

};

// Delete Cart Item
const deleteCartItem = (req, res) => {

  const cartId = req.params.id;

  const sql =
    "DELETE FROM cart WHERE id = ?";

  db.query(sql, [cartId], (err, result) => {

    if (err) {
      return res.status(500).json(err);
    }

    res.status(200).json({
      message: "Cart Item Removed"
    });

  });

};

module.exports = {
  addToCart,
  getCart,
  deleteCartItem
};