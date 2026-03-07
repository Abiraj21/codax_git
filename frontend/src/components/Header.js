import React, { useState, useRef, useEffect } from "react";
import { FaBolt, FaSearch, FaCog, FaUserEdit, FaSignOutAlt, FaTimes } from "react-icons/fa";
import { HiOutlineChartBar } from "react-icons/hi";

function Header({ signalCount, searchQuery, onSearchChange, selectedAccount, onSelectAccount }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="bg-white border-b border-slate-100 px-6 py-0 flex items-center justify-between sticky top-0 z-30 h-16 shadow-sm">

            {/* ── LEFT: CodeX Brand ── */}
            <div className="flex items-center gap-3 flex-shrink-0">
                {/* Logo */}
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-signal-500 to-brand-600 flex items-center justify-center shadow-sm flex-shrink-0">
                    <FaBolt className="text-white text-sm" />
                </div>
                {/* Wordmark */}
                <div className="flex flex-col leading-none">
                    <span className="text-lg font-extrabold text-slate-900 tracking-tight">
                        Code<span className="text-signal-500">X</span>
                    </span>
                    <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest">
                        Signal Intelligence
                    </span>
                </div>

                {/* Breadcrumb divider + context */}
                <div className="hidden md:flex items-center gap-2 ml-4 text-sm text-slate-400 pl-4 border-l border-slate-100">
                    <HiOutlineChartBar className="text-signal-500 text-base" />
                    <span
                        className="hover:text-slate-700 cursor-pointer transition-colors"
                        onClick={() => selectedAccount && onSelectAccount(selectedAccount)}
                    >
                        All Signals
                    </span>
                    {selectedAccount && (
                        <>
                            <span className="text-slate-300">/</span>
                            <span className="text-slate-700 font-semibold">{selectedAccount.name}</span>
                        </>
                    )}
                </div>
            </div>

            {/* ── CENTER: Search Bar ── */}
            <div className="flex-1 max-w-md mx-6">
                <div className="relative">
                    <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search signals by type, account, or payload…"
                        className="w-full pl-9 pr-9 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl
                       text-slate-700 placeholder-slate-400
                       focus:outline-none focus:ring-2 focus:ring-signal-400 focus:border-signal-400
                       transition-all duration-200"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => onSearchChange("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <FaTimes className="text-xs" />
                        </button>
                    )}
                </div>
            </div>

            {/* ── RIGHT: Signal Count + Settings ── */}
            <div className="flex items-center gap-3 flex-shrink-0">

                {/* Signal Count Pill */}
                <div className="hidden sm:flex items-center gap-2">
                    <span className="text-xs text-slate-400">Signals:</span>
                    <span className="bg-signal-100 text-signal-700 text-xs font-bold px-2.5 py-1 rounded-full">
                        {signalCount}
                    </span>
                </div>

                {/* Settings Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setDropdownOpen((prev) => !prev)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200
                        border ${dropdownOpen
                                ? "bg-signal-50 border-signal-200 text-signal-600 shadow-sm"
                                : "bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                            }`}
                        title="Settings"
                    >
                        <FaCog className={`text-sm transition-transform duration-300 ${dropdownOpen ? "rotate-90" : ""}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-50 animate-fade-in">
                            {/* Profile info header */}
                            <div className="px-4 py-3 border-b border-slate-100">
                                <p className="text-xs font-bold text-slate-800">My Account</p>
                                <p className="text-[11px] text-slate-400 mt-0.5">Manage your profile</p>
                            </div>

                            {/* Edit Profile */}
                            <button
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600
                           hover:bg-slate-50 hover:text-signal-600 transition-colors"
                                onClick={() => {
                                    setDropdownOpen(false);
                                    // TODO: navigate to /profile or open modal
                                    alert("Edit Profile — coming soon!");
                                }}
                            >
                                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                    <FaUserEdit className="text-blue-500 text-xs" />
                                </div>
                                <span className="font-medium">Edit Profile</span>
                            </button>

                            {/* Divider */}
                            <div className="mx-3 my-1 border-t border-slate-100" />

                            {/* Logout */}
                            <button
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500
                           hover:bg-red-50 transition-colors rounded-b-2xl"
                                onClick={() => {
                                    setDropdownOpen(false);
                                    // TODO: implement logout logic
                                    alert("Logging out…");
                                }}
                            >
                                <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                                    <FaSignOutAlt className="text-red-400 text-xs" />
                                </div>
                                <span className="font-medium">Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
