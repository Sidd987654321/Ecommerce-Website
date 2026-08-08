import { useEffect, useState } from "react";
import api from "../../api/axios.js";
import AdminLayout from "../../components/AdminLayout.jsx";

const StatCard = ({ label, value }) => (
  <div className="bg-panel border border-line rounded-lg px-6 py-5">
    <p className="text-xs font-mono uppercase tracking-wide text-muted mb-2">{label}</p>
    <p className="font-display text-4xl text-bone">{value ?? "—"}</p>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/admin/dashboard")
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load stats"));
  }, []);

  return (
    <AdminLayout eyebrow="Overview" title="Dashboard">
      {error && <p className="text-rustLight mb-4">{error}</p>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Products" value={stats?.totalProducts} />
        <StatCard label="Customers" value={stats?.totalUsers} />
        <StatCard label="Total Orders" value={stats?.totalOrders} />
        <StatCard label="Pending Orders" value={stats?.pendingOrders} />
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
