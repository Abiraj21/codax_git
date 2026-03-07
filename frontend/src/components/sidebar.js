import React from "react";
import { FaCircle } from "react-icons/fa";
import { HiOutlineChevronRight } from "react-icons/hi";

function Sidebar({ accounts, selectedAccount, onSelectAccount }) {
    return (
        <aside className="w-64 bg-violet-700 border-r border-slate-200 shadow-lg h-full flex flex-col">

            {/* ─── Account Navigation ────────────────── */}
            <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
                {/* Live status pill */}
                <div className="bg-white flex items-center gap-1.5 px-2.5 py-2 mb-3 rounded-full">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wide">
                        {accounts.length} Accounts Live
                    </span>
                </div>

                <p className="text-white font-bold text-slate-400 uppercase tracking-widest px-2 pb-2">
                    Accounts
                </p>

                {accounts.length === 0 ? (
                    <div className="py-10 text-center">
                        <div className="inline-block p-3 bg-slate-100= rounded-xl mb-3">
                            <FaCircle className="text-slate-300 text-2xl" />
                        </div>
                        <p className="text-sm font-medium">No accounts yet</p>
                        <p className="text-xs text-white mt-1">Accounts will appear here</p>
                    </div>
                ) : (
                    accounts.map((account, index) => {
                        const isActive = selectedAccount?.id === account.id;
                        return (
                            <button
                                key={account.id}
                                onClick={() => onSelectAccount(account)}
                                style={{ animationDelay: `${index * 40}ms` }}
                                className={`sidebar-link slide-in w-full group ${isActive ? "sidebar-link-active" : ""}`}
                            >
                                {/* Avatar initials */}
                                <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold
                  ${isActive
                                        ? "bg-signal-600 text-white"
                                        : "bg-slate-200 text-slate-600"
                                    }`}
                                >
                                    {account.name.charAt(0).toUpperCase()}
                                </div>

                                <span className="flex-1 text-left text-white group-hover:text-black truncate">{account.name}</span>

                                {isActive && (
                                    <HiOutlineChevronRight className="text-signal-500 text-xs flex-shrink-0" />
                                )}
                            </button>
                        );
                    })
                )}
            </nav>

            {/* ─── Footer ───────────────────────────── */}
            <div className="px-5 py-4 border-t border-slate-100 bg-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold text-slate-700">Signal Dashboard</p>
                        <p className="text-[10px] text-slate-500">© 2026 · Real-time signals</p>
                    </div>
                    <span className="text-[10px] bg-white border border-slate-200 text-slate-500 px-2 py-1 rounded-lg font-medium">
                        v1.2
                    </span>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;