import { useEffect, useState, useCallback } from "react";
import axios from "axios";
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
      // Load all with optional filters
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
      // Load signals for selected account
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
    // Toggle: click same account = deselect
    setSelectedAccount((prev) => (prev?.id === account.id ? null : account));
    setFilterType("");
    setFilterStatus("");
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <Sidebar
        accounts={accounts}
        selectedAccount={selectedAccount}
        onSelectAccount={handleSelectAccount}
      />

      {/* Main */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {selectedAccount ? `${selectedAccount.name} — Signals` : "All Signals"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {selectedAccount
              ? `Showing signals for ${selectedAccount.name}. Click the account name again to deselect.`
              : "Select an account from the sidebar to filter, or view all signals here."}
          </p>
        </div>

        {/* Form to create signals */}
        <SignalForm accounts={accounts} onSignalCreated={loadSignals} selectedAccount={selectedAccount} />

        {/* Signal list */}
        {loadingSignals ? (
          <div className="bg-white rounded-xl shadow px-6 py-12 text-center text-gray-400 text-sm">
            Loading signals…
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
      </main>
    </div>
  );
}

export default App;