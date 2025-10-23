interface AlertDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
}

export const AlertDialog = ({ isOpen, onClose, title, message }: AlertDialogProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 animate-pulse">
            <div className="bg-gray-900/95 backdrop-blur-lg p-10 rounded-3xl shadow-2xl max-w-lg border-4 border-gray-600 animate-bounce">
                <div className="text-center">
                    <div className="text-7xl mb-4">⚠️</div>
                    <h2 className="text-4xl font-bold text-white mb-4">{title}</h2>
                    <p className="text-xl text-white/90 mb-8">{message}</p>
                    <button
                        onClick={onClose}
                        className="bg-white text-black font-bold py-4 px-10 rounded-full hover:bg-gray-200 transition transform hover:scale-110 text-xl shadow-lg"
                    >
                        I'm Back!
                    </button>
                </div>
            </div>
        </div>
    );
};

