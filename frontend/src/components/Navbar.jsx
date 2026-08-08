import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 bg-ink/90 backdrop-blur border-b border-line">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-display text-2xl tracking-tight text-bone">
          ECOMMERCE
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-muted">
          <Link to="/" className="hover:text-bone transition-colors">
            Shop
          </Link>
          <a href="#new" className="hover:text-bone transition-colors">
            New Arrivals
          </a>
          <a href="#about" className="hover:text-bone transition-colors">
            About
          </a>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              {user.role === "admin" && (
                <button
                  onClick={() => navigate("/admin")}
                  className="text-xs font-mono uppercase tracking-wide text-rustLight hover:text-rust"
                >
                  Admin
                </button>
              )}
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="text-xs font-mono uppercase tracking-wide text-muted hover:text-bone"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-xs font-mono uppercase tracking-wide text-rustLight hover:text-rust"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
