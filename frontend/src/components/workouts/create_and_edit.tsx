import { Check, Plus, X } from "lucide-react";
import Card from "../card";
import { hasScheduledDate } from "./common_methods.tsx";

interface CreateAndEditProps {
    isCreating: boolean;
    setIsCreating: (value: boolean) => void;
    editingId: string | null;
    setEditingId: (id: string | null) => void;
    resetForm: () => void;
    formData: WorkoutFormData | RoutineFormData;
    setFormData: React.Dispatch<
        React.SetStateAction<WorkoutFormData | RoutineFormData>
    >;
    updateWorkoutOrRoutine: (data: {
        id: string;
        data: WorkoutFormData | RoutineFormData;
    }) => void;
    createWorkoutOrRoutine: (data: WorkoutFormData | RoutineFormData) => void;
}

export const CreateAndEdit: React.FC<CreateAndEditProps> = ({
    isCreating,
    setIsCreating,
    editingId,
    setEditingId,
    resetForm,
    formData,
    setFormData,
    updateWorkoutOrRoutine,
    createWorkoutOrRoutine,
}) => {
    const addExercise = () => {
        setFormData({
            ...formData,
            exercises: [
                ...formData.exercises,
                { name: "", sets: 0, reps: 0, weight: 0 },
            ],
        });
    };

    const removeExercise = (index: number) => {
        setFormData({
            ...formData,
            exercises: formData.exercises.filter((_, i) => i !== index),
        });
    };

    const updateExercise = (
        index: number,
        field: keyof Exercise,
        value: string | number,
    ) => {
        const newExercises = formData.exercises.map((exercise, i) =>
            i === index
                ? {
                      ...exercise,
                      [field]: field === "name" ? value : Number(value),
                  }
                : exercise,
        );
        setFormData({ ...formData, exercises: newExercises });
    };

    const createUpdateExerciseField = (
        exercise: Exercise,
        index: number,
        attribute: string,
        input_type: string,
    ) => {
        return (
            <input
                type={input_type}
                value={exercise[attribute as keyof Exercise] as string}
                onChange={(e) =>
                    updateExercise(
                        index,
                        attribute as keyof Exercise,
                        e.target.value,
                    )
                }
                placeholder={
                    attribute.charAt(0).toUpperCase() + attribute.slice(1)
                }
                className="text-white px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
        );
    };

    return (
        <>
            {(isCreating || editingId) && (
                <Card className="*:p-2">
                    <div className="flex items-center justify-between gap-2">
                        <h2 className="text-lg sm:text-xl font-semibold text-white">
                            {editingId ? "Edit Workout" : "Create New Workout"}
                        </h2>
                        <button
                            onClick={() => {
                                setIsCreating(false);
                                setEditingId(null);
                                resetForm();
                            }}
                            className="text-gray-400 hover:text-white flex-shrink-0"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                        {editingId ? <></> : <></>}
                        <div>
                            <label className="block text-sm font-medium text-white mb-1">
                                Workout Name
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                                className="text-white w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., Upper Body Strength"
                            />
                        </div>

                        {hasScheduledDate(formData) && (
                            <div>
                                <label className="block text-sm font-medium text-white mb-1">
                                    Scheduled Date & Time
                                </label>
                                <input
                                    type="datetime-local"
                                    value={formData.scheduled_date}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            scheduled_date: e.target.value,
                                        })
                                    }
                                    className="text-white w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        )}

                        <div>
                            <div className="flex items-center justify-between mb-3 sm:mb-4">
                                <label className="text-sm font-medium text-white">
                                    Exercises
                                </label>
                                <button
                                    onClick={addExercise}
                                    className="text-xs sm:text-sm text-blue-200 hover:text-blue-700 flex items-center gap-1"
                                >
                                    <Plus size={16} />
                                    Add Exercise
                                </button>
                            </div>

                            {formData.exercises.length > 0 && (
                                <div className="grid grid-cols-12 gap-2 sm:gap-3 mb-2">
                                    <div className="col-span-4">
                                        <p className="text-xs sm:text-sm font-medium text-white">
                                            Name
                                        </p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-xs sm:text-sm font-medium text-white">
                                            Sets
                                        </p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-xs sm:text-sm font-medium text-white">
                                            Reps
                                        </p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-xs sm:text-sm font-medium text-white">
                                            Weight
                                        </p>
                                    </div>
                                    <div className="col-span-1"></div>
                                </div>
                            )}

                            {formData.exercises.map((exercise, index) => (
                                <div
                                    key={index}
                                    className="grid grid-cols-12 gap-2 sm:gap-3 mb-2 items-end"
                                >
                                    <div className="col-span-4">
                                        {createUpdateExerciseField(
                                            exercise,
                                            index,
                                            "name",
                                            "text",
                                        )}
                                    </div>
                                    <div className="col-span-2">
                                        {createUpdateExerciseField(
                                            exercise,
                                            index,
                                            "sets",
                                            "number",
                                        )}
                                    </div>
                                    <div className="col-span-2">
                                        {createUpdateExerciseField(
                                            exercise,
                                            index,
                                            "reps",
                                            "number",
                                        )}
                                    </div>
                                    <div className="col-span-2">
                                        {createUpdateExerciseField(
                                            exercise,
                                            index,
                                            "weight",
                                            "number",
                                        )}
                                    </div>
                                    <div className="col-span-2 flex items-center justify-center h-full">
                                        <button
                                            onClick={() =>
                                                removeExercise(index)
                                            }
                                            className="text-red-600 hover:text-red-700 hover:bg-red-100 bg-red-50 p-2 rounded-lg transition-colors flex items-center justify-center w-full h-full"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white mb-1">
                                Comments
                            </label>
                            <textarea
                                maxLength={250}
                                value={formData.comments}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        comments: e.target.value,
                                    })
                                }
                                rows={3}
                                className="text-white w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Additional comments or instructions..."
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                            <button
                                onClick={() =>
                                    editingId
                                        ? updateWorkoutOrRoutine({
                                              id: editingId,
                                              data: formData,
                                          })
                                        : createWorkoutOrRoutine(formData)
                                }
                                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                            >
                                <Check size={20} />
                                {editingId
                                    ? "Update Workout"
                                    : "Create Workout"}
                            </button>
                            <button
                                onClick={() => {
                                    setIsCreating(false);
                                    setEditingId(null);
                                    resetForm();
                                }}
                                className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </Card>
            )}
        </>
    );
};
