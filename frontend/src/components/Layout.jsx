import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Layout = ({ title, subtitle, children }) => {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="page-shell">
      <header className="topbar glass-card">
        <div>
          <p className="eyebrow">AI learning system</p>
          <h1>{title}</h1>
          <p className="muted">{subtitle}</p>
        </div>
        <div className="topbar-actions">
          <nav>
            <Link className={pathname === "/dashboard" ? "active-link" : ""} to="/dashboard">
              Dashboard
            </Link>
            <Link className={pathname === "/interests" ? "active-link" : ""} to="/interests">
              Interests
            </Link>
          </nav>
          <div className="user-chip">
            <span>{user?.name}</span>
            <button type="button" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
};

export default Layout;
