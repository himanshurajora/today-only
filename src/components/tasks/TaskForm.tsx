import { useState } from 'react';
import { useSession } from '../../context/SessionContext';
import { validateTaskTitle } from '../../utils/validation';

interface TaskFormProps {
    onClose: () => void;
}

export const TaskForm = ({ onClose }: TaskFormProps) => {
    const { createTask } = useSession();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [notes, setNotes] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validation = validateTaskTitle(title);
        if (!validation.isValid) {
            setError(validation.error || '');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await createTask({ title, description, notes });
            onClose();
        } catch (err) {
            setError('Failed to create task');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-purple-900 to-indigo-900 p-8 rounded-3xl shadow-2xl w-full max-w-2xl border border-white/20">
                <h2 className="text-3xl font-bold text-white mb-6">✨ Create New Task</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="title" className="block text-white font-semibold mb-2 text-lg">
                            Title *
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-400 text-lg"
                            placeholder="What needs to be done?"
                            disabled={loading}
                            autoFocus
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-white font-semibold mb-2 text-lg">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-400 text-lg resize-none"
                            placeholder="Add more details..."
                            rows={3}
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label htmlFor="notes" className="block text-white font-semibold mb-2 text-lg">
                            Notes
                        </label>
                        <textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-400 text-lg resize-none"
                            placeholder="Any additional notes..."
                            rows={3}
                            disabled={loading}
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/20 border border-red-400 text-red-200 px-4 py-3 rounded-xl">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:from-pink-600 hover:to-purple-700 transition transform hover:scale-105 disabled:opacity-50 text-lg"
                        >
                            {loading ? 'Creating...' : 'Create Task'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 bg-white/20 text-white font-bold py-3 px-6 rounded-xl hover:bg-white/30 transition text-lg"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

