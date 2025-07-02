import React from "react";
import HeaderNav from "../../components/organisms/HeaderNav";
import PageContainer from "../../components/atoms/PageContainer";

const Tenants: React.FC = () => {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-gray-900">
      <HeaderNav />
      <main className="flex-1">
        <PageContainer>
          <div className="w-full max-w-[95%] md:max-w-[90%] py-8">
            <h1 className="mb-6 text-3xl font-bold text-white">Tenants</h1>
            <div className="rounded-lg bg-gray-800 p-6 shadow-lg">
              <p className="text-gray-300">
                Tenants management content will go here.
              </p>
            </div>
          </div>
        </PageContainer>
      </main>
    </div>
  );
};

export default Tenants;
