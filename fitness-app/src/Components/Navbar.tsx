import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiHome, FiList, FiLogOut, FiLogIn, FiUserPlus, FiUser } from "react-icons/fi";
import { FaRegDotCircle } from "react-icons/fa";


function Navbar() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [liveWorkout, setLiveWorkout] = useState<{ sessionId: string; programId: string } | null>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);

    useEffect(() => {
        // Check initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setLoggedIn(!!session);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setLoggedIn(!!session);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        const raw = localStorage.getItem('liveWorkout');
        if (raw) {
            try {
                setLiveWorkout(JSON.parse(raw));
            } catch {
                setLiveWorkout(null);
            }
        } else {
            setLiveWorkout(null);
        }
    }, [location.pathname]);

    const handleLogout = async () => {
        setLogoutLoading(true);
        localStorage.removeItem('liveWorkout');
        await supabase.auth.signOut();
        navigate('/login');
    };

    const isActive = (path: string) => location.pathname === path;
 
    const tabClass = (path: string) =>
        `flex flex-col items-center gap-1 cursor-pointer border-none bg-transparent px-4 py-1 transition-colors
        ${isActive(path) ? 'text-white' : 'text-neutral-700 hover:text-neutral-400'}`;
 
    return (
        <div className="fixed bottom-0 left-0 right-0 flex items-center justify-around px-4 pt-3 pb-3 bg-neutral-950 border-t border-neutral-900 z-50">
            {loggedIn ? (
                <>
                    <button onClick={() => navigate('/home')} className={tabClass('/home')}>
                        <FiHome size={21} />
                        <div className={`w-1 h-1 rounded-full ${isActive('/home') ? 'bg-sky-500' : 'bg-transparent'}`} />
                    </button>
                    <button onClick={() => navigate('/programs')} className={tabClass('/programs')}>
                        <FiList size={21} />
                        <div className={`w-1 h-1 rounded-full ${isActive('/programs') ? 'bg-sky-500' : 'bg-transparent'}`} />
                    </button>

                    {liveWorkout && (
                        <button
                            onClick={() => navigate(`/workout/${liveWorkout.programId}`)}
                            className="flex flex-col items-center gap-1 cursor-pointer border-none bg-transparent px-4 py-1 text-sky-400 transition-colors relative"
                        >
                            <FaRegDotCircle size={21} />
                            {/* Pulsing dot */}
                            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500" />
                            </span>
                            <div className="w-1 h-1 rounded-full bg-sky-500" />
                        </button>
                    )}

                    <button onClick={() => navigate('/profile')} className={tabClass('/profile')}>
                        <FiUser size={21} />
                        <div className={`w-1 h-1 rounded-full ${isActive('/profile') ? 'bg-sky-500' : 'bg-transparent'}`} />
                    </button>
                    <button onClick={() => setShowLogoutConfirm(true)} className="flex flex-col items-center gap-1 cursor-pointer border-none bg-transparent px-4 py-1 text-neutral-700 hover:text-red-400 transition-colors">
                        <FiLogOut size={21} />
                        <div className="w-1 h-1 rounded-full bg-transparent" />
                    </button>
                </>
            ) : (
                <>
                    <button onClick={() => navigate('/login')} className={tabClass('/login')}>
                        <FiLogIn size={21} />
                        <div className={`w-1 h-1 rounded-full ${isActive('/login') ? 'bg-sky-500' : 'bg-transparent'}`} />
                    </button>
                    <button onClick={() => navigate('/register')} className={tabClass('/register')}>
                        <FiUserPlus size={21} />
                        <div className={`w-1 h-1 rounded-full ${isActive('/register') ? 'bg-sky-500' : 'bg-transparent'}`} />
                    </button>
                </>
            )}

            {showLogoutConfirm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                    <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 w-full max-w-sm">
                        <h2 className="text-white font-medium mb-2">Logout</h2>
                        <p className="text-neutral-400 text-sm mb-6">Are you sure you want to logout?</p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowLogoutConfirm(false)}
                                className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                disabled={logoutLoading}
                                className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
                            >
                                {logoutLoading ? 'Logging out...' : 'Logout'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Navbar;