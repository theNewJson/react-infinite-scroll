import { useCallback, useEffect, useState } from "react";
import useFetch from "use-http";

export interface Repo {
  full_name: string;
  description: string;
  html_url: string;
}

interface Fetch {
  items: Repo[];
}

interface HookArgs {
  q?: string;
}

interface Return {
  repos?: Repo[];
  loading: boolean;
  fetchMore: () => void;
  error?: Error;
}

const useRepos = ({ q }: HookArgs): Return => {
  const [page, setPage] = useState(1);
  const { get, loading, error, response } = useFetch<Fetch>(
    `https://api.github.com`
  );
  const [repos, setRepos] = useState<Repo[]>();

  const fetchRepos = useCallback(
    async (searchText, page) => {
      const data = await get(
        `/search/repositories?q=${searchText}&per_page=10&page=${page}`
      );

      if (response.ok) {
        return data.items;
      }
      return undefined;
    },
    [get, response]
  );

  const fetchMore = useCallback(async () => {
    const repos = await fetchRepos(q, page + 1);
    if (repos) {
      setRepos((prev) => [...(prev as Repo[]), ...repos]);
      setPage(page + 1);
    }
  }, [fetchRepos, page, q]);

  useEffect(() => {
    const initialFetch = async () => {
      setRepos(await fetchRepos(q, 1));
    };
    if (q) {
      setPage(1);
      setRepos(undefined);
      initialFetch();
    }
  }, [q, fetchRepos]);

  return {
    repos,
    loading,
    fetchMore,
    error,
  };
};

export default useRepos;
