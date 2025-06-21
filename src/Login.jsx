import React, { useState } from "react";

export default function Login({ setPage, players, savePlayers, saveUser }) {
  const [username, setUsername] = useState("");
  const [badmintonName, setBadmintonName] = useState("");
  const [error, setError] = useState("");

  const handleRegister = () => {
    if (!username.trim() || !badmintonName.trim()) {
      setError("กรุณากรอกทั้ง Username และ ชื่อวงการแบด");
      return;
    }
    if (players[username]) {
      setError("Username นี้มีคนใช้แล้ว");
      return;
    }
    const newPlayers = {
      ...players,
      [username]: { badmintonName, score: 0 },
    };
    savePlayers(newPlayers);
    const userData = { username, badmintonName };
    saveUser(userData);
    setPage("dashboard");
  };

  const handleLogin = () => {
    if (!username.trim()) {
      setError("กรุณากรอก Username");
      return;
    }
    if (!players[username]) {
      setError("ไม่พบ Username นี้ กรุณาลงทะเบียนก่อน");
      return;
    }
    const userData = { username, badmintonName: players[username].badmintonName };
    saveUser(userData);
    setPage("dashboard");
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20, marginTop: 40, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>ระบบสมัครสมาชิกแบดมินตัน</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        style={{ width: "100%", padding: 8, marginBottom: 8 }}
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value.trim())}
      />
      <input
        style={{ width: "100%", padding: 8, marginBottom: 12 }}
        placeholder="ชื่อในวงการแบด"
        value={badmintonName}
        onChange={(e) => setBadmintonName(e.target.value)}
      />
      <button
        style={{ width: "100%", padding: 10, backgroundColor: "#2b6cb0", color: "white", marginBottom: 8 }}
        onClick={handleRegister}
      >
        ลงทะเบียน
      </button>
      <button
        style={{ width: "100%", padding: 10, backgroundColor: "#718096", color: "white" }}
        onClick={handleLogin}
      >
        เข้าสู่ระบบ
      </button>
    </div>
  );
}