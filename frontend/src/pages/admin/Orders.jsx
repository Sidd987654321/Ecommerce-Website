import { useEffect, useState } from "react";
import api from "../../api/axios.js";
import AdminLayout from "../../components/AdminLayout.jsx";

const STATUSES = ["Pending", "Packed", "Shipped", "Delivered", "Cancelled"];

const statusColor = {
  Pending: "text-rustLight",
  Packed: "text-sage",
  Shipped: "text-sage",
  Delivered: "text-sage",
  Cancelled: "text-muted",
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  const loadOrders = () => {
    api
      .get("/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load orders"));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (id, orderStatus) => {
    try {
      await api.put(`/orders/${id}/status`, { orderStatus });
      loadOrders();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <AdminLayout eyebrow="Fulfillment" title="Orders">
      {error && (
        <p className="text-rustLight bg-rust/10 border border-rust/30 rounded px-3 py-2 mb-6 text-sm">
          {error}
        </p>
      )}

      <div className="space-y-3">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-panel border border-line rounded-lg px-5 py-4 flex items-center justify-between gap-4"
          >
            <div className="min-w-0">
              <p className="font-mono text-xs text-muted truncate">#{order._id}</p>
              <p className="text-sm text-bone mt-0.5">
                {order.user?.name || "Unknown"} · {order.user?.email}
              </p>
              <p className="text-xs text-muted mt-0.5">
                {order.products.length} item{order.products.length !== 1 ? "s" : ""} · ₹
                {order.total}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className={`font-mono text-xs uppercase ${statusColor[order.orderStatus]}`}>
                {order.orderStatus}
              </span>
              <select
                value={order.orderStatus}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                className="bg-charcoal border border-line rounded px-2 py-1.5 text-sm focus:border-rust outline-none"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <p className="text-center text-muted py-10">No orders yet.</p>
        )}
      </div>
    </AdminLayout>
  );
};

export default Orders;
