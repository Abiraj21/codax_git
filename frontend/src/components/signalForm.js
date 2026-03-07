import React, { useState } from "react";
import axios from "axios";
import { FaBolt, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { HiOutlinePlusCircle } from "react-icons/hi";
import toast from 'react-hot-toast';

const SIGNAL_TYPES = ["intent", "web_visit", "purchase"];

const TYPE_META = {
    intent: { icon: "🎯", label: "Intent" },
    web_visit: { icon: "🌐", label: "Web Visit" },
    purchase: { icon: "💰", label: "Purchase" },
};

function SignalForm({ accounts, onSignalCreated, selectedAccount }) {
    const [form, setForm] = useState({
        account_id: "",
        type: "intent",
        payload: '{"page": "home"}',
    });

    React.useEffect(() => {
        if (selectedAccount) {
            setForm((prev) => ({ ...prev, account_id: selectedAccount.id.toString() }));
        }
    }, [selectedAccount]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        let payloadObj;
        try {
            payloadObj = JSON.parse(form.payload);
        } catch {
            setError("Payload must be valid JSON.");
            return;
        }

        setLoading(true);
        try {
            await axios.post("http://localhost:8000/api/signals", {
                account_id: parseInt(form.account_id),
                type: form.type,
                payload: payloadObj,
            });
            setSuccess("Signal created successfully!");
            toast.success("Signal created successfully!");
            onSignalCreated();
            setForm({
                account_id: selectedAccount ? selectedAccount.id.toString() : "",
                type: "intent",
                payload: '{"page": "home"}',
            });
            // Auto-clear success message
            setTimeout(() => setSuccess(""), 4000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create signal.");
            toast.error("Failed to create signal.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card mb-6 overflow-hidden">
            {/* Gradient top accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400" />

            <div className="px-6 py-5">
                {/* Section Header */}
                <div className="section-header">
                    <div className="section-header-icon">
                        <HiOutlinePlusCircle className="text-white text-lg" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">Create New Signal</h3>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                            Select an account, choose a signal type, and define the payload.
                        </p>
                    </div>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="mb-4 flex items-start gap-2.5 p-3.5 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl text-sm fade-up">
                        <FaExclamationCircle className="text-red-500 flex-shrink-0 mt-0.5" />
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 flex items-start gap-2.5 p-3.5 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 rounded-xl text-sm fade-up">
                        <FaCheckCircle className="text-emerald-500 flex-shrink-0 mt-0.5" />
                        {success}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                        {/* Account */}
                        <div>
                            <label className="input-label">Account</label>
                            <select
                                name="account_id"
                                value={form.account_id}
                                onChange={handleChange}
                                required
                                className="input-field"
                            >
                                <option value="">Select account…</option>
                                {accounts.map((a) => (
                                    <option key={a.id} value={a.id}>{a.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Signal Type */}
                        <div>
                            <label className="input-label">Signal Type</label>
                            <select
                                name="type"
                                value={form.type}
                                onChange={handleChange}
                                className="input-field"
                            >
                                {SIGNAL_TYPES.map((t) => (
                                    <option key={t} value={t}>
                                        {TYPE_META[t]?.icon} {TYPE_META[t]?.label || t}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Payload */}
                        <div>
                            <label className="input-label">Payload (JSON)</label>
                            <input
                                name="payload"
                                value={form.payload}
                                onChange={handleChange}
                                placeholder='{"key": "value"}'
                                className="input-field font-mono"
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="mt-5 flex items-center justify-between">
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                            <span className="font-medium text-slate-500 dark:text-slate-400">Tip:</span> Payload must be valid JSON
                        </p>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Creating…
                                </>
                            ) : (
                                <>
                                    <FaBolt className="text-xs" />
                                    Create Signal
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignalForm;
