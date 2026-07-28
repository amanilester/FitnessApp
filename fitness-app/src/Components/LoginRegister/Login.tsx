import React, { useState } from 'react';
import { BiUser } from "react-icons/bi";
import { AiOutlineUnlock } from "react-icons/ai";
import { Link, useNavigate } from 'react-router';
import { supabase } from '../../lib/supabase';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            console.error('Login error:', error.message);
        } else {
            navigate('/home');
        }
    }
    return (
        <div className="h-screen flex items-center justify-center bg-cover" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600')" }}>
            <div className="bg-slate-800/30 border border-slate-400 rounded-md p-8 shadow-lg backdrop-filter backdrop-blur-sm relative">
                <h1 className="text-4xl font-bold text-center mb-6">Login</h1>
                <form>
                    <div className="relative my-4">
                        <input
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-72 py-2.3 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 peer"
                            placeholder=""
                        />
                        <label className="absolute text-sm text-white duration-300 transform -translate-y-4 scale-75 top-3 -z-10 origin-left peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6" htmlFor="">Email</label>
                        <BiUser className="absolute top-0 right-4" />
                    </div>
                    <div className="relative my-4">
                        <input
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-72 py-2.3 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 peer"
                            placeholder=""
                        />
                        <label className="absolute text-sm text-white duration-300 transform -translate-y-4 scale-75 top-3 -z-10 origin-left peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6" htmlFor="password">Password</label>
                        <AiOutlineUnlock className="absolute top-0 right-4" />
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2 items-center">
                            <input type="checkbox" name="" id="" />
                            <label htmlFor="Remember Me">Remember Me</label>
                        </div>
                        <Link to='' className="text-blue-500!">Forgot Password?</Link>
                    </div>
                    <div>
                        <button
                            className="w-full mb-4 text-[18px] mt-6 rounded-full
                            bg-white text-sky-800 hover:bg-sky-600 hover:text-white
                            py-2 transition-colors duration-300"

                            type="submit"
                            onClick={handleLogin}>Login</button>
                    </div>
                    <div>
                        <span className="mt-4">New here? <Link className="text-blue-500!" to="/Register">Create An Account</Link></span>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;