import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiHome, FiList, FiLogOut, FiLogIn, FiUserPlus } from "react-icons/fi";


interface NavProps {
        loggedIn: boolean;
    }

function Navbar() {
    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();

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

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    return (
        <div className="flex items-center justify-between px-6 py-3 bg-neutral-900 border-b border-neutral-700 w-full">
            <span className="text-white font-semibold tracking-wide">LiftApp</span>
            <div className="flex items-center gap-2">
                {loggedIn ? (
                    <>
                        <Link to="/home" className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-neutral-800 transition-colors">
                            <FiHome size={14} /> Home
                        </Link>
                        <Link to="/programs" className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-neutral-800 transition-colors">
                            <FiList size={14} /> Programs
                        </Link>
                        <button onClick={handleLogout} className="inline-flex items-center gap-1.5 text-red-400 hover:text-red-300 text-sm px-3 py-1.5 rounded-lg hover:bg-neutral-800 transition-colors">
                            <FiLogOut size={14} /> Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-neutral-800 transition-colors">
                            <FiLogIn size={14} /> Login
                        </Link>
                        <Link to="/register" className="inline-flex items-center gap-1.5 text-white text-sm px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 transition-colors">
                            <FiUserPlus size={14} /> Sign Up
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}

export default Navbar;