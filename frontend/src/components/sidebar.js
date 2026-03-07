import React from "react";
import { FaCircle } from "react-icons/fa";
import { HiOutlineChevronRight } from "react-icons/hi";

function Sidebar({ accounts, selectedAccount, onSelectAccount }) {
    return (
        <aside className="w-64 bg-blue-600 dark:bg-slate-900 border-r border-white dark:border-slate-800 shadow-lg h-full flex flex-col transition-colors">

            {/* ─── Account Navigation ────────────────── */}
            <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
                {/* Live status pill */}
                <div className="bg-gray-200 dark:bg-slate-800 flex items-center gap-1.5 px-2.5 py-2 mb-3 rounded-full">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wide">
                        {accounts.length} Accounts Live
                    </span>
                </div>

                <p className="text-blue-100 dark:text-slate-400 font-bold uppercase tracking-widest px-2 pb-2">
                    Accounts
                </p>

                {accounts.length === 0 ? (
                    <div className="py-10 text-center">
                        <div className="inline-block p-3 bg-blue-500/50 dark:bg-slate-800 rounded-xl mb-3">
                            <FaCircle className="text-blue-200 dark:text-slate-600 text-2xl" />
                        </div>
                        <p className="text-sm font-medium text-white dark:text-slate-300">No accounts yet</p>
                        <p className="text-xs text-blue-200 dark:text-slate-500 mt-1">Accounts will appear here</p>
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
                                        ? "bg-white text-blue-600 dark:bg-blue-500 dark:text-white"
                                        : "bg-blue-400 text-white dark:bg-slate-800 dark:text-slate-300"
                                    }`}
                                >
                                    {account.name.charAt(0).toUpperCase()}
                                </div>

                                <span className="flex-1 text-left text-blue-50 dark:text-slate-300 group-hover:text-blue-900 dark:group-hover:text-black truncate">{account.name}</span>

                                {isActive && (
                                    <HiOutlineChevronRight className="text-white dark:text-blue-400 text-xs flex-shrink-0" />
                                )}
                            </button>
                        );
                    })
                )}
            </nav>

            {/* ─── Footer ───────────────────────────── */}
            <div className="px-5 py-4 border-t border-blue-500 dark:border-slate-800 bg-blue-700 dark:bg-slate-950 transition-colors">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold text-blue-50 dark:text-slate-300">Signal Dashboard</p>
                        <p className="text-[10px] text-blue-200 dark:text-slate-500">© 2026 · Real-time signals</p>
                    </div>
                    <span className="text-[10px] bg-blue-500 dark:bg-slate-800 border border-blue-400 dark:border-slate-700 text-blue-50 dark:text-slate-300 px-2 py-1 rounded-lg font-medium">
                        v1.2
                    </span>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;