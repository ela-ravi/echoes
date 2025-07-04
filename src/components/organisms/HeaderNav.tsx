import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { useTheme } from "../../context/ThemeContext";
import styles from "./HeaderNav.module.scss";
import { UserInfo } from "types/user";

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
        className="ml-4 text-[var(--color-text-secondary)] hover:opacity-80 transition-opacity flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
        aria-label="Login"
      >
        <span>Login</span>
      </Link>
    );
  } else {
    return (
      <button
        onClick={handleLogout}
        className="ml-4 text-[var(--color-text-primary)] flex items-center gap-2 underline-offset-8 hover:underline transition-all ease-in-out"
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
  const isLoginPage = ["/login"].includes(window.location.pathname);

  const userType = sessionStorage.getItem("userType");
  const isClient = userType === "CLIENT";
  const userInfo: UserInfo | null = JSON.parse(
    sessionStorage.getItem("userInfo") || "{}",
  );

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

  const homeHref = useMemo(() => {
    if (isRegisterPage || isLoginPage) {
      return "/login";
    } else if (isClient) {
      return "/client-news";
    }
    return "/news";
  }, [isRegisterPage, isLoginPage, isClient]);

  const homeText = useMemo(() => {
    if (isClient) {
      return userInfo?.name || "Home";
    }
    return "ECHOES";
  }, [isClient, userInfo]);

  const { theme, toggleTheme } = useTheme();

  return (
    <header className={styles.header}>
      <div className="flex items-center justify-between w-full h-full">
        {
          <div className="flex items-center gap-6">
            <Link
              to={homeHref}
              className="flex items-center gap-3 text-[var(--color-text-primary)] underline-offset-8 hover:underline"
            >
              <img
                src="/assets/echoes-logo.png"
                alt="Echoes Logo"
                className="h-20 w-auto"
              />
              <h2 className="text-lg font-bold tracking-tight">{homeText}</h2>
            </Link>
          </div>
        }

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

        {/* Login/Logout button */}

        <div className="flex items-center space-x-6">
          {!isLoginPage && (
            <>
              {!isClient && (
                <nav className="hidden md:block">
                  <Link
                    to="/tenants"
                    className="text-[var(--color-text-primary)] underline-offset-8 hover:underline"
                    aria-label="Tenants"
                  >
                    Tenants
                  </Link>
                </nav>
              )}
              <HeaderAuthSection
                showLoginButton={showLoginButton}
                handleLogout={handleLogout}
              />
            </>
          )}

          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${theme === "light" ? "hover:bg-[var(--color-black)]" : "hover:bg-gray-600"} transition-colors`}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? (
              <svg
                className="w-5 h-5"
                fill="white"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="white"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            )}
          </button>
        </div>
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

export default HeaderNav;
