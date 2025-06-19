import React, { useState, useEffect, useRef, useCallback } from "react";
import HeaderNav from "../components/organisms/HeaderNav";
import NewsTable from "../components/organisms/NewsTable";
// import { Input } from "../components/atoms/Input";
import { Select } from "../components/atoms/Select";
import { Button } from "../components/atoms/Button";
import styles from "./NewsListPage.module.scss";

import { INewsList } from "../types/NewsItem";
import { API_ENDPOINTS } from "../config/api";
import useDebounce from "../hooks/useDebounce";

const PAGE_SIZE = 10;

const NewsListPage: React.FC = () => {
  const [newsItems, setNewsItems] = useState<INewsList[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0); // Using 0-based offset for API
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [filters, setFilters] = useState({
    category: "",
    keyword: "",
    reviewed: undefined as boolean | undefined,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay

  // Handle filter changes
  const handleFilterChange = (
    key: keyof typeof filters,
    value: string | boolean | undefined,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "all" ? undefined : value,
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      category: "",
      keyword: "",
      reviewed: undefined,
    });
  };

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isMounted = useRef(true);
  const hasInitialLoad = useRef(false);

  const fetchNews = useCallback(
    async (pageNum: number, append = false) => {
      const setLoadingState = append ? setLoadingMore : setLoading;
      const currentLoadingState = append ? loadingMore : loading;

      // Skip if already loading the same page or if we're at the end
      if (currentLoadingState || (pageNum > 0 && !hasMore)) {
        console.log("Skipping fetch - already loading or no more items");
        return;
      }

      console.log(`[fetchNews] Fetching page ${pageNum}, append: ${append}`);

      // Set loading states
      setLoadingState(true);
      if (!append) {
        setNewsItems([]);
      }
      setError(null);

      const abortController = new AbortController();
      const isAborted = { current: false };

      try {
        const offset = pageNum * PAGE_SIZE;
        const queryParams = {
          _start: offset,
          _limit: PAGE_SIZE,
          ...(filters.category && { category: filters.category }),
          ...(filters.keyword && { q: filters.keyword }),
          ...(filters.reviewed !== undefined && { reviewed: filters.reviewed }),
        };
        console.log("offset and qp:", offset, queryParams);
        console.log("[fetchNews] Request params:", queryParams);
        const apiUrl = API_ENDPOINTS.NEWS.LIST(queryParams);

        const response = await fetch(apiUrl, {
          //@ts-ignore
          headers: {
            "ngrok-skip-browser-warning": true,
            "Content-Type": "application/json",
          },
          signal: abortController.signal,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to fetch news: ${response.status} ${errorText}`,
          );
        }

        const result = await response.json();
        if (!result) throw new Error("No data received from the server");

        // Ensure we have an array of items
        const paginatedItems: INewsList[] = Array.isArray(result)
          ? result
          : result && typeof result === "object"
            ? [result as INewsList]
            : [];

        console.log("[fetchNews] Received items:", paginatedItems);

        // Only update state if component is still mounted and not aborted
        if (isMounted.current && !isAborted.current) {
          setNewsItems((prevItems) =>
            append ? [...prevItems, ...paginatedItems] : paginatedItems,
          );
          setHasMore(paginatedItems.length === PAGE_SIZE);
          setPage(pageNum);
          setLoadingState(false);
        }
      } catch (err) {
        // Don't log aborted requests as errors
        const error = err as Error;
        if (error.name !== "AbortError") {
          console.error("Error fetching news:", error);
          if (isMounted.current && !isAborted.current) {
            setError(error.message || "An unknown error occurred");
          }
        }
      } finally {
        if (isMounted.current && !isAborted.current) {
          setLoadingState(false);
        }
      }

      // Return cleanup function
      return () => {
        isAborted.current = true;
        abortController.abort();
      };
    },
    [PAGE_SIZE, filters, isMounted, loading, loadingMore, hasMore],
  );

  // Initial data load and filter changes with debounce
  useEffect(() => {
    isMounted.current = true;
    hasInitialLoad.current = false;

    // Only fetch if component is mounted
    const fetchData = async () => {
      setPage(0);
      setLoading(true);
      await fetchNews(0, false);
      hasInitialLoad.current = true;
    };

    // Add a small delay to prevent rapid successive calls
    const timer = setTimeout(() => {
      if (isMounted.current) {
        fetchData();
      }
    }, 100); // Reduced debounce time

    return () => {
      isMounted.current = false;
      clearTimeout(timer);
    };
  }, [filters]); // Only depend on filters

  useEffect(() => {
    handleFilterChange("keyword", debouncedSearchTerm || undefined);
  }, [debouncedSearchTerm]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    const currentRef = loadMoreRef.current;
    if (
      !currentRef ||
      loading ||
      loadingMore ||
      !hasMore ||
      !hasInitialLoad.current
    )
      return;

    console.log("Setting up intersection observer");
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) {
        console.log("Intersection observer triggered - loading more");
        fetchNews(page + 1, true);
      }
    };

    // Clean up previous observer if it exists
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: "100px",
      threshold: 0.1,
    });

    observerRef.current.observe(currentRef);

    // Cleanup function
    return () => {
      if (observerRef.current) {
        console.log("Cleaning up intersection observer");
        observerRef.current.disconnect();
      }
    };
  }, [loading, loadingMore, hasMore, page, fetchNews]);

  if (loading && newsItems.length === 0) {
    return (
      <div className="relative flex min-h-screen flex-col bg-[#131520] text-white">
        <HeaderNav />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-xl">Loading news items...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative flex min-h-screen flex-col bg-[#131520] text-white">
        <HeaderNav />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-red-500">Error: {error}</div>
        </main>
      </div>
    );
  }
  return (
    <div
      className={`relative flex min-h-screen flex-col overflow-x-hidden ${styles.pageRoot}`}
    >
      <HeaderNav />

      <main className="flex flex-1 justify-center px-3 md:px-10 pt-24 pb-5">
        <div className="w-full max-w-[95%] md:max-w-[90%]">
          <h1 className="mb-4 text-[32px] font-bold leading-tight tracking-tight text-white">
            All News Items
          </h1>

          <div className={styles.filters}>
            <div className={styles.filterGroup}>
              {/* <div className={styles.searchWrapper}>
                <Input
                  id="search-news"
                  type="text"
                  placeholder="Search news..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div> */}

              <div className={styles.selectWrapper}>
                <Select
                  value={filters.category || "all"}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                  options={[
                    { value: "all", label: "All Categories" },
                    { value: "business", label: "Business" },
                    { value: "technology", label: "Technology" },
                    { value: "sports", label: "Sports" },
                  ]}
                />
              </div>

              <div className={styles.selectWrapper}>
                <Select
                  value={
                    filters.reviewed === undefined
                      ? "all"
                      : String(filters.reviewed)
                  }
                  onChange={(e) =>
                    handleFilterChange(
                      "reviewed",
                      e.target.value === "all"
                        ? undefined
                        : e.target.value === "true",
                    )
                  }
                  options={[
                    { value: "all", label: "All Status" },
                    { value: "true", label: "Reviewed" },
                    { value: "false", label: "Not Reviewed" },
                  ]}
                  // className={styles.select}
                />
              </div>

              <Button
                variant="outline"
                onClick={resetFilters}
                // className={styles.resetButton}
                className="hover:bg-muted border border-muted-foreground"
              >
                Reset Filters
              </Button>
            </div>
          </div>

          <NewsTable items={newsItems} />
          {loadingMore && (
            <div className="mt-4 text-center text-white">
              Loading more items...
            </div>
          )}
          {hasMore && !loading && !loadingMore && (
            <div ref={loadMoreRef} className="h-1" />
          )}
          {!hasMore && newsItems.length > 0 && (
            <div className="mt-4 text-center text-gray-400">
              No more items to load
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default NewsListPage;
