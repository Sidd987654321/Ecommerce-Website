import Product from "../models/Product.js";
import User from "../models/User.js";
import Order from "../models/Order.js";

// @route GET /api/admin/dashboard  (Admin)
export const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments({ role: "customer" });
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: "Pending" });

    res.json({
      totalProducts,
      totalUsers,
      totalOrders,
      pendingOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
