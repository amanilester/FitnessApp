import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { FiChevronRight, FiTrash2, FiX, FiCheck } from 'react-icons/fi';

const AVATARS = ['🏋️', '💪', '🔥', '⚡', '🎯', '🦁', '👊', '🏆'];

type Stats = {
    totalWorkouts: number;
    streak: number;
    programsCount: number;
}

function Profile() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [editingName, setEditingName] = useState(false);
    const [nameInput, setNameInput] = useState('');
    const [avatar, setAvatar] = useState('🏋️');
    const [stats, setStats] = useState<Stats>({ totalWorkouts: 0, streak: 0, programsCount: 0 });
    const [loading, setLoading] = useState(true);

    // Change password modal
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);

    // Delete account confirmation
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            setEmail(user.email ?? '');

            const { data: profile } = await supabase
                .from('profiles')
                .select('display_name, avatar')
                .eq('id', user.id)
                .single();

            if (profile) {
                setDisplayName(profile.display_name ?? user.email?.split('@')[0] ?? '');
                setNameInput(profile.display_name ?? user.email?.split('@')[0] ?? '');
                setAvatar(profile.avatar ?? '🏋️');
            }

            // Fetch stats
            const { data: sessions } = await supabase
                .from('workout_sessions')
                .select('id, created_at')
                .eq('user_id', user.id)
                .not('completed_at', 'is', null);

            const { data: programs } = await supabase
                .from('programs')
                .select('id')
                .eq('user_id', user.id);

            const total = sessions?.length ?? 0;
            const streak = calcStreak(sessions ?? []);
            const programsCount = programs?.length ?? 0;

            setStats({ totalWorkouts: total, streak, programsCount });
            setLoading(false);
        };

        fetchProfile();
    }, []);

    const calcStreak = (sessions: { created_at: string }[]) => {
        if (!sessions.length) return 0;
        const dates = [...new Set(
            sessions.map(s => new Date(s.created_at).toDateString())
        )].map(d => new Date(d)).sort((a, b) => b.getTime() - a.getTime());

        let streak = 0;
        let current = new Date();
        current.setHours(0, 0, 0, 0);

        for (const date of dates) {
            const diff = Math.round((current.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
            if (diff <= 1) { streak++; current = date; }
            else break;
        }
        return streak;
    };

    const saveName = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        await supabase
            .from('profiles')
            .update({ display_name: nameInput })
            .eq('id', user.id);

        setDisplayName(nameInput);
        setEditingName(false);
    };

    const saveAvatar = async (emoji: string) => {
        setAvatar(emoji);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        await supabase
            .from('profiles')
            .update({ avatar: emoji })
            .eq('id', user.id);
    };

    const handleChangePassword = async () => {
        setPasswordError('');
        setPasswordSuccess(false);

        if (newPassword !== confirmPassword) {
            setPasswordError('Passwords do not match.');
            return;
        }
        if (newPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters.');
            return;
        }

        setPasswordLoading(true);
        const { error } = await supabase.auth.updateUser({ password: newPassword });

        if (error) {
            setPasswordError(error.message);
            setPasswordLoading(false);
            return;
        }

        setPasswordSuccess(true);
        setPasswordLoading(false);
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
            setShowPasswordModal(false);
            setPasswordSuccess(false);
        }, 1500);
    };

    const handleDeleteAccount = async () => {
        setDeleteLoading(true);
        const { error } = await supabase.rpc('delete_user');
        if (error) {
            console.error(error);
            setDeleteLoading(false);
            return;
        }
        await supabase.auth.signOut();
        navigate('/login');
    };

    if (loading) return (
        <p className="text-neutral-500 text-sm text-center py-12">Loading...</p>
    );

    return (
        <div className="max-w-xl mx-auto px-6 py-8">

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full bg-neutral-800 border-2 border-sky-600 flex items-center justify-center text-3xl shrink-0">
                    {avatar}
                </div>
                <div>
                    {editingName ? (
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={nameInput}
                                onChange={e => setNameInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && saveName()}
                                className="bg-neutral-800 border border-neutral-600 rounded-lg text-white text-lg font-medium px-3 py-1 focus:outline-none focus:border-sky-500"
                                autoFocus
                            />
                            <button onClick={saveName} className="text-emerald-400 hover:text-emerald-300">
                                <FiCheck size={18} />
                            </button>
                            <button onClick={() => setEditingName(false)} className="text-neutral-500 hover:text-neutral-300">
                                <FiX size={18} />
                            </button>
                        </div>
                    ) : (
                        <p className="text-xl font-medium text-white capitalize">{displayName}</p>
                    )}
                    <p className="text-sm text-neutral-500 mt-0.5">{email}</p>
                    {!editingName && (
                        <button
                            onClick={() => setEditingName(true)}
                            className="text-xs text-sky-400 hover:text-sky-300 border border-sky-600/40 rounded-md px-2 py-0.5 mt-1.5 transition-colors"
                        >
                            Edit name
                        </button>
                    )}
                </div>
            </div>

            {/* Stats */}
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">Stats</p>
            <div className="grid grid-cols-3 gap-3 mb-8">
                <div className="bg-neutral-800 rounded-xl p-4 text-center">
                    <p className="text-2xl font-medium text-white">{stats.totalWorkouts}</p>
                    <p className="text-xs text-neutral-500 mt-1">Workouts</p>
                </div>
                <div className="bg-neutral-800 rounded-xl p-4 text-center">
                    <p className="text-2xl font-medium text-white">{stats.streak}</p>
                    <p className="text-xs text-neutral-500 mt-1">Day streak</p>
                </div>
                <div className="bg-neutral-800 rounded-xl p-4 text-center">
                    <p className="text-2xl font-medium text-white">{stats.programsCount}</p>
                    <p className="text-xs text-neutral-500 mt-1">Programs</p>
                </div>
            </div>

            {/* Avatar picker */}
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">Profile picture</p>
            <div className="grid grid-cols-8 gap-2 mb-8">
                {AVATARS.map(emoji => (
                    <button
                        key={emoji}
                        onClick={() => saveAvatar(emoji)}
                        className={`w-full aspect-square rounded-full bg-neutral-800 flex items-center justify-center text-2xl transition-all
                            ${avatar === emoji ? 'border-2 border-sky-500 scale-110' : 'border-2 border-transparent hover:border-neutral-600'}`}
                    >
                        {emoji}
                    </button>
                ))}
            </div>

            {/* Account settings */}
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">Account</p>
            <div className="space-y-2">
                <button
                    onClick={() => setShowPasswordModal(true)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-xl transition-colors"
                >
                    <span className="text-sm text-white">Change password</span>
                    <FiChevronRight size={16} className="text-neutral-500" />
                </button>
                <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-neutral-800 hover:bg-red-500/10 rounded-xl transition-colors"
                >
                    <span className="text-sm text-red-400">Delete account</span>
                    <FiTrash2 size={15} className="text-red-400" />
                </button>
            </div>

            {/* Change password modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                    <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 w-full max-w-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-white font-medium">Change password</h2>
                            <button onClick={() => { setShowPasswordModal(false); setPasswordError(''); setNewPassword(''); setConfirmPassword(''); }} className="text-neutral-500 hover:text-white">
                                <FiX size={18} />
                            </button>
                        </div>

                        {passwordError && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 mb-4">
                                <p className="text-red-400 text-sm">{passwordError}</p>
                            </div>
                        )}

                        {passwordSuccess && (
                            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-3 mb-4">
                                <p className="text-emerald-400 text-sm">Password updated!</p>
                            </div>
                        )}

                        <div className="space-y-3 mb-6">
                            <input
                                type="password"
                                placeholder="New password"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500 transition-colors"
                            />
                            <input
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500 transition-colors"
                            />
                        </div>

                        <button
                            onClick={handleChangePassword}
                            disabled={passwordLoading}
                            className="w-full bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
                        >
                            {passwordLoading ? 'Updating...' : 'Update password'}
                        </button>
                    </div>
                </div>
            )}

            {/* Delete account confirmation */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                    <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 w-full max-w-sm">
                        <h2 className="text-white font-medium mb-2">Delete account</h2>
                        <p className="text-neutral-400 text-sm mb-6">This will permanently delete your account, all programs, and workout history. This cannot be undone.</p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={deleteLoading}
                                className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
                            >
                                {deleteLoading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;