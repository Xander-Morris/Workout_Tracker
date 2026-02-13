import { createDataProvider } from "./create_data_provider";

export const { Provider: WorkoutsProvider, useData: useWorkouts } =
    createDataProvider<Workout>("workouts");
