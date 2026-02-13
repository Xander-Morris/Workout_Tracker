import { createDataProvider } from "./create_data_provider";

export const { Provider: RoutinesProvider, useData: useRoutines } =
    createDataProvider<Routine>("routines");
