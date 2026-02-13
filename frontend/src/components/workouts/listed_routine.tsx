import { ListedWorkoutOrRoutine } from "./listed_workout_or_routine";

interface ListedRoutineProps {
    routine: Routine;
    setExpandedId: (id: string | null) => void;
    expandedId: string | null;
    startEdit?: (routine: Routine | Workout) => void;
    deleteRoutine?: (id: string) => void;
}

export const ListedRoutine: React.FC<ListedRoutineProps> = ({
    routine,
    setExpandedId,
    expandedId,
    startEdit,
    deleteRoutine,
}) => {
    return (
        <ListedWorkoutOrRoutine
            obj={routine}
            setExpandedId={setExpandedId}
            expandedId={expandedId}
            startEdit={startEdit}
            deleteObj={deleteRoutine}
        />
    );
};

export default ListedRoutine;
