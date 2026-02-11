
'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
// import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Wallet, Mail, Lock, User as UserIcon, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const { loginWithEmail, registerWithEmail, sendPasswordResetEmail, loading } = useAuth();
    // const router = useRouter();

    const [isLogin, setIsLogin] = useState(true);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState(''); // Only for register
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);



    const [successMessage, setSuccessMessage] = useState('');

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsLoading(true);

        try {
            if (isForgotPassword) {
                await sendPasswordResetEmail(email);
                setSuccessMessage('Password reset link sent! Check your email.');
                return;
            }

            if (isLogin) {
                await loginWithEmail(email, password);
            } else {
                if (!name) {
                    throw new Error('Please enter your name');
                }
                const result = await registerWithEmail(email, password, name);
                if (result.needsVerification) {
                    setSuccessMessage('Registration successful! Please check your email to confirm your account.');
                    setIsLogin(true); // Switch to login screen
                }
            }
        } catch (err: unknown) {
            console.error(err);
            let msg = 'Authentication failed.';

            // Common Supabase Auth Errors
            // Type guard to access properties safely
            const errorObj = err as { code?: string; message?: string };
            if (errorObj.code === 'auth/invalid-credential') msg = 'Invalid email or password. If you used this app before, please create a new account.';
            if (errorObj.code === 'auth/email-already-in-use') msg = 'This email is already registered. Please log in instead.';
            if (errorObj.code === 'auth/weak-password') msg = 'Password should be at least 6 characters.';
            if (errorObj.message && errorObj.message.includes('security purposes')) msg = 'Too many attempts. Please wait 30 seconds before trying again.';
            if (errorObj.message && (errorObj.message.includes('rate limit') || errorObj.message.includes('Too many requests'))) msg = 'Too many attempts. Please wait a while before trying again.';
            if (errorObj.message && errorObj.message.includes('Email not confirmed')) msg = 'Please check your email to confirm your account before logging in.';
            if (errorObj.message && errorObj.message.includes('Invalid login credentials')) msg = 'Invalid email or password. If you registered recently, check your email for verification.';

            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
            <Card className="w-full max-w-md border-indigo-100 shadow-xl shadow-indigo-500/10">
                <CardHeader className="space-y-1 items-center text-center">
                    <div className="w-12 h-12 bg-gradient-to-tr from-primary to-violet-500 rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-indigo-500/30 mb-2">
                        <Wallet className="h-7 w-7" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-indigo-950">
                        {isForgotPassword ? 'Reset Password' : (isLogin ? 'Welcome Back' : 'Create Account')}
                    </CardTitle>
                    <CardDescription>
                        {isForgotPassword
                            ? 'Enter your email to receive a password reset link'
                            : (isLogin ? 'Sign in to access your finances' : 'Get started with tracking your expenses')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="space-y-4">
                            {/* Email Form */}
                            <form onSubmit={handleEmailSubmit} className="space-y-4">
                                {!isLogin && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Full Name</label>
                                        <div className="relative">
                                            <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="John Doe"
                                                className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="m@example.com"
                                            className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                    </div>
                                </div>

                                {!isForgotPassword && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-medium">Password</label>
                                            {isLogin && (
                                                <button
                                                    type="button"
                                                    onClick={() => { setIsForgotPassword(true); setError(''); setSuccessMessage(''); }}
                                                    className="text-xs text-primary hover:underline"
                                                >
                                                    Forgot Password?
                                                </button>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            />
                                        </div>
                                    </div>
                                )}

                                {successMessage && (
                                    <div className="text-sm text-green-600 font-medium bg-green-50 p-2 rounded text-center">
                                        {successMessage}
                                    </div>
                                )}

                                {error && (
                                    <div className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded text-center">
                                        {error.replace('Firebase:', '').replace('auth/', '')}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading || loading}
                                    className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                                >
                                    {isLoading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        isForgotPassword ? 'Send Reset Link' : (isLogin ? 'Login' : 'Create Account')
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <div className="w-full text-center">
                        {isForgotPassword ? (
                            <button
                                type="button"
                                onClick={() => { setIsForgotPassword(false); setError(''); setSuccessMessage(''); }}
                                className="text-sm text-primary hover:underline hover:text-primary/80"
                            >
                                Back to Login
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => { setIsLogin(!isLogin); setError(''); setSuccessMessage(''); }}
                                className="text-sm text-primary hover:underline hover:text-primary/80"
                            >
                                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
                            </button>
                        )}
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
