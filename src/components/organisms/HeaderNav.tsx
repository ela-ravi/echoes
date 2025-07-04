import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import styles from "./HeaderNav.module.scss";

interface HeaderNavProps {
  hideSearch?: boolean;
  showLoginButton?: boolean;
}
const HeaderAuthSection = ({
  showLoginButton,
  handleLogout,
}: {
  showLoginButton: boolean;
  handleLogout: () => void;
}) => {
  if (showLoginButton) {
    return (
      <Link
        to="/login"
        className="ml-4 text-white hover:opacity-80 transition-opacity flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
        aria-label="Login"
      >
        <span>Login</span>
      </Link>
    );
  } else {
    return (
      <button
        onClick={handleLogout}
        className="ml-4 text-white hover:opacity-80 transition-opacity flex items-center gap-2"
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
    );
  }
};
const HeaderNav: React.FC<HeaderNavProps> = ({
  hideSearch = false,
  showLoginButton = false,
}) => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  // const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isRegisterPage = ["/register"].includes(window.location.pathname);

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
    <header className={styles.header}>
      <div className="flex items-center justify-between w-full h-full">
        {!isRegisterPage && (
          <Link
            to="/news"
            className="flex items-center gap-3 text-white hover:opacity-80 transition-opacity"
          >
            <img
              src="/assets/echoes-logo.png"
              alt="Echoes Logo"
              className="h-16 w-auto"
            />
            <h2 className="text-lg font-bold tracking-tight">Echoes</h2>
          </Link>
        )}

        {!hideSearch && (
          <button
            type="button"
            className="text-white md:hidden mr-2"
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

        {/* Login/Logout button */}

        <HeaderAuthSection
          showLoginButton={showLoginButton}
          handleLogout={handleLogout}
        />

        {/* {showLoginButton ? (
          <Link
            to="/login"
            className="ml-4 text-white hover:opacity-80 transition-opacity flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
            aria-label="Login"
          >
            <span>Login</span>
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            className="ml-4 text-white hover:opacity-80 transition-opacity flex items-center gap-2"
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
        )} */}
      </div>

      {/* User menu */}
      {/* <div className="relative ml-4">
          <button
            type="button"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
            aria-label="User menu"
            aria-expanded={userMenuOpen}
          >
            <div className="size-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
              U
            </div>
            <span className="hidden md:inline">User</span>
            <svg
              className={`size-4 transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          
          {userMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setUserMenuOpen(false)}
                aria-hidden="true"
              />
              <div className="absolute right-0 mt-2 w-48 bg-[var(--color-bg-card)] rounded-md shadow-lg py-1 z-20">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]"
                  onClick={() => setUserMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]"
                  onClick={() => setUserMenuOpen(false)}
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-status-error)]"
                >
                  Sign out
                </button>
              </div>
            </>
          )}
        </div> */}
      {/* </div> */}

      {/* Mobile/Tablet search overlay */}
      {searchOpen && (
        <>
          <div className="fixed inset-x-0 top-0 z-50 flex items-center bg-[#131520] p-4 h-16">
            <form
              onSubmit={handleSearchSubmit}
              className="flex-1 flex items-center gap-3"
            >
              <input
                type="search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search..."
                className="flex-1 rounded-lg bg-[#282d43] px-4 py-2 text-white placeholder:text-[#99a0c2] focus:outline-none"
                autoFocus
              />
            </form>
            <button
              type="button"
              aria-label="Close search"
              onClick={closeSearch}
              className="text-white ml-3"
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
        <div className="fixed inset-0 z-50 flex flex-col bg-[#131520]/95 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between p-4">
            <span className="text-xl font-bold text-white">Menu</span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="text-white"
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

export default HeaderNav;
