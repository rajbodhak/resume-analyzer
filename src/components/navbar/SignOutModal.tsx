interface SignOutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const SignOutModal = ({ isOpen, onClose, onConfirm }: SignOutModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative bg-card border border-border rounded-lg shadow-lg p-6 max-w-md w-full mx-4 animate-in fade-in zoom-in-95 duration-200">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                    Sign Out
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                    Are you sure you want to sign out? You'll need to sign in again to access your analysis history.
                </p>

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-sm font-medium rounded-md bg-destructive text-primary-foreground hover:bg-destructive/90 transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};