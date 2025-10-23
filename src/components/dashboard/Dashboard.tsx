import { useSession } from '../../context/SessionContext';
import { SessionControls } from '../session/SessionControls';
import { TaskList } from '../tasks/TaskList';
import { FocusTimer } from '../focus/FocusTimer';

export const Dashboard = () => {
    const { currentSession } = useSession();

    return (
        <div className="space-y-8">
            <SessionControls />

            {currentSession && (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <TaskList />
                        </div>
                        <div>
                            <FocusTimer />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

