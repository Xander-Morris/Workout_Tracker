import type { FC } from "react";
import { DatesLibrary } from "../../lib/dates.tsx";
import { Calendar, Edit2, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "../card.tsx";
import { hasScheduledDate } from "./common_methods.tsx";

interface ListedWorkoutOrRoutineProps {
    obj: Workout | Routine;
    setExpandedId: (id: string | null) => void;
    expandedId: string | null;
    startEdit?: (obj: Workout | Routine) => void;
    deleteObj?: (id: string) => void;
}

export const ListedWorkoutOrRoutine: FC<ListedWorkoutOrRoutineProps> = ({
    obj,
    expandedId,
    setExpandedId,
    startEdit,
    deleteObj,
}) => {
    const getTotalWorkoutVolume = (): number => {
        return obj.exercises.reduce(
            (total, exercise) =>
                total + exercise.sets * exercise.reps * exercise.weight,
            0,
        );
    };

    return (
        <>
            <Card className="*:p-2" key={obj.id}>
                <div className="p-4">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white">
                                {obj.name}
                            </h3>
                            {hasScheduledDate(obj) && obj.scheduled_date && (
                                <div className="flex items-center gap-2 mt-1 text-sm text-white">
                                    <Calendar size={16} />
                                    {DatesLibrary.formatDateToLocaleDateString(
                                        obj.scheduled_date,
                                    )}
                                </div>
                            )}
                            {obj.exercises && obj.exercises.length > 0 && (
                                <p className="text-sm text-white mt-1">
                                    {obj.exercises.length} exercise
                                    {obj.exercises.length !== 1 ? "s" : ""}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() =>
                                    setExpandedId(
                                        expandedId === obj.id ? null : obj.id,
                                    )
                                }
                                className="p-2 text-white hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                {expandedId === obj.id ? (
                                    <ChevronUp size={20} />
                                ) : (
                                    <ChevronDown size={20} />
                                )}
                            </button>
                            {startEdit && deleteObj && (
                                <>
                                    <button
                                        onClick={() => startEdit(obj)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Edit2 size={20} />
                                    </button>
                                    <button
                                        onClick={() => deleteObj(obj.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {expandedId === obj.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="bg-gray-50 rounded p-3 text-sm mb-2">
                                <div className="font-medium text-gray-900 mb-0">
                                    <p>
                                        Total Volume:{" "}
                                        {getTotalWorkoutVolume().toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            {obj.exercises && obj.exercises.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="text-sm font-medium text-white mb-2">
                                        Exercises
                                    </h4>
                                    <div className="space-y-2">
                                        {obj.exercises.map((exercise, idx) => (
                                            <div
                                                key={idx}
                                                className="bg-gray-50 rounded p-3 text-sm"
                                            >
                                                <div className="font-medium text-gray-900">
                                                    {exercise.name}
                                                </div>
                                                <div className="text-gray-600 mt-1">
                                                    {exercise.sets} sets ×{" "}
                                                    {exercise.reps} reps
                                                    {` @ ${exercise.weight.toLocaleString()} lbs`}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {obj.comments && (
                                <div>
                                    <h4 className="text-sm font-medium text-white mb-2">
                                        Comments
                                    </h4>
                                    <p className="break-words whitespace-normal text-sm text-gray-600 bg-gray-50 rounded p-5">
                                        {obj.comments}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Card>
        </>
    );
};

export default ListedWorkoutOrRoutine;
