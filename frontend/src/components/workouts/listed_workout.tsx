import { ListedWorkoutOrRoutine } from "./listed_workout_or_routine";

interface ListedWorkoutProps {
    workout: Workout;
    setExpandedId: (id: string | null) => void;
    expandedId: string | null;
    startEdit?: (workout: Workout | Routine) => void;
    deleteWorkout?: (id: string) => void;
}

export const ListedWorkout: React.FC<ListedWorkoutProps> = ({
    workout,
    setExpandedId,
    expandedId,
    startEdit,
    deleteWorkout,
}) => {
    return (
        <ListedWorkoutOrRoutine
            obj={workout}
            setExpandedId={setExpandedId}
            expandedId={expandedId}
            startEdit={startEdit}
            deleteObj={deleteWorkout}
        />
    );
};

export default ListedWorkout;
