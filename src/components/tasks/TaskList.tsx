import { useState } from 'react';
import _ from 'lodash';
import { useSession } from '../../context/SessionContext';
import { TaskItem } from './TaskItem';
import { TaskForm } from './TaskForm';

export const TaskList = () => {
    const { tasks } = useSession();
    const [showTaskForm, setShowTaskForm] = useState(false);

    const completedTasks = _.filter(tasks, { completed: true });
    const pendingTasks = _.filter(tasks, { completed: false });
    const completionRate = tasks.length > 0
        ? Math.round((completedTasks.length / tasks.length) * 100)
        : 0;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white">Today's Tasks</h2>
                    <p className="text-white/60 mt-1">
                        {pendingTasks.length} pending · {completedTasks.length} completed · {completionRate}% done
                    </p>
                </div>
                <button
                    onClick={() => setShowTaskForm(true)}
                    className="bg-gradient-to-r from-gray-700 to-gray-900 text-white font-bold py-3 px-8 rounded-full hover:from-gray-600 hover:to-gray-800 transition transform hover:scale-105 text-lg shadow-lg border border-white/10"
                >
                    + Add Task
                </button>
            </div>

            {tasks.length === 0 ? (
                <div className="text-center py-20">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-2xl font-semibold text-white mb-2">No tasks yet</h3>
                    <p className="text-white/60 text-lg">Create your first task to get started!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {_.map(pendingTasks, (task) => (
                        <TaskItem key={task.id} task={task} />
                    ))}

                    {completedTasks.length > 0 && (
                        <>
                            <div className="pt-4">
                                <h3 className="text-xl font-semibold text-white/60 mb-3">Completed</h3>
                            </div>
                            {_.map(completedTasks, (task) => (
                                <TaskItem key={task.id} task={task} />
                            ))}
                        </>
                    )}
                </div>
            )}

            {showTaskForm && <TaskForm onClose={() => setShowTaskForm(false)} />}
        </div>
    );
};

