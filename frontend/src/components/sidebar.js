import React from "react";

function Sidebar({ accounts, selectedAccount, onSelectAccount }) {
    return (
        <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
            <div className="px-6 py-5 border-b border-gray-700">
                <h2 className="text-xl font-bold tracking-wide text-indigo-400">
                    📡 Signal Dashboard
                </h2>
                <p className="text-xs text-gray-400 mt-1">Accounts</p>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1">
                {accounts.length === 0 && (
                    <p className="text-gray-500 text-sm px-3">No accounts found.</p>
                )}
                {accounts.map((account) => (
                    <button
                        key={account.id}
                        onClick={() => onSelectAccount(account)}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150
              ${selectedAccount?.id === account.id
                                ? "bg-indigo-600 text-white"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white"
                            }`}
                    >
                        {account.name}
                    </button>
                ))}
            </nav>

            <div className="px-6 py-4 border-t border-gray-700 text-xs text-gray-500">
                Signal Dashboard © 2025
            </div>
        </aside>
    );
}

export default Sidebar;
