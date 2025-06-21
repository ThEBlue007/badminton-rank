import React, { useState, useEffect } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";
import AddResult from "./AddResult";

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

  if (!user) {
    return (
      <Login
        setUser={setUser}
        setPage={setPage}
        players={players}
        savePlayers={savePlayers}
      />
    );
  }

  if (page === "dashboard") {
    return <Dashboard user={user} setPage={setPage} players={players} savePlayers={savePlayers} />;
  }

  if (page === "addresult") {
    return (
      <AddResult
        user={user}
        setPage={setPage}
        players={players}
        savePlayers={savePlayers}
      />
    );
  }

  return null;
}
