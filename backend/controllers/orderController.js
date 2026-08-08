import Order from "../models/Order.js";
import Product from "../models/Product.js";

// Simple coupon logic placeholder — replace with a real Coupon model later if needed
const applyCoupon = (code, subtotal) => {
  if (code === "SAVE10") return Math.round(subtotal * 0.1);
  return 0;
};

const FREE_SHIPPING_THRESHOLD = 999;
const FLAT_SHIPPING_CHARGE = 49;

// @route POST /api/orders  (Customer — checkout)
// body: { items: [{ productId, size, quantity }], shippingAddress, couponCode }
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, couponCode } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    const orderProducts = [];
    let subtotal = 0;

    // Recalculate everything server-side — never trust prices/totals sent from frontend
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }

      const sizeEntry = product.sizes.find((s) => s.size === item.size);
      if (!sizeEntry) {
        return res.status(400).json({ message: `Size ${item.size} not available for ${product.title}` });
      }
      if (sizeEntry.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.title} (size ${item.size})` });
      }

      const lineTotal = product.price * item.quantity;
      subtotal += lineTotal;

      orderProducts.push({
        product: product._id,
        title: product.title,
        image: product.images[0],
        size: item.size,
        quantity: item.quantity,
        price: product.price,
      });

      // Decrement stock
      sizeEntry.stock -= item.quantity;
      await product.save();
    }

    const discount = couponCode ? applyCoupon(couponCode, subtotal) : 0;
    const shippingCharge = subtotal - discount >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_CHARGE;
    const total = subtotal - discount + shippingCharge;

    const order = await Order.create({
      user: req.user._id,
      products: orderProducts,
      shippingAddress,
      subtotal,
      discount,
      shippingCharge,
      total,
      couponCode,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/orders/my  (Customer)
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/orders/:id  (Customer — own order only, or Admin — any order)
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Customers can only view their own orders; admins can view any
    if (req.user.role !== "admin" && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/orders/:id/cancel  (Customer — only if still Pending)
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to cancel this order" });
    }
    if (order.orderStatus !== "Pending") {
      return res.status(400).json({ message: "Only pending orders can be cancelled" });
    }

    order.orderStatus = "Cancelled";
    await order.save();

    // Restock items
    for (const item of order.products) {
      const product = await Product.findById(item.product);
      if (product) {
        const sizeEntry = product.sizes.find((s) => s.size === item.size);
        if (sizeEntry) {
          sizeEntry.stock += item.quantity;
          await product.save();
        }
      }
    }

    res.json({ message: "Order cancelled", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/orders  (Admin — all orders)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/orders/:id/status  (Admin)
// body: { orderStatus: "Packed" | "Shipped" | "Delivered" | "Cancelled" }
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const validStatuses = ["Pending", "Packed", "Shipped", "Delivered", "Cancelled"];

    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
