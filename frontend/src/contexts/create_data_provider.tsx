import { createContext, useContext, type ReactNode } from "react";
import { useFetchData } from "./use_fetch_data";

export function createDataProvider<T>(endpoint: string) {
    const Context = createContext<T[] | undefined>(undefined);

    const Provider = ({ children }: { children: ReactNode }) => {
        const { data = [] } = useFetchData<T>(endpoint);
        return <Context.Provider value={data}>{children}</Context.Provider>;
    };

    const useData = () => {
        const ctx = useContext(Context);
        if (!ctx)
            throw new Error(`useData must be inside ${endpoint} Provider`);
        return ctx;
    };

    return { Provider, useData };
}
