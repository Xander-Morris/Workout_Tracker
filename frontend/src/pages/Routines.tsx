import { useState, type FC } from "react";
import { Navbar } from "../components/navbar";
import { useRoutines } from "../contexts/routines";
import ListedRoutine from "../components/workouts/listed_routine";

const Routines: FC = () => {
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const routines = useRoutines();

    return (
        <>
            <div className="background-primary">
                <Navbar />
                <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto pt-6 max-w-7xl">
                    <div className="mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                    My Routines (Work in Progress)
                                </h1>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 sm:mt-8">
                        <div className="space-y-4">
                            <ul className="space-y-4">
                                {routines.map((routine) => (
                                    <ListedRoutine
                                        routine={routine}
                                        expandedId={expandedId}
                                        setExpandedId={setExpandedId}
                                    />
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Routines;
