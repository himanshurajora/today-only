import { useState } from 'react';
import type { Task } from '../../types';
import { useSession } from '../../context/SessionContext';
import { getTimeAgo } from '../../utils/dateUtils';

interface TaskItemProps {
    task: Task;
}

export const TaskItem = ({ task }: TaskItemProps) => {
    const { toggleTaskComplete, deleteTask } = useSession();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleToggleComplete = async () => {
        try {
            await toggleTaskComplete(task.id, !task.completed);
        } catch (error) {
            console.error('Error toggling task:', error);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this task?')) {
            return;
        }

        setIsDeleting(true);
        try {
            await deleteTask(task.id);
        } catch (error) {
            console.error('Error deleting task:', error);
            setIsDeleting(false);
        }
    };

    return (
        <div
            className={`bg-white/10 backdrop-blur-lg p-5 rounded-2xl border border-white/20 transition-all ${task.completed ? 'opacity-60' : ''
                } ${isDeleting ? 'opacity-40' : ''}`}
        >
            <div className="flex items-start gap-4">
                <button
                    onClick={handleToggleComplete}
                    className={`flex-shrink-0 w-7 h-7 rounded-lg border-2 transition-all transform hover:scale-110 ${task.completed
                            ? 'bg-green-500 border-green-400'
                            : 'border-white/40 hover:border-white/60'
                        }`}
                    disabled={isDeleting}
                >
                    {task.completed && (
                        <svg className="w-full h-full text-white p-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </button>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                        <h3
                            className={`text-xl font-semibold text-white cursor-pointer ${task.completed ? 'line-through' : ''
                                }`}
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            {task.title}
                        </h3>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="flex-shrink-0 text-red-400 hover:text-red-300 transition p-1"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>

                    {task.description && (
                        <p className="text-white/70 mt-2 text-base">{task.description}</p>
                    )}

                    {isExpanded && task.notes && (
                        <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/10">
                            <p className="text-white/60 text-sm font-semibold mb-1">Notes:</p>
                            <p className="text-white/80 text-base whitespace-pre-wrap">{task.notes}</p>
                        </div>
                    )}

                    <p className="text-white/40 text-sm mt-2">
                        Created {getTimeAgo(task.createdAt)}
                    </p>
                </div>
            </div>
        </div>
    );
};

