import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { validateEmail, validatePassword } from '../../utils/validation';

export const LoginForm = () => {
    const { login, register } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string; general?: string }>({});
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        const newErrors: typeof errors = {};

        const emailValidation = validateEmail(email);
        if (!emailValidation.isValid) {
            newErrors.email = emailValidation.error;
        }

        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            newErrors.password = passwordValidation.error;
        }

        if (!isLogin && password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords don't match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await register(email, password);
            }
        } catch (error: any) {
            console.error('Auth error:', error);
            setErrors({ general: error.message || 'An error occurred' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/20">
                <h1 className="text-5xl font-bold text-white mb-2 text-center">
                    🕒 Today Only
                </h1>
                <p className="text-white/80 text-center mb-8">
                    Focus on what matters today
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-white font-semibold mb-2 text-lg">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition text-lg"
                            placeholder="you@example.com"
                            disabled={loading}
                        />
                        {errors.email && (
                            <p className="text-red-300 text-sm mt-1">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-white font-semibold mb-2 text-lg">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition text-lg"
                            placeholder="••••••"
                            disabled={loading}
                        />
                        {errors.password && (
                            <p className="text-red-300 text-sm mt-1">{errors.password}</p>
                        )}
                    </div>

                    {!isLogin && (
                        <div>
                            <label htmlFor="confirmPassword" className="block text-white font-semibold mb-2 text-lg">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition text-lg"
                                placeholder="••••••"
                                disabled={loading}
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-300 text-sm mt-1">{errors.confirmPassword}</p>
                            )}
                        </div>
                    )}

                    {errors.general && (
                        <div className="bg-red-500/20 border border-red-400 text-red-200 px-4 py-3 rounded-xl">
                            {errors.general}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:from-pink-600 hover:to-purple-700 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-xl shadow-lg"
                    >
                        {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setErrors({});
                            setConfirmPassword('');
                        }}
                        className="text-white/80 hover:text-white transition underline text-lg"
                    >
                        {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                    </button>
                </div>
            </div>
        </div>
    );
};

