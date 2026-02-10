
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, Mail, Camera, Save, Loader2, Lock, Key } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function ProfilePage() {
    const { user, updateUserProfile, changePassword } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [photoURL, setPhotoURL] = useState('');

    // Password state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.username || '');
            setEmail(user.email || '');
            setPhotoURL(user.photoURL || '');
        }
    }, [user]);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            await updateUserProfile(name, photoURL);
            setMessage('Profile updated successfully!');
        } catch (error) {
            console.error(error);
            setMessage('Failed to update profile.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPasswordLoading(true);
        setPasswordMessage('');

        if (!currentPassword || !newPassword) {
            setPasswordMessage('Please fill all password fields.');
            setIsPasswordLoading(false);
            return;
        }

        try {
            await changePassword(currentPassword, newPassword);
            setPasswordMessage('Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
        } catch (error: any) {
            console.error(error);
            setPasswordMessage(error.message || 'Failed to change password.');
        } finally {
            setIsPasswordLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-indigo-950">My Profile</h2>

            <Card className="border-0 shadow-lg shadow-gray-200/50">
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your profile details.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSaveProfile} className="space-y-6">
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center gap-4 py-4">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center border-4 border-white shadow-md overflow-hidden">
                                    {photoURL ? (
                                        <img src={photoURL} alt={name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="h-10 w-10 text-indigo-400" />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Display Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Avatar URL</label>
                                <div className="relative">
                                    <Camera className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        value={photoURL}
                                        onChange={(e) => setPhotoURL(e.target.value)}
                                        placeholder="https://..."
                                        className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="email"
                                    value={email}
                                    disabled
                                    className="flex h-10 w-full rounded-md border border-input bg-gray-50 text-gray-500 pl-10 pr-3 py-2 text-sm cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {message && (
                            <div className={`text-sm p-3 rounded-md text-center ${message.includes('success') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                {message}
                            </div>
                        )}

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                            >
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Save Changes
                            </button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card className="border-0 shadow-lg shadow-gray-200/50">
                <CardHeader>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>Update your password.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Current Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">New Password</label>
                                <div className="relative">
                                    <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {passwordMessage && (
                            <div className={`text-sm p-3 rounded-md text-center ${passwordMessage.includes('success') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                {passwordMessage}
                            </div>
                        )}

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isPasswordLoading}
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 h-10 px-4 py-2"
                            >
                                {isPasswordLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lock className="mr-2 h-4 w-4" />}
                                Change Password
                            </button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
