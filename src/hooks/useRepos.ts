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
  resetRepos: () => void;
  error?: string;
}

const useRepos = ({ q }: HookArgs): Return => {
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string>();
  const { get, loading } = useFetch<Fetch>(`https://api.github.com`);
  const [repos, setRepos] = useState<Repo[]>();

  const fetchRepos = useCallback(
    async (searchText, page) => {
      const data = await get(
        `/search/repositories?q=${searchText}&per_page=10&page=${page}`
      );
      if (data.items) {
        return data.items;
      }
      setError("Something went wrong! Try again later.");
      return undefined;
    },
    [get, setError]
  );

  const fetchMore = useCallback(async () => {
    const repos = await fetchRepos(q, page + 1);
    if (repos) {
      setRepos((prev) => [...(prev as Repo[]), ...repos]);
      setPage(page + 1);
    }
  }, [fetchRepos, page, q]);

  const resetRepos = useCallback(() => {
    setRepos(undefined);
    setPage(1);
  }, []);
  useEffect(() => {
    const initialFetch = async () => {
      setRepos(await fetchRepos(q, 1));
    };
    if (q) {
      resetRepos();
      initialFetch();
    }
  }, [q, fetchRepos, resetRepos]);

  return {
    repos,
    loading,
    fetchMore,
    resetRepos,
    error,
  };
};

export default useRepos;
