import React from "react";

interface BadgeProps {
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ children }) => (
  <span className="rounded-full bg-[#282d43] px-4 py-1 text-white">
    {children}
  </span>
);

export default Badge;
