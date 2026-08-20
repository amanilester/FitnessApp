import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { supabase } from '../../lib/supabase';
import { CiDumbbell } from "react-icons/ci";
import { FiMail, FiLock } from "react-icons/fi";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            console.error('Login error:', error.message);
            setError(error.message);
            setLoading(false);
            return;
        }

        navigate('/home');
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0f] relative overflow-hidden">
            <div className="absolute w-96 h-96 rounded-full bg-sky-600/10 blur-[80px] top-1/2
            left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"/>
            <div className="w-full max-w-sm mx-4 px-8 py-10 bg-white/4 border border-white/10
            rounded-2xl backdrop-blur-xl relative z-10">

                <div className="text-center mb-8">
                    <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center
                    justify-center mx-auto mb-3">
                        <CiDumbbell size={22} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-medium text-white mb-1">Welcome Back</h2>
                    <p className="text-sm text-neutral-500">Login to your account</p>
                </div>

                <form onSubmit={handleLogin}>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 mb-4">
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Email */}
                    <div className="relative mb-5">
                        <input
                            type="email"
                            placeholder=" "
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-lg pt-5 pb-2 px-4 text-sm text-white focus:outline-none focus:border-sky-500 transition-colors peer"
                        />
                        <label className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-neutral-500 pointer-events-none transition-all duration-150
                            peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-sky-400
                            peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-neutral-500">
                            Email
                        </label>
                        <FiMail size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-600" />
                    </div>

                    {/* Password */}
                    <div className="relative mb-6">
                        <input
                            type="password"
                            placeholder=" "
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-lg pt-5 pb-2 px-4 text-sm text-white focus:outline-none focus:border-sky-500 transition-colors peer"
                        />
                        <label className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-neutral-500 pointer-events-none transition-all duration-150
                            peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-sky-400
                            peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-neutral-500">
                            Password
                        </label>
                        <FiLock size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-600" />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-sky-600 hover:bg-sky-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 rounded-lg transition-colors active:scale-95"
                    >
                        {loading ? 'Logging in...' : 'Log in'}
                    </button>

                </form>

                <p className="text-center text-sm mt-6">
                    <span className="text-neutral-500">Don't have an account? </span>
                    <Link to="/register" className="text-sky-400! hover:text-sky-300! transition-colors">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;