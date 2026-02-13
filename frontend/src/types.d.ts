interface User {
    _id?: string;
    email?: string;
    username?: string;
    exp?: number;
}

interface Settings {
    bodyweight: number;
}

interface Exercise {
    name: string;
    sets: number;
    reps: number;
    weight: number;
}

interface CommonWorkoutAndRoutineMembers {
    id: string;
    name: string;
    exercises: Exercise[];
    comments: string;
    created_at?: string;
    updated_at?: string;
}

interface Workout extends CommonWorkoutAndRoutineMembers {
    scheduled_date: string;
}

interface Routine extends CommonWorkoutAndRoutineMembers {
    scheduled_date?: never;
}

interface CommonWorkoutAndRoutineFormData {
    name: string;
    exercises: Exercise[];
    comments: string;
}

interface WorkoutFormData extends CommonWorkoutAndRoutineFormData {
    scheduled_date: string;
}

interface RoutineFormData extends CommonWorkoutAndRoutineFormData {
    scheduled_date?: never;
}
