import React, { useState, useRef, useEffect } from "react";
import { FaBolt, FaSearch, FaUserCircle, FaUserEdit, FaSignOutAlt, FaTimes, FaEllipsisV, FaMoon, FaSun } from "react-icons/fa";
import { HiOutlineChartBar } from "react-icons/hi";

function Header({ signalCount, searchQuery, onSearchChange, selectedAccount, onSelectAccount, activeTab, setActiveTab }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [optionsOpen, setOptionsOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [profileModalOpen, setProfileModalOpen] = useState(false);
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);
    const dropdownRef = useRef(null);
    const optionsRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
            if (optionsRef.current && !optionsRef.current.contains(e.target)) {
                setOptionsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);

        // Check initial dark mode preference
        if (document.documentElement.classList.contains('dark') || localStorage.theme === 'dark') {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDarkMode = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
            setIsDarkMode(true);
        }
        setOptionsOpen(false);
    };

    return (
        <header className="bg-white dark:bg-slate-900 border-b border-white dark:border-slate-800 px-6 py-0 flex items-center justify-between sticky top-0 z-30 h-16 shadow transition-colors">

            {/* ── LEFT: CodeX Brand ── */}
            <div className="flex items-center gap-3 flex-shrink-0">
                {/* Logo */}
                <div className="w-9 h-9 rounded-xl bg-blue-600 dark:bg-blue-500 flex items-center justify-center shadow-sm flex-shrink-0">
                    <FaBolt className="text-white text-sm" />
                </div>
                {/* Wordmark */}
                <div className="flex flex-col leading-none">
                    <span className="text-lg font-extrabold text-blue-700 dark:text-white tracking-tight">
                        Codax
                    </span>
                    <span className="text-[9px] font-semibold text-blue-400 dark:text-slate-400 uppercase tracking-widest">
                        Signal Intelligence
                    </span>
                </div>

                {/* Breadcrumb divider + context */}
                <div className="hidden md:flex items-center gap-2 ml-4 text-sm text-blue-400 dark:text-slate-400 pl-4 border-l border-blue-100 dark:border-slate-800">
                    <HiOutlineChartBar className="text-blue-500 dark:text-white text-base" />
                    <span
                        className="hover:text-blue-600 dark:hover:text-slate-200 cursor-pointer transition-colors"
                        onClick={() => selectedAccount && onSelectAccount(selectedAccount)}
                    >
                        All Signals
                    </span>
                    {selectedAccount && (
                        <>
                            <span className="text-blue-300 dark:text-slate-500">/</span>
                            <span className="text-blue-700 dark:text-white font-semibold">{selectedAccount.name}</span>
                        </>
                    )}
                </div>
            </div>

            {/* ── CENTER: Navigation & Search ── */}
            <div className="flex flex-1 items-center justify-center gap-6 max-w-3xl mx-6 hidden md:flex">

                {/* ── Search Bar ── */}
                <div className="relative w-full max-w-sm">
                    <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-400 dark:text-slate-500 text-xs pointer-events-none" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search signals by type, account, or payload…"
                        className="w-full pl-9 pr-9 py-2 text-sm bg-blue-50 dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-xl
                       text-blue-900 dark:text-white placeholder-blue-300 dark:placeholder-slate-500
                       focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500
                       transition-all duration-200"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => onSearchChange("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-blue-500 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                        >
                            <FaTimes className="text-xs" />
                        </button>
                    )}
                </div>
            </div>

            <div>
                {/* ── Navigation Tabs ── */}
                <div className="flex bg-blue-50 dark:bg-slate-800 p-1 rounded-xl w-56 flex-shrink-0 mr-4">
                    <button
                        onClick={() => setActiveTab && setActiveTab('home')}
                        className={`flex-1 flex justify-center py-2 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === 'home'
                            ? 'bg-white text-blue-700 dark:bg-slate-700 dark:text-white shadow-sm'
                            : 'text-blue-500 hover:text-blue-700 dark:text-slate-400 dark:hover:text-slate-200'
                            }`}
                    >
                        Home
                    </button>
                    <button
                        onClick={() => setActiveTab && setActiveTab('visuals')}
                        className={`flex-1 flex justify-center py-2 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === 'visuals'
                            ? 'bg-white text-blue-700 dark:bg-slate-700 dark:text-white shadow-sm'
                            : 'text-blue-500 hover:text-blue-700 dark:text-slate-400 dark:hover:text-slate-200'
                            }`}
                    >
                        Visuals
                    </button>
                </div>
            </div>

            {/* ── RIGHT: Signal Count + Settings ── */}
            <div className="flex items-center gap-3 flex-shrink-0">



                {/* Signal Count Pill */}
                <div className="hidden sm:flex items-center gap-2">
                    <span className="text-xs text-blue-500 dark:text-slate-400">Signals:</span>
                    <span className="bg-blue-100 dark:bg-slate-800 text-blue-700 dark:text-white text-xs font-bold px-2.5 py-1 rounded-full border border-blue-200">
                        {signalCount}
                    </span>
                </div>

                {/* Settings Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setDropdownOpen((prev) => !prev)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 overflow-hidden
                        ${dropdownOpen
                                ? "ring-2 ring-blue-500 border-transparent shadow-sm"
                                : "hover:ring-2 hover:ring-blue-500/50 border-transparent"
                            }`}
                        title="Settings"
                    >
                        <FaUserCircle className={`w-full h-full text-blue-600 dark:text-white/90 transition-transform duration-300 ${dropdownOpen ? "text-blue-700" : ""}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-1.5 z-50 animate-fade-in">
                            {/* Profile info header */}
                            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                                <p className="text-xs font-bold text-slate-800 dark:text-slate-100">My Account</p>
                                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Manage your profile</p>
                            </div>

                            {/* Edit Profile */}
                            <button
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300
                           hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-white transition-colors"
                                onClick={() => {
                                    setDropdownOpen(false);
                                    setProfileModalOpen(true);
                                }}
                            >
                                <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                                    <FaUserEdit className="text-blue-500 dark:text-blue-400 text-xs" />
                                </div>
                                <span className="font-medium">Edit Profile</span>
                            </button>

                            {/* Divider */}
                            <div className="mx-3 my-1 border-t border-slate-100 dark:border-slate-800" />

                            {/* Logout */}
                            <button
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 dark:text-red-400
                           hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-b-2xl"
                                onClick={() => {
                                    setDropdownOpen(false);
                                    setLogoutModalOpen(true);
                                }}
                            >
                                <div className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                                    <FaSignOutAlt className="text-red-400 text-xs" />
                                </div>
                                <span className="font-medium">Logout</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Three Dot Options Menu */}
                <div className="relative" ref={optionsRef}>
                    <button
                        onClick={() => setOptionsOpen((prev) => !prev)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200
                        border ${optionsOpen
                                ? "bg-blue-50 text-blue-600 dark:bg-slate-700 dark:text-white shadow-sm"
                                : "bg-transparent dark:bg-slate-800 border-transparent text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700"
                            }`}
                        title="Options"
                    >
                        <FaEllipsisV className={`text-sm transition-transform duration-300 ${optionsOpen ? "text-blue-600 dark:text-white" : ""}`} />
                    </button>

                    {/* Options Dropdown List */}
                    {optionsOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 animate-fade-in">
                            <button
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-white transition-colors"
                                onClick={toggleDarkMode}
                            >
                                <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                                    {isDarkMode ? <FaSun className="text-amber-500 text-xs" /> : <FaMoon className="text-blue-500 dark:text-blue-400 text-xs" />}
                                </div>
                                <span className="font-medium">{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Custom Modals ── */}
            {profileModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden slide-in">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                <FaUserEdit className="text-blue-500" /> Edit Profile
                            </h3>
                            <button onClick={() => setProfileModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                                <FaTimes />
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                                Update your personal details and preferences. (Demo)
                            </p>
                            <div className="space-y-4">
                                <div>
                                    <label className="input-label">Full Name</label>
                                    <input type="text" className="input-field" defaultValue="Demo User" />
                                </div>
                                <div>
                                    <label className="input-label">Email Address</label>
                                    <input type="email" className="input-field" defaultValue="user@codax.com" />
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3 rounded-b-2xl">
                            <button onClick={() => setProfileModalOpen(false)} className="btn-secondary">Cancel</button>
                            <button onClick={() => setProfileModalOpen(false)} className="btn-primary">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}

            {logoutModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-sm overflow-hidden slide-in">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaSignOutAlt className="text-red-500 text-2xl" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Sign Out</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                                Are you sure you want to log out of your Codax account?
                            </p>
                            <div className="flex flex-col gap-3">
                                <button onClick={() => setLogoutModalOpen(false)} className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 active:scale-[0.98] transition-all duration-200 shadow shadow-red-500/20">
                                    Yes, Log Out
                                </button>
                                <button onClick={() => setLogoutModalOpen(false)} className="btn-secondary w-full">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}

export default Header;
