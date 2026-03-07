import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Sidebar from "./components/sidebar";
import Header from "./components/Header";
import SignalForm from "./components/signalForm";
import SignalList from "./components/signalList";
import Visuals from "./components/Visuals";
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import toast, { Toaster } from 'react-hot-toast';

window.Pusher = Pusher;

window.Echo = new Echo({
  broadcaster: 'reverb',
  key: "s1chube6wkxw4fggrpua",
  wsHost: "localhost",
  wsPort: 8080,
  wssPort: 8080,
  forceTLS: false,
  enabledTransports: ['ws', 'wss'],
});

const API = "http://localhost:8000/api";

// Deduplicate an array of objects by a key
function dedupeById(arr) {
  const map = new Map();
  arr.forEach((item) => map.set(item.id, item));
  return Array.from(map.values());
}

function App() {
  const [activeTab, setActiveTab] = useState('home');
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
      axios
        .get(`${API}/signals`, { signal: controller.signal })
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
          setSignals(data);
        })
        .catch((err) => {
          if (!axios.isCancel(err)) console.error("Failed to load signals:", err);
        })
        .finally(() => setLoadingSignals(false));
    }

    // Return cleanup so the effect can abort in-flight requests
    return () => controller.abort();
  }, [selectedAccount]);

  useEffect(() => {
    const cleanup = loadSignals();
    return cleanup;
  }, [loadSignals]);

  // Listen for real-time broadcasts
  useEffect(() => {
    const channel = window.Echo.channel('signals');

    channel.listen('SignalCreated', (e) => {
      toast.success('New Signal Received!', {
        style: {
          borderRadius: '12px',
          background: '#1e293b',
          color: '#f8fafc',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        },
        iconTheme: {
          primary: '#10b981',
          secondary: '#1e293b',
        },
      });
      loadSignals();
    });

    channel.listen('SignalArchived', (e) => {
      toast.success('Signal Archived.', {
        style: {
          borderRadius: '12px',
          background: '#1e293b',
          color: '#f8fafc',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        },
        iconTheme: {
          primary: '#8b5cf6',
          secondary: '#1e293b',
        },
      });
      loadSignals();
    });

    return () => {
      window.Echo.leaveChannel('signals');
    };
  }, [loadSignals]);

  const handleSelectAccount = (account) => {
    setSelectedAccount((prev) => (prev?.id === account.id ? null : account));
    setFilterType("");
    setFilterStatus("");
  };

  // Filter signals by search query, type, and status
  const displayedSignals = signals.filter((s) => {
    // 1. Type Filter
    if (filterType && s.type !== filterType) return false;

    // 2. Status Filter
    if (filterStatus && s.status !== filterStatus) return false;

    // 3. Search Query Filter
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    const accountName = accounts.find((a) => a.id === s.account_id)?.name?.toLowerCase() || "";
    const payloadStr = JSON.stringify(s.payload || {}).toLowerCase();

    return (
      accountName.includes(q) ||
      payloadStr.includes(q) ||
      s.type?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100">
      <Toaster position="bottom-right" reverseOrder={false} />

      {/* ─── New Premium Header ─────────────────── */}
      <Header
        signalCount={signals.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedAccount={selectedAccount}
        onSelectAccount={handleSelectAccount}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <Sidebar
          accounts={accounts}
          selectedAccount={selectedAccount}
          onSelectAccount={handleSelectAccount}
        />

        {/* ─── Page Content ───────────────────────── */}
        <main className="flex-1 p-8 overflow-y-auto bg-slate-50 dark:bg-slate-950 transition-colors">
          <div className="max-w-5xl mx-auto">

            {/* Page Title */}
            <div className="mb-7 fade-up">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {selectedAccount
                  ? `${selectedAccount.name} — Signals`
                  : "All Signals"}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {selectedAccount
                  ? `Viewing signals for ${selectedAccount.name}. Click the account again to deselect.`
                  : "Showing all signals across accounts. Select an account from the sidebar to filter."}
              </p>
            </div>

            {/* Main Tabs Logic */}
            {activeTab === 'home' ? (
              <>
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
              </>
            ) : (
              <Visuals signals={displayedSignals} accounts={accounts} />
            )}

          </div>
        </main>
      </div>
    </div>
  );
}

export default App;