export function hasScheduledDate(
    obj: Workout | Routine | WorkoutFormData | RoutineFormData,
): obj is Workout {
    return (obj as Workout).scheduled_date !== undefined;
}
