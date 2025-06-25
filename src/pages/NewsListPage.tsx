import React, { useState, useEffect, useRef, useCallback } from "react";
import HeaderNav from "../components/organisms/HeaderNav";
import NewsTable from "../components/organisms/NewsTable";
import styles from "./NewsListPage.module.scss";

import { INewsList } from "../types/NewsItem";
import { API_ENDPOINTS } from "../config/api";
import useDebounce from "../hooks/useDebounce";
import NewsFilters from "../components/organisms/NewsFilters";

export type NewsFilterKey = "category" | "status" | "search";

export interface NewsFiltersType {
  category: string;
  status: string;
  search: string;
}

const PAGE_SIZE = 10;

const NewsListPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0); // Using 0-based offset for API
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [filters, setFilters] = useState<NewsFiltersType>({
    category: "all",
    search: "",
    status: "all",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay
  const [newsItems, setNewsItems] = useState<INewsList[]>([]);

  // Handle filter changes
  const handleFilterChange = (key: NewsFilterKey, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "all" ? "" : value,
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm(""); // Clear the search input
    setFilters({
      category: "all",
      search: "",
      status: "all",
    });
  };

  // Check if filters are in their default state
  const areFiltersDefault = useCallback(() => {
    return (
      filters.category === "all" &&
      filters.status === "all" &&
      filters.search === ""
    );
  }, [filters]);

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
          // _start: offset,
          // _limit: PAGE_SIZE,
          ...(filters.category &&
            filters.category !== "all" && { category: filters.category }),
          ...(filters.search && { search: filters.search }),
          ...(filters.status &&
            filters.status !== "all" && { status: filters.status }),
        };
        console.log("offset and qp:", offset, queryParams);
        console.log("[fetchNews] Request params:", queryParams);
        const apiUrl = API_ENDPOINTS.NEWS.LIST(queryParams);

        const response = await fetch(apiUrl, {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-expect-error
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
    if (debouncedSearchTerm !== undefined) {
      handleFilterChange("search", debouncedSearchTerm);
    }
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

  // Don't return early, we'll handle loading and error states in the main return
  return (
    <div
      className={`relative flex min-h-screen flex-col overflow-x-hidden ${styles.pageRoot}`}
    >
      <HeaderNav hideSearch={true} />

      <main className="flex flex-1 justify-center px-3 md:px-10 pt-24 pb-5">
        <div className="w-full max-w-[95%] md:max-w-[90%]">
          <h1 className="mb-4 text-[32px] font-bold leading-tight tracking-tight text-white">
            All News Items
          </h1>

          <NewsFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={resetFilters}
            isResetDisabled={areFiltersDefault()}
          />

          {loading && newsItems.length === 0 ? (
            <div className="flex flex-1 items-center justify-center py-10">
              <div className="text-xl">Loading news items...</div>
            </div>
          ) : error ? (
            <div className="flex flex-1 items-center justify-center py-10">
              <div className="text-red-500">Error: {error}</div>
            </div>
          ) : (
            <>
              <NewsTable items={newsItems} />
              {loadingMore && (
                <div className="mt-4 text-center text-white">
                  Loading more items...
                </div>
              )}
              {hasMore && !loading && !loadingMore && (
                <div ref={loadMoreRef} className="h-1" />
              )}
              {/* {!hasMore && newsItems.length > 0 && (
                <div className="mt-4 text-center text-gray-400">
                  No more items to load
                </div>
              )} */}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default NewsListPage;
