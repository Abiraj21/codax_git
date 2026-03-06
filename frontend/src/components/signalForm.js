import React, { useState } from "react";
import axios from "axios";

const SIGNAL_TYPES = ["intent", "web_visit", "purchase"];

function SignalForm({ accounts, onSignalCreated, selectedAccount }) {
    const [form, setForm] = useState({
        account_id: "",
        type: "intent",
        payload: '{"page": "home"}',
    });

    // Auto-select account if provided via props
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
            onSignalCreated();
            setForm({
                account_id: selectedAccount ? selectedAccount.id.toString() : "",
                type: "intent",
                payload: '{"page": "home"}',
            });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to create signal. Check console."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                ➕ Create New Signal
            </h3>

            {error && (
                <div className="mb-3 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-3 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Account */}
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Account
                    </label>
                    <select
                        name="account_id"
                        value={form.account_id}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                        <option value="">Select account…</option>
                        {accounts.map((a) => (
                            <option key={a.id} value={a.id}>
                                {a.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Type */}
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Signal Type
                    </label>
                    <select
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                        {SIGNAL_TYPES.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Payload */}
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Payload (JSON)
                    </label>
                    <input
                        name="payload"
                        value={form.payload}
                        onChange={handleChange}
                        placeholder='{"key": "value"}'
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                </div>

                <div className="md:col-span-3 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? "Creating…" : "Create Signal"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default SignalForm;
