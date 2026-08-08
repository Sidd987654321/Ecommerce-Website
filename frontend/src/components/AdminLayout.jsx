import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const navItems = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/orders", label: "Orders" },
];

const AdminLayout = ({ children, title, eyebrow }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-ink text-bone">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-line bg-charcoal flex flex-col">
        <div className="px-6 py-6 border-b border-line">
          <p className="font-mono text-[10px] tracking-[0.25em] text-rustLight uppercase">
            Ecommerce
          </p>
          <p className="font-display text-xl mt-1">Control Room</p>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block px-3 py-2 rounded text-sm transition-colors ${
                  isActive
                    ? "bg-rust/15 text-rustLight border border-rust/30"
                    : "text-muted hover:text-bone hover:bg-panel border border-transparent"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-6 py-5 border-t border-line">
          <p className="text-sm text-bone">{user?.name}</p>
          <p className="text-xs text-muted mb-3">{user?.email}</p>
          <button
            onClick={handleLogout}
            className="text-xs font-mono uppercase tracking-wide text-rustLight hover:text-rust transition-colors"
          >
            Sign out →
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 px-10 py-8 max-w-6xl">
        {eyebrow && (
          <p className="font-mono text-xs tracking-[0.25em] text-rustLight uppercase mb-2">
            {eyebrow}
          </p>
        )}
        {title && <h1 className="font-display text-3xl mb-8">{title}</h1>}
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
