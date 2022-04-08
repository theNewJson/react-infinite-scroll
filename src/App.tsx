import { useCallback, useState } from "react";
import "./App.css";
import SearchBar from "./components/SearchBar";
import List from "./components/List";
import useRepos from "./hooks/useRepos";

function App() {
  const [search, setSearch] = useState("");
  const { repos, loading, fetchMore, resetRepos, error } = useRepos({
    q: search,
  });
  const handleSearch = useCallback((search: string) => {
    setSearch(search);
  }, []);

  return (
    <div className="App">
      <SearchBar onSearch={handleSearch} onTyping={resetRepos} />
      {repos && (
        <List list={repos} isLoading={loading} onNextPage={fetchMore} />
      )}
      {error && <div>{error}</div>}
    </div>
  );
}

export default App;
