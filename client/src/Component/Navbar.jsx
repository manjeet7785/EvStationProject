import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const Navbar = () => {
    const { isLoggedIn, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        {
            id: 1,
            name: "Home",
            path: "/"
        },
        {
            id: 2,
            name: "Features",
            path: "/features"
        },
        {
            id: 3,
            name: "Map",
            path: "/map/GoogleMapp"
        }
    ];

    const authLinks = [
        {
            id: 4,
            name: "Login",
            path: "/login"
        },
        {
            id: 5,
            name: "Register",
            path: "/register"
        },
    ];

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        navigate('/');
    };

    return (

        <div className='w-full sticky top-0 z-50 shadow-lg backdrop-blur-md bg-gray-900/80'>
            <div className='max-w-7xl mx-auto h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8'>
                <Link to={"/"} className='flex items-center' onClick={() => setIsMenuOpen(false)}>
                    <span className='text-xl sm:text-2xl font-extrabold cursor-pointer text-white leading-tight'>
                        MPPP <span className='text-amber-500'>EV Hub</span>
                    </span>
                </Link>
                <div className='hidden md:flex items-center space-x-8'>
                    {navLinks.map((item) => (
                        <Link
                            to={item.path}
                            key={item.id}
                            className='text-gray-300 text-base font-medium hover:text-amber-500 transition duration-300'
                        >
                            {item.name}
                        </Link>
                    ))}
                    {isLoggedIn && isAdmin && (
                        <Link
                            to="/admin"
                            className='text-red-400 text-base font-bold hover:text-red-300 transition duration-300 px-3 py-1 border border-red-400 rounded-lg hover:bg-red-400/10'
                        >
                            Admin
                        </Link>
                    )}
                </div>

                <div className='flex items-center'>
                    {!isLoggedIn ? (

                        <div className='hidden md:flex gap-2 items-center'>
                            <Link to="/login">
                                <button className='px-4 py-2 text-base font-semibold text-amber-500 hover:text-amber-400 transition duration-300 rounded-lg'>
                                    Login
                                </button>
                            </Link>
                            <Link to="/register">
                                <button className='px-4 py-2 bg-amber-600 text-base font-semibold text-white rounded-full shadow-md hover:bg-amber-500 transition duration-300'>
                                    Register
                                </button>
                            </Link>
                            <Link to="/admin-login">
                                <button className='px-4 py-2 text-base font-semibold text-red-400 hover:text-red-300 transition duration-300 rounded-lg border border-red-400 hover:bg-red-400/10'>
                                    Admin
                                </button>
                            </Link>
                        </div>

                    ) : (

                        <div className='hidden md:flex gap-3 items-center'>
                            <Link to="/upload">
                                <button className='px-4 py-2 text-base font-semibold text-amber-500 hover:text-amber-400 transition duration-300 rounded-lg'>
                                    Upload
                                </button>
                            </Link>
                            <Link to="/dashboard">
                                <button className='px-4 py-2 text-base font-semibold text-amber-500 hover:text-amber-400 transition duration-300 rounded-lg'>
                                    Dashboard
                                </button>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className='px-4 py-2 bg-red-600 text-base font-semibold text-white rounded-full shadow-md hover:bg-red-500 transition duration-300'
                            >
                                Logout
                            </button>
                        </div>
                    )}
                    <button
                        className='md:hidden text-white text-2xl leading-none px-2'
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                        aria-label='Toggle menu'
                        aria-expanded={isMenuOpen}
                    >
                        {isMenuOpen ? '✕' : '☰'}
                    </button>
                </div>
            </div>

            {isMenuOpen && (
                <div className='md:hidden border-t border-gray-700/80 px-4 pb-4 pt-3 bg-gray-900/95'>
                    <div className='flex flex-col gap-2'>
                        {navLinks.map((item) => (
                            <Link
                                to={item.path}
                                key={item.id}
                                onClick={() => setIsMenuOpen(false)}
                                className='text-gray-200 text-base font-medium hover:text-amber-500 transition duration-300 py-2'
                            >
                                {item.name}
                            </Link>
                        ))}

                        {!isLoggedIn ? (
                            <>
                                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                                    <button className='w-full text-left px-4 py-2 text-base font-semibold text-amber-500 hover:text-amber-400 transition duration-300 rounded-lg border border-amber-500/20'>
                                        Login
                                    </button>
                                </Link>
                                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                                    <button className='w-full text-left px-4 py-2 bg-amber-600 text-base font-semibold text-white rounded-lg shadow-md hover:bg-amber-500 transition duration-300'>
                                        Register
                                    </button>
                                </Link>
                                <Link to="/admin-login" onClick={() => setIsMenuOpen(false)}>
                                    <button className='w-full text-left px-4 py-2 text-base font-semibold text-red-400 hover:text-red-300 transition duration-300 rounded-lg border border-red-400 hover:bg-red-400/10'>
                                        Admin
                                    </button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/upload" onClick={() => setIsMenuOpen(false)}>
                                    <button className='w-full text-left px-4 py-2 text-base font-semibold text-amber-500 hover:text-amber-400 transition duration-300 rounded-lg border border-amber-500/20'>
                                        Upload
                                    </button>
                                </Link>
                                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                                    <button className='w-full text-left px-4 py-2 text-base font-semibold text-amber-500 hover:text-amber-400 transition duration-300 rounded-lg border border-amber-500/20'>
                                        Dashboard
                                    </button>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className='w-full text-left px-4 py-2 bg-red-600 text-base font-semibold text-white rounded-lg shadow-md hover:bg-red-500 transition duration-300'
                                >
                                    Logout
                                </button>
                            </>
                        )}

                        {isLoggedIn && isAdmin && (
                            <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                                <button className='w-full text-left px-4 py-2 text-base font-bold text-red-400 border border-red-400 rounded-lg hover:bg-red-400/10 transition duration-300'>
                                    Admin Panel
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Navbar;

