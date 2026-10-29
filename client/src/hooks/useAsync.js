import { useEffect, useState } from "react";

// Runs an async function when the page loads and whenever `deps` change.
// Returns { data, loading, error }.
//
//   const { data, loading, error } = useAsync(() => getArticles({ category }), [category]);
export function useAsync(asyncFn, deps) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    setState((previous) => ({ ...previous, loading: true, error: null }));

    asyncFn()
      .then((data) => !cancelled && setState({ data, loading: false, error: null }))
      .catch((error) => !cancelled && setState({ data: null, loading: false, error: error.message }));

    return () => {
      cancelled = true; // ignore results from outdated requests
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
