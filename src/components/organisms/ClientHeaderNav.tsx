import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import styles from "./HeaderNav.module.scss";
import { UserInfo } from "types/user";

interface HeaderNavProps {
  hideSearch?: boolean;
}

const ClientHeaderNav: React.FC<HeaderNavProps> = ({ hideSearch = false }) => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const userType = sessionStorage.getItem("userType");
  const isAdmin = userType === "ADMIN";
  const userInfo: UserInfo | null = JSON.parse(
    sessionStorage.getItem("userInfo") || "{}"
  );
  const homeText = isAdmin ? "Echoes" : userInfo?.name || "Home";

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      navigate("/login");
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: hook in real search logic
    setSearchOpen(false);
  };

  const closeSearch = () => {
    setSearchText("");
    setSearchOpen(false);
  };

  return (
    <header className={`${isAdmin ? styles.header : styles.clientHeader}`}>
      <div className="flex items-center justify-between w-full h-full">
        <Link
          to="/client-news"
          className="flex items-center gap-4 text-[var(--color-text-primary)] hover:opacity-80 transition-opacity"
        >
          <div className="size-4">
            <svg
              viewBox="0 0 48 48"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="24" cy="24" r="22" />
            </svg>
          </div>
          <h2 className="text-lg font-bold tracking-tight">{homeText}</h2>
        </Link>

        {!hideSearch && (
          <button
            type="button"
            className="text-[var(--color-text-primary)] md:hidden mr-2"
            onClick={() => setSearchOpen(true)}
            aria-label="Open search"
          >
            <svg
              className="size-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="11" cy="11" r="8" />
              <line
                x1="21"
                y1="21"
                x2="16.65"
                y2="16.65"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="ml-4 text-[var(--color-text-primary)] hover:opacity-80 transition-opacity flex items-center gap-2"
          aria-label="Sign out"
        >
          <span className="hidden md:inline">Sign out</span>
          <svg
            className="size-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </div>

      {/* Mobile/Tablet search overlay */}
      {searchOpen && (
        <>
          <div className="fixed inset-x-0 top-0 z-50 flex items-center bg-[var(--color-bg-header)] p-4 h-16">
            <form
              onSubmit={handleSearchSubmit}
              className="flex-1 flex items-center gap-3"
            >
              <input
                type="search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search..."
                className="flex-1 rounded-lg bg-[var(--color-ui-border)] px-4 py-2 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none"
                autoFocus
              />
            </form>
            <button
              type="button"
              aria-label="Close search"
              onClick={closeSearch}
              className="text-[var(--color-text-primary)] ml-3"
            >
              <svg
                className="size-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          {/* Click below header to close */}
          <div className="fixed inset-0 top-16 z-40" onClick={closeSearch} />
        </>
      )}

      {/* Mobile/Tablet overlay nav */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[var(--color-bg-header)]/95 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between p-4">
            <span className="text-xl font-bold text-[var(--color-text-primary)]">
              Menu
            </span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="text-[var(--color-text-primary)]"
            >
              <svg
                className="size-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default ClientHeaderNav;
