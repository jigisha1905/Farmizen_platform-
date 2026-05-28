const db = require("../config/db");

const getDashboardStats = (req, res) => {

  const dashboardData = {};

  db.query(
    "SELECT COUNT(*) AS totalUsers FROM users",
    (err, usersResult) => {

      if (err) return res.status(500).json(err);

      dashboardData.totalUsers =
        usersResult[0].totalUsers;

      db.query(
        "SELECT COUNT(*) AS totalProducts FROM products",
        (err, productsResult) => {

          if (err) return res.status(500).json(err);

          dashboardData.totalProducts =
            productsResult[0].totalProducts;

          db.query(
            "SELECT COUNT(*) AS totalOrders FROM orders",
            (err, ordersResult) => {

              if (err) return res.status(500).json(err);

              dashboardData.totalOrders =
                ordersResult[0].totalOrders;

              res.status(200).json(dashboardData);

            }
          );

        }
      );

    }
  );

};

module.exports = {
  getDashboardStats
};