import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setLoggedIn(!!session);
            setLoading(false);
        });
    }, []);

    if (loading) return null;
    if (!loggedIn) return <Navigate to="/login" replace />;
    return <>{children}</>;
}

export default ProtectedRoute;