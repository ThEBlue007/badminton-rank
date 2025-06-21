import React, { useState, useEffect } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";
import AddResult from "./AddResult";
import logo from "./assets/logo.png";

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("login");
  const [players, setPlayers] = useState({});

  useEffect(() => {
    const savedUser = localStorage.getItem("badmintonUser");
    const savedPlayers = localStorage.getItem("badmintonPlayers");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setPage("dashboard");
    }
    if (savedPlayers) {
      setPlayers(JSON.parse(savedPlayers));
    }
  }, []);

  const savePlayers = (newPlayers) => {
    setPlayers(newPlayers);
    localStorage.setItem("badmintonPlayers", JSON.stringify(newPlayers));
  };

  const saveUser = (userObj) => {
    setUser(userObj);
    localStorage.setItem("badmintonUser", JSON.stringify(userObj));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("badmintonUser");
    setPage("login");
  };

  const deleteAccount = () => {
    if (user && players[user.username]) {
      const updatedPlayers = { ...players };
      delete updatedPlayers[user.username];
      savePlayers(updatedPlayers);
    }
    logout();
  };

  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <img src={logo} alt="โลโก้เว็บ" style={{ width: 150, marginBottom: 20 }} />
      <h1>The Heavenly Kings of Badminton</h1>
      {!user && (
        <Login
          setPage={setPage}
          players={players}
          savePlayers={savePlayers}
          saveUser={saveUser}
        />
      )}

      {user && page === "dashboard" && (
        <Dashboard
          user={user}
          setPage={setPage}
          players={players}
          savePlayers={savePlayers}
          logout={logout}
          deleteAccount={deleteAccount}
        />
      )}

      {user && page === "addresult" && (
        <AddResult
          user={user}
          setPage={setPage}
          players={players}
          savePlayers={savePlayers}
        />
      )}
    </div>
  );
}