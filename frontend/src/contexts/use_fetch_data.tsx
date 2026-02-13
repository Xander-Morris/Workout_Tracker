import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/apiclient";

export function useFetchData<T>(endpoint: string) {
    return useQuery<T[]>({
        queryKey: [endpoint],
        queryFn: async () => {
            const res = await apiClient.get(`/${endpoint}/`);
            return res.data as T[];
        },
    });
}
