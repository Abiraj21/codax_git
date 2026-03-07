import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Sidebar from "./components/sidebar";
import Header from "./components/Header";
import SignalForm from "./components/signalForm";
import SignalList from "./components/signalList";

const API = "http://localhost:8000/api";

// Deduplicate an array of objects by a key
function dedupeById(arr) {
  const map = new Map();
  arr.forEach((item) => map.set(item.id, item));
  return Array.from(map.values());
}

function App() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [signals, setSignals] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [loadingSignals, setLoadingSignals] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Load accounts on mount — deduplicate to guard against StrictMode double-invoke
  useEffect(() => {
    axios
      .get(`${API}/accounts`)
      .then((res) => setAccounts(dedupeById(res.data)))
      .catch((err) => console.error("Failed to load accounts:", err));
  }, []);

  // Load signals whenever account or filters change — AbortController prevents stale responses
  const loadSignals = useCallback(() => {
    const controller = new AbortController();

    if (!selectedAccount) {
      setLoadingSignals(true);
      const params = {};
      if (filterType) params.type = filterType;
      if (filterStatus) params.status = filterStatus;
      axios
        .get(`${API}/signals`, { params, signal: controller.signal })
        .then((res) => setSignals(dedupeById(res.data)))
        .catch((err) => {
          if (!axios.isCancel(err)) console.error("Failed to load signals:", err);
        })
        .finally(() => setLoadingSignals(false));
    } else {
      setLoadingSignals(true);
      axios
        .get(`${API}/accounts/${selectedAccount.id}/signals`, { signal: controller.signal })
        .then((res) => {
          let data = dedupeById(res.data);
          if (filterType) data = data.filter((s) => s.type === filterType);
          if (filterStatus) data = data.filter((s) => s.status === filterStatus);
          setSignals(data);
        })
        .catch((err) => {
          if (!axios.isCancel(err)) console.error("Failed to load signals:", err);
        })
        .finally(() => setLoadingSignals(false));
    }

    // Return cleanup so the effect can abort in-flight requests
    return () => controller.abort();
  }, [selectedAccount, filterType, filterStatus]);

  useEffect(() => {
    const cleanup = loadSignals();
    return cleanup;
  }, [loadSignals]);

  const handleSelectAccount = (account) => {
    setSelectedAccount((prev) => (prev?.id === account.id ? null : account));
    setFilterType("");
    setFilterStatus("");
  };

  // Filter signals by search query (matches account name or payload content)
  const displayedSignals = searchQuery.trim()
    ? signals.filter((s) => {
      const q = searchQuery.toLowerCase();
      const accountName =
        accounts.find((a) => a.id === s.account_id)?.name?.toLowerCase() || "";
      const payloadStr = JSON.stringify(s.payload || {}).toLowerCase();
      return (
        accountName.includes(q) ||
        payloadStr.includes(q) ||
        s.type?.toLowerCase().includes(q)
      );
    })
    : signals;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">

      {/* Sidebar */}
      <Sidebar
        accounts={accounts}
        selectedAccount={selectedAccount}
        onSelectAccount={handleSelectAccount}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">

        {/* ─── New Premium Header ─────────────────── */}
        <Header
          signalCount={signals.length}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedAccount={selectedAccount}
          onSelectAccount={handleSelectAccount}
        />

        {/* ─── Page Content ───────────────────────── */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">

            {/* Page Title */}
            <div className="mb-7 fade-up">
              <h1 className="text-2xl font-bold text-slate-900">
                {selectedAccount
                  ? `${selectedAccount.name} — Signals`
                  : "All Signals"}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                {selectedAccount
                  ? `Viewing signals for ${selectedAccount.name}. Click the account again to deselect.`
                  : "Showing all signals across accounts. Select an account from the sidebar to filter."}
              </p>
            </div>

            {/* Signal Creation Form */}
            <SignalForm
              accounts={accounts}
              onSignalCreated={loadSignals}
              selectedAccount={selectedAccount}
            />

            {/* Signal List */}
            {loadingSignals ? (
              <div className="card px-6 py-16 text-center">
                <div className="flex items-center justify-center gap-3 text-slate-400 text-sm">
                  <div className="w-5 h-5 border-2 border-signal-400 border-t-transparent rounded-full animate-spin"></div>
                  Loading signals…
                </div>
              </div>
            ) : (
              <SignalList
                signals={displayedSignals}
                onArchive={loadSignals}
                filterType={filterType}
                filterStatus={filterStatus}
                onFilterTypeChange={setFilterType}
                onFilterStatusChange={setFilterStatus}
              />
            )}

          </div>
        </main>
      </div>
    </div>
  );
}

export default App;