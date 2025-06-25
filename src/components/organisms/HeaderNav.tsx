import React, { useState } from "react";
import { Link } from "react-router-dom";
// import SearchBar from "../molecules/SearchBar";
import styles from "./HeaderNav.module.scss";

interface HeaderNavProps {
  hideSearch?: boolean;
}

const HeaderNav: React.FC<HeaderNavProps> = ({ hideSearch = false }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: hook in real search logic
    setSearchOpen(false);
  };

  const closeSearch = () => {
    setSearchText("");
    setSearchOpen(false);
  };

  // const navLinks = (
  //   <>
  //     <Link className="text-white" to="#">
  //       Dashboard
  //     </Link>
  //     <Link className="text-white" to="/news">
  //       News Items
  //     </Link>
  //     <Link className="text-white" to="#">
  //       Clients
  //     </Link>
  //     <Link className="text-white" to="#">
  //       Reports
  //     </Link>
  //     <Link className="text-white" to="#">
  //       Settings
  //     </Link>
  //   </>
  // );

  return (
    <header className={styles.header}>
      <div className="flex items-center justify-between w-full h-full">
        <Link
          to="/"
          className="flex items-center gap-4 text-white hover:opacity-80 transition-opacity"
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
          <h2 className="text-lg font-bold tracking-tight">Echoes</h2>
        </Link>

        {/* <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
          {navLinks}
        </nav> */}

        {/* {!hideSearch && (
          <div className="hidden md:block max-w-xs flex-1">
            <SearchBar />
          </div>
        )} */}

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

        {/* <button
          type="button"
          className="text-white lg:hidden mr-2"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
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
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button> */}
      </div>

      {/* Mobile / Tablet search overlay */}
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
          {/* <nav className="flex flex-col gap-6 p-6 text-lg font-medium">
            {navLinks}
          </nav> */}
        </div>
      )}
    </header>
  );
};

export default HeaderNav;
