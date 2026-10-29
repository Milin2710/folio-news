import { Bookmark, LogOut, Menu, Moon, Search, Sun, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  function handleSearch(event) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    setMenuOpen(false);
  }

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo" onClick={closeMenu}>
          Folio<span>News</span>
        </Link>

        <button
          className="icon-button navbar__toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className={`navbar__menu ${menuOpen ? "is-open" : ""}`}>
          <nav className="navbar__links">
            <NavLink to="/" end onClick={closeMenu}>Home</NavLink>
            <NavLink to="/trending" onClick={closeMenu}>Trending</NavLink>
            {user && (
              <NavLink to="/bookmarks" onClick={closeMenu}>
                <Bookmark size={15} /> Bookmarks
              </NavLink>
            )}
          </nav>

          <form className="navbar__search" onSubmit={handleSearch}>
            <Search size={16} />
            <input
              type="search"
              placeholder="Search news"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </form>

          <div className="navbar__actions">
            <button className="icon-button" onClick={toggleTheme} aria-label="Toggle dark mode">
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              <>
                <span className="navbar__user">{user.name}</span>
                <button className="icon-button" onClick={logout} aria-label="Log out" title="Log out">
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="button button--ghost" onClick={closeMenu}>Log in</Link>
                <Link to="/signup" className="button" onClick={closeMenu}>Sign up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
