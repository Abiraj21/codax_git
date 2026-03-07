import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { HiOutlineChartBar } from "react-icons/hi";
import Sidebar from "./components/sidebar";
import SignalForm from "./components/signalForm";
import SignalList from "./components/signalList";

const API = "http://localhost:8000/api";

function App() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [signals, setSignals] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [loadingSignals, setLoadingSignals] = useState(false);

  // Load accounts on mount
  useEffect(() => {
    axios
      .get(`${API}/accounts`)
      .then((res) => setAccounts(res.data))
      .catch((err) => console.error("Failed to load accounts:", err));
  }, []);

  // Load signals whenever account or filters change
  const loadSignals = useCallback(() => {
    if (!selectedAccount) {
      setLoadingSignals(true);
      const params = {};
      if (filterType) params.type = filterType;
      if (filterStatus) params.status = filterStatus;
      axios
        .get(`${API}/signals`, { params })
        .then((res) => setSignals(res.data))
        .catch((err) => console.error("Failed to load signals:", err))
        .finally(() => setLoadingSignals(false));
    } else {
      setLoadingSignals(true);
      axios
        .get(`${API}/accounts/${selectedAccount.id}/signals`)
        .then((res) => {
          let data = res.data;
          if (filterType) data = data.filter((s) => s.type === filterType);
          if (filterStatus) data = data.filter((s) => s.status === filterStatus);
          setSignals(data);
        })
        .catch((err) => console.error("Failed to load signals:", err))
        .finally(() => setLoadingSignals(false));
    }
  }, [selectedAccount, filterType, filterStatus]);

  useEffect(() => {
    loadSignals();
  }, [loadSignals]);

  const handleSelectAccount = (account) => {
    setSelectedAccount((prev) => (prev?.id === account.id ? null : account));
    setFilterType("");
    setFilterStatus("");
  };

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

        {/* ─── Top Header Bar ─────────────────── */}
        <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {/* Breadcrumb-style context */}
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <HiOutlineChartBar className="text-signal-500 text-base" />
              <span
                className="hover:text-slate-700 cursor-pointer transition-colors"
                onClick={() => handleSelectAccount(selectedAccount || {})}
              >
                All Signals
              </span>
              {selectedAccount && (
                <>
                  <span className="text-slate-300">/</span>
                  <span className="text-slate-700 font-semibold">
                    {selectedAccount.name}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Right side: signal count pill */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Total signals:</span>
            <span className="bg-signal-100 text-signal-700 text-xs font-bold px-2.5 py-1 rounded-full">
              {signals.length}
            </span>
          </div>
        </header>

        {/* ─── Page Content ───────────────────── */}
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
                  ? `Viewing signals for ${selectedAccount.name}. Click the account again in the sidebar to deselect.`
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
                signals={signals}
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