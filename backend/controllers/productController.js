const db = require("../config/db");

const getProducts = (req, res) => {

  const sql = "SELECT * FROM products";

  db.query(sql, (err, result) => {

    if (err) {
      return res.status(500).json(err);
    }

    res.status(200).json(result);

  });

};

module.exports = {
  getProducts
};