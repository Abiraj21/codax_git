import { useEffect, useState } from "react";
import axios from "axios";

function App() {

  // This will store accounts from backend
  const [accounts, setAccounts] = useState([]);

  // This runs automatically when page loads
  useEffect(() => {
    axios.get("http://localhost:8000/api/accounts")
      .then(response => {
        console.log(response.data); // see data in console
        setAccounts(response.data); // save data into state
      })
      .catch(error => {
        console.error("Error fetching accounts:", error);
      });
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Accounts</h1>

      {accounts.map(account => (
        <div 
          key={account.id} 
          className="p-4 mb-2 bg-gray-100 rounded shadow"
        >
          {account.name}
        </div>
      ))}
    </div>
  );
}

export default App;