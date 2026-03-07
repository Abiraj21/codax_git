import React, { useState } from "react";
import axios from "axios";
import {
    FaFilter, FaArchive, FaClock,
    FaChevronDown, FaChevronUp, FaCopy, FaInbox
} from "react-icons/fa";
import toast from 'react-hot-toast';

const TYPE_CONFIG = {
    intent: {
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
        icon: "🎯",
        label: "Intent",
    },
    web_visit: {
        bg: "bg-violet-50",
        text: "text-violet-700",
        border: "border-violet-200",
        icon: "🌐",
        label: "Web Visit",
    },
    purchase: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        icon: "💰",
        label: "Purchase",
    },
};

const STATUS_CONFIG = {
    active: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        dot: "bg-emerald-500",
        label: "Active",
        pulse: true,
    },
    archived: {
        bg: "bg-slate-100",
        text: "text-slate-500",
        border: "border-slate-200",
        dot: "bg-slate-400",
        label: "Archived",
        pulse: false,
    },
};

function SignalList({
    signals,
    onArchive,
    filterType,
    filterStatus,
    onFilterTypeChange,
    onFilterStatusChange,
}) {
    const [archiving, setArchiving] = useState(null);
    const [expandedPayload, setExpandedPayload] = useState(null);
    const [copiedId, setCopiedId] = useState(null);

    const handleArchive = async (id) => {
        setArchiving(id);
        try {
            await axios.patch(`http://localhost:8000/api/signals/${id}/archive`);
            toast.success("Signal successfully archived!");
            onArchive();
        } catch (err) {
            console.error("Archive failed:", err);
            toast.error("Failed to archive signal.");
        } finally {
            setArchiving(null);
        }
    };

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const togglePayload = (id) => {
        setExpandedPayload(expandedPayload === id ? null : id);
    };

    const hasFilters = filterType || filterStatus;

    return (
        <div className="card overflow-hidden">

            {/* ─── Filter Bar ─────────────────────────── */}
            <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center gap-3">

                {/* Label */}
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                    <FaFilter className="text-xs text-slate-400" />
                    Filters
                </div>

                {/* Type Filter */}
                <div className="relative">
                    <select
                        value={filterType}
                        onChange={(e) => onFilterTypeChange(e.target.value)}
                        className="appearance-none bg-white border border-slate-200 rounded-lg pl-3.5 pr-8 py-2 text-sm text-slate-700
                       focus:outline-none focus:ring-2 focus:ring-signal-400 min-w-[140px] cursor-pointer"
                    >
                        <option value="">All Types</option>
                        <option value="intent">🎯 Intent</option>
                        <option value="web_visit">🌐 Web Visit</option>
                        <option value="purchase">💰 Purchase</option>
                    </select>
                    <FaChevronDown className="absolute right-2.5 top-3 text-slate-400 text-xs pointer-events-none" />
                </div>

                {/* Status Filter */}
                <div className="relative">
                    <select
                        value={filterStatus}
                        onChange={(e) => onFilterStatusChange(e.target.value)}
                        className="appearance-none bg-white border border-slate-200 rounded-lg pl-3.5 pr-8 py-2 text-sm text-slate-700
                       focus:outline-none focus:ring-2 focus:ring-signal-400 min-w-[140px] cursor-pointer"
                    >
                        <option value="">All Statuses</option>
                        <option value="active">● Active</option>
                        <option value="archived">◉ Archived</option>
                    </select>
                    <FaChevronDown className="absolute right-2.5 top-3 text-slate-400 text-xs pointer-events-none" />
                </div>

                {/* Clear Filters */}
                {hasFilters && (
                    <button
                        onClick={() => { onFilterTypeChange(""); onFilterStatusChange(""); }}
                        className="text-xs text-signal-600 hover:text-signal-800 font-medium hover:underline transition-colors"
                    >
                        Clear all
                    </button>
                )}

                {/* Signal count chip */}
                <div className="ml-auto flex items-center gap-2">
                    <span className="text-xs text-slate-400">Showing</span>
                    <span className="bg-signal-100 text-signal-700 font-semibold text-xs px-2.5 py-1 rounded-full">
                        {signals.length} signal{signals.length !== 1 ? "s" : ""}
                    </span>
                </div>
            </div>

            {/* ─── Empty State ────────────────────────── */}
            {signals.length === 0 ? (
                <div className="px-6 py-20 text-center fade-up">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 mb-5">
                        <FaInbox className="text-slate-400 text-3xl" />
                    </div>
                    <h3 className="text-slate-800 font-semibold text-base mb-1.5">No signals found</h3>
                    <p className="text-slate-400 text-sm mb-5 max-w-xs mx-auto">
                        {hasFilters
                            ? "Try adjusting your filters or clearing them to see all signals."
                            : "Create your first signal using the form above."}
                    </p>
                    {hasFilters && (
                        <button
                            onClick={() => { onFilterTypeChange(""); onFilterStatusChange(""); }}
                            className="btn-secondary text-sm"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>

            ) : (

                /* ─── Signal Rows ──────────────────────── */
                <ul className="divide-y divide-slate-50">
                    {signals.map((signal, index) => {
                        const typeConf = TYPE_CONFIG[signal.type] || { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200", icon: "📌", label: signal.type };
                        const statusConf = STATUS_CONFIG[signal.status] || { bg: "bg-slate-100", text: "text-slate-500", border: "border-slate-200", dot: "bg-slate-400", label: signal.status, pulse: false };
                        const isExpanded = expandedPayload === signal.id;
                        const isCopied = copiedId === signal.id;

                        return (
                            <li
                                key={signal.id}
                                className="px-6 py-4 hover:bg-slate-50/70 transition-colors duration-150 slide-in"
                                style={{ animationDelay: `${index * 30}ms` }}
                            >
                                <div className="flex items-start gap-4">

                                    {/* ── Type Badge ───────────────── */}
                                    <div className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border
                    ${typeConf.bg} ${typeConf.text} ${typeConf.border}`}
                                    >
                                        <span className="text-sm leading-none">{typeConf.icon}</span>
                                        <span className="text-xs font-semibold">{typeConf.label}</span>
                                    </div>

                                    {/* ── Payload + Meta ────────────── */}
                                    <div className="flex-1 min-w-0">
                                        {/* Expandable payload */}
                                        <button
                                            onClick={() => togglePayload(signal.id)}
                                            className="group flex items-start gap-2 text-left w-full"
                                        >
                                            <code className={`text-xs rounded-lg px-2.5 py-1.5 font-mono leading-relaxed
                        bg-slate-100 text-slate-700 group-hover:bg-slate-200 transition-colors
                        ${isExpanded ? "whitespace-pre-wrap break-all" : "truncate max-w-xs"}`}
                                            >
                                                {isExpanded
                                                    ? JSON.stringify(signal.payload, null, 2)
                                                    : JSON.stringify(signal.payload).slice(0, 60) + (JSON.stringify(signal.payload).length > 60 ? "…" : "")
                                                }
                                            </code>
                                            <span className="text-slate-400 text-xs mt-1.5 flex-shrink-0">
                                                {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                                            </span>
                                        </button>

                                        {/* Meta row */}
                                        <div className="mt-2 flex items-center flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-400">
                                            <span className="flex items-center gap-1">
                                                <FaClock className="text-[10px]" />
                                                {new Date(signal.created_at).toLocaleString()}
                                            </span>
                                            <span className="text-slate-300">•</span>
                                            <span>ID #{signal.id}</span>

                                            {/* Copy button */}
                                            <button
                                                onClick={() => copyToClipboard(JSON.stringify(signal.payload), signal.id)}
                                                className={`flex items-center gap-1 transition-colors ${isCopied ? "text-emerald-600" : "hover:text-signal-600"}`}
                                            >
                                                {isCopied ? (
                                                    <><span className="text-emerald-500">✓</span> Copied!</>
                                                ) : (
                                                    <><FaCopy /> Copy payload</>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* ── Status Badge ─────────────── */}
                                    <div className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border
                    ${statusConf.bg} ${statusConf.text} ${statusConf.border}`}
                                    >
                                        <span className="relative flex h-2 w-2">
                                            {statusConf.pulse && (
                                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${statusConf.dot} opacity-60`}></span>
                                            )}
                                            <span className={`relative inline-flex rounded-full h-2 w-2 ${statusConf.dot}`}></span>
                                        </span>
                                        <span className="text-xs font-semibold">{statusConf.label}</span>
                                    </div>

                                    {/* ── Archive Button ────────────── */}
                                    {signal.status === "active" && (
                                        <button
                                            onClick={() => handleArchive(signal.id)}
                                            disabled={archiving === signal.id}
                                            className="btn-danger-ghost flex-shrink-0"
                                            title="Archive this signal"
                                        >
                                            {archiving === signal.id ? (
                                                <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <FaArchive className="text-sm" />
                                            )}
                                        </button>
                                    )}

                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

export default SignalList;