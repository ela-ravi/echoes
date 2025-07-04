import React, { useState, useEffect } from "react";
import HeaderNav from "../../components/organisms/HeaderNav";
import PageContainer from "../../components/atoms/PageContainer";
import { newsService, ClientStat } from "../../services/newsService";

const Tenants: React.FC = () => {
  const [clientStats, setClientStats] = useState<[] | ClientStat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientStats = async () => {
      try {
        setLoading(true);
        const data = await newsService.fetchClientStats();
        setClientStats(data);
      } catch (err) {
        console.error("Error fetching client stats:", err);
        setError("Failed to load client statistics. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchClientStats();
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[var(--color-bg-dark)]">
      <HeaderNav />
      <main className="flex-1">
        <PageContainer>
          <div className="w-full max-w-[95%] md:max-w-[90%] py-8">
            <h1 className="mb-6 text-3xl font-bold text-[var(--color-text-primary)]">
              Tenants
            </h1>
            <div className="rounded-lg bg-[var(--color-bg-card)] p-6 shadow-lg">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-ui-primary)]"></div>
                </div>
              ) : error ? (
                <div className="text-[var(--color-ui-danger)] text-center py-4">
                  {error}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y-2 divide-[var(--color-ui-border)]">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-primary)] uppercase tracking-wider">
                          Client Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-primary)] uppercase tracking-wider">
                          Published News
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-primary)] uppercase tracking-wider">
                          Rejected News
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-primary)] uppercase tracking-wider">
                          In Review
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-[var(--color-bg-card)] divide-y-2 divide-[var(--color-ui-border)]">
                      {clientStats.map((client, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--color-text-primary)]">
                            {client.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">
                            {client.publishedNewsCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">
                            {client.totalRejectedNewsCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">
                            {client.totalReviewedNewsCount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </PageContainer>
      </main>
    </div>
  );
};

export default Tenants;
