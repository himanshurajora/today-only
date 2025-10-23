import { useAuth } from '../../context/AuthContext';

export const Header = () => {
    const { user, logout } = useAuth();

    return (
        <header className="bg-white/5 backdrop-blur-lg border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="text-4xl">🕒</div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Today Only</h1>
                            <p className="text-white/60 text-sm">Focus on what matters today</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-white/80 font-semibold">{user?.email}</p>
                        </div>
                        <button
                            onClick={logout}
                            className="bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-6 rounded-full transition border border-white/20"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

