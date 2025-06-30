import React, { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = "",
}) => {
  return (
    <main
      className={`flex flex-1 justify-center px-3 md:px-10 pt-24 pb-5 ${className}`}
    >
      {children}
    </main>
  );
};

export default PageContainer;
