import React, { useState } from "react";
import axios from "axios";

const TYPE_BADGE = {
    intent: "bg-blue-100 text-blue-700",
    web_visit: "bg-purple-100 text-purple-700",
    purchase: "bg-green-100 text-green-700",
};

const STATUS_BADGE = {
    active: "bg-emerald-100 text-emerald-700",
    archived: "bg-gray-100 text-gray-500",
};

function SignalList({ signals, onArchive, filterType, filterStatus, onFilterTypeChange, onFilterStatusChange }) {
    const [archiving, setArchiving] = useState(null);

    const handleArchive = async (id) => {
        setArchiving(id);
        try {
            await axios.patch(`http://localhost:8000/api/signals/${id}/archive`);
            onArchive();
        } catch (err) {
            console.error("Archive failed:", err);
        } finally {
            setArchiving(null);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow">
            {/* Filter bar */}
            <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap gap-3 items-center">
                <span className="text-sm font-semibold text-gray-600">Filters:</span>

                <select
                    value={filterType}
                    onChange={(e) => onFilterTypeChange(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                    <option value="">All Types</option>
                    <option value="intent">Intent</option>
                    <option value="web_visit">Web Visit</option>
                    <option value="purchase">Purchase</option>
                </select>

                <select
                    value={filterStatus}
                    onChange={(e) => onFilterStatusChange(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                </select>

                <span className="ml-auto text-xs text-gray-400">
                    {signals.length} signal{signals.length !== 1 ? "s" : ""}
                </span>
            </div>

            {/* Signal rows */}
            {signals.length === 0 ? (
                <div className="px-6 py-12 text-center text-gray-400 text-sm">
                    No signals found. Create one above!
                </div>
            ) : (
                <ul className="divide-y divide-gray-50">
                    {signals.map((signal) => (
                        <li
                            key={signal.id}
                            className="px-6 py-4 flex items-start gap-4 hover:bg-gray-50 transition-colors"
                        >
                            {/* Type badge */}
                            <span
                                className={`mt-0.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${TYPE_BADGE[signal.type] || "bg-gray-100 text-gray-600"
                                    }`}
                            >
                                {signal.type}
                            </span>

                            {/* Payload & Timestamp */}
                            <div className="flex-1 min-w-0">
                                <code className="text-xs text-gray-600 bg-gray-50 rounded px-2 py-1 break-all">
                                    {JSON.stringify(signal.payload)}
                                </code>
                                <div className="mt-1 text-[10px] text-gray-400">
                                    {new Date(signal.created_at).toLocaleString()}
                                </div>
                            </div>

                            {/* Status badge */}
                            <span
                                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[signal.status] || "bg-gray-100 text-gray-500"
                                    }`}
                            >
                                {signal.status}
                            </span>

                            {/* Archive button */}
                            {signal.status === "active" && (
                                <button
                                    onClick={() => handleArchive(signal.id)}
                                    disabled={archiving === signal.id}
                                    className="ml-2 text-xs text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40 whitespace-nowrap"
                                >
                                    {archiving === signal.id ? "…" : "Archive"}
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SignalList;
