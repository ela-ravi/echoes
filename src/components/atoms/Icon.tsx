import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  children: React.ReactNode;
}

const Icon: React.FC<IconProps> = ({ size = 20, children, ...rest }) => (
  <svg
    width={size}
    height={size}
    fill="currentColor"
    viewBox="0 0 256 256"
    {...rest}
  >
    {children}
  </svg>
);

export default Icon;
