import { APIResponse } from "@/lib/server/response-utils";
import { useState } from "react";

// TODO: Make a global error type
export type FetchError = {
  message: string;
};

export function useFetch<T>(
  fetchArgs: { input: RequestInfo | URL; init?: RequestInit | undefined },
  defaultValue: T
) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T>(defaultValue);
  const [error, setError] = useState<FetchError | null>(null);

  const refetch = () => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { input, init } = fetchArgs;
        const response = await fetch(input, init);
        if (!response.ok) throw new Error("Something went wrong");
        const json = (await response.json()) as APIResponse<T>;
        if (!json.data) throw new Error("No data returned");
        setData(json.data);
      } catch (err) {
        setError({
          message:
            err instanceof Error
              ? err.message
              : "Something went wrong when fetching data",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  };

  return { loading, data, error, refetch };
}
