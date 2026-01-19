import type { FC } from "react";
import { useEffect, useState } from "react";
import { apiClient } from "../lib/apiclient";
import { Navbar } from "../components/navbar";

const Reports: FC = () => {
    type STATUS_TYPE = "none" | "loading" | "error" | "success";
    type REPORT_TYPE_OPEN = "contains" | "volume" | "1rm";

    const [reportType, setReportType] = useState<REPORT_TYPE_OPEN>("contains");
    const [isVisible, setIsVisible] = useState(false);
    const [exercises, setExercises] = useState<string[]>([]);
    const [selectedExercise, setSelectedExercise] = useState("");
    const [status, setStatus] = useState<STATUS_TYPE>("none");
    const [workouts, setWorkouts] = useState<Workout[]>([]);

    const setReportTypeToContains = () => setReportType("contains");
    const setReportTypeToVolume = () => setReportType("volume");
    const setReportTypeTo1RM = () => setReportType("1rm");

    const fetchAllExercises = async () => {
        try {
            const response = await apiClient.get("/reports/exercises");
            setExercises(response.data.exercises);
        } catch (error) {
            console.error("Error fetching exercises report:", error);
        }
    };

    const fetchWorkoutsWithSelectedExercise = async () => {
        if (!selectedExercise) {
            setWorkouts([]);
            setStatus("none");
            return;
        }

        try {
            setStatus("loading");
            const response = await apiClient.post("/reports/contains", {
                exercise: selectedExercise,
            });
            setWorkouts(response.data.workouts);
            setStatus("success");
        } catch (error) {
            console.error("Error fetching workouts report:", error);
            setWorkouts([]);
            setStatus("error");
        }
    };

    const handleToggle = (exercise: string) => {
        const isDeselecting = selectedExercise === exercise;
        setSelectedExercise(isDeselecting ? "" : exercise);
        setIsVisible(false);
    };

    const toggleDropdown = () => setIsVisible(v => !v);

    useEffect(() => {
        fetchAllExercises();
    }, []);

    useEffect(() => {
        fetchWorkoutsWithSelectedExercise();
    }, [selectedExercise]);

    useEffect(() => {
        setSelectedExercise("");
        setWorkouts([]);
        setStatus("none");
    }, [reportType]);

    return (
        <div className="background-primary min-h-screen">
            <Navbar />
            {/* Selection for different types of reports */}
            <div className="pt-4 flex min-h-10 items-center justify-center">
                <button
                    onClick={setReportTypeToContains}
                    className={reportType == "contains" ? "mr-12 w-30 rounded-lg bg-blue-400 px-4 py-2 text-white" : "mr-12 w-30 rounded-lg bg-gray-400 px-4 py-2 text-white"}
                >
                    Contains
                </button>
                <button
                    onClick={setReportTypeToVolume}
                    className={reportType == "volume" ? "mr-12 w-30 rounded-lg bg-blue-400 px-4 py-2 text-white" : "mr-12 w-30 rounded-lg bg-gray-400 px-4 py-2 text-white"}
                >
                    Volume
                </button>
                <button
                    onClick={setReportTypeTo1RM}
                    className={reportType == "1rm" ? "mr-12 w-30 rounded-lg bg-blue-400 px-4 py-2 text-white" : "mr-12 w-30 rounded-lg bg-gray-400 px-4 py-2 text-white"}
                >
                    1RM
                </button>
            </div>

            {exercises.length === 0 ? (
                <div className="flex min-h-screen items-center justify-center">
                    <p className="text-lg text-gray-900">
                        No exercise data available for reports.
                    </p>
                </div>
            ) : (
                <>
                {/* Report: Contains */}
                {reportType === "contains" && (
                    <div className="flex justify-center pt-32">
                        <div className="w-full max-w-3xl px-4 flex flex-col items-center space-y-4">
                            {/* Heading */}
                            <h1 className="text-gray-900 text-lg text-center">
                                Select an exercise to show all workouts that contain it.
                            </h1>

                            {/* Selector */}
                            <div className="relative w-full">
                                <button
                                    onClick={toggleDropdown}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-left text-gray-900 shadow-sm"
                                >
                                    {selectedExercise || "Select an Exercise"}
                                    <span className="float-right">
                                        {isVisible ? "▲" : "▼"}
                                    </span>
                                </button>

                                {isVisible && (
                                    <ul className="absolute z-10 mt-2 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg">
                                        {exercises.map(exercise => (
                                            <li key={exercise}>
                                                <button
                                                    onClick={() => handleToggle(exercise)}
                                                    className={`w-full px-4 py-2 text-left text-gray-900 hover:bg-gray-100 ${
                                                        selectedExercise === exercise
                                                            ? "bg-gray-200 font-semibold"
                                                            : ""
                                                    }`}
                                                >
                                                    {exercise}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Report Panel */}
                            <div className="w-full rounded-xl bg-white p-6 shadow-md">
                                {status === "none" && (
                                    <p className="text-gray-600">
                                        Select an exercise to view related workouts.
                                    </p>
                                )}

                                {status === "loading" && (
                                    <p className="text-gray-600">
                                        Loading workouts…
                                    </p>
                                )}

                                {status === "error" && (
                                    <div className="space-y-4">
                                        <p className="text-red-600">
                                            Error fetching workouts.
                                        </p>
                                        <button
                                            onClick={fetchWorkoutsWithSelectedExercise}
                                            className="w-full rounded-lg bg-red-600 px-4 py-2 text-white"
                                        >
                                            Retry
                                        </button>
                                    </div>
                                )}

                                {status === "success" && (
                                    <div className="space-y-4">
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            Workouts containing “{selectedExercise}”
                                        </h2>

                                        <ul className="space-y-4">
                                            {workouts.map(workout => (
                                                <li
                                                    key={workout.id}
                                                    className="rounded-lg border border-gray-200 p-4"
                                                >
                                                    <h3 className="font-semibold text-gray-900">
                                                        {workout.name}
                                                    </h3>

                                                    <p className="text-sm text-gray-600">
                                                        Scheduled:{" "}
                                                        {new Date(workout.scheduled_date).toLocaleDateString()}
                                                    </p>

                                                    {workout.exercises?.length > 0 && (
                                                        <div className="mt-3">
                                                            <p className="font-medium text-gray-900">
                                                                Exercises
                                                            </p>
                                                            <ul className="list-disc list-inside text-sm">
                                                                {workout.exercises.map((exercise, i) => (
                                                                    <li key={i} className="text-gray-600">
                                                                        {exercise.name} — {exercise.sets}×{exercise.reps} @ {exercise.weight} lbs
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}

                                                    {workout.comments && (
                                                        <p className="mt-2 text-sm text-gray-700">
                                                            Comments: {workout.comments}
                                                        </p>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                {/* Report: Volume */}
                {reportType === "volume" && (
                    <div className="flex justify-center pt-32">
                        <h1 className="text-gray-900 text-lg">Volume Report</h1>
                        {/* I need to make the calendar picker a reusable component in the "components" folder that
                        can be used here and in the Workouts page. */}
                    </div>
                )}
            </>
            )}
        </div>
    );
};

export default Reports;