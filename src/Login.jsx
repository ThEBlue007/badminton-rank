import React, { useState } from "react";

export default function Login({ setPage, players, savePlayers, saveUser }) {
  const [username, setUsername] = useState("");
  const [badmintonName, setBadmintonName] = useState("");
  const [password, setPassword] = useState(""); // เพิ่มรหัสผ่าน
  const [error, setError] = useState("");

  // ลงทะเบียน
  const handleRegister = () => {
    if (!username.trim() || !badmintonName.trim() || !password.trim()) {
      setError("กรุณากรอก Username, ชื่อในวงการ และ Password ให้ครบ");
      return;
    }
    if (players[username]) {
      setError("Username นี้มีคนใช้แล้ว");
      return;
    }
    // เก็บ username, badmintonName และ password ลง players
    const newPlayers = {
      ...players,
      [username]: { badmintonName, password, score: 0 },
    };
    savePlayers(newPlayers);
    saveUser({ username, badmintonName });
    setPage("dashboard");
  };

  // เข้าสู่ระบบ
  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      setError("กรุณากรอก Username และ Password");
      return;
    }
    if (!players[username]) {
      setError("ไม่พบ Username นี้ กรุณาลงทะเบียนก่อน");
      return;
    }
    if (players[username].password !== password) {
      setError("รหัสผ่านไม่ถูกต้อง");
      return;
    }
    saveUser({ username, badmintonName: players[username].badmintonName });
    setPage("dashboard");
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "auto",
        padding: 20,
        marginTop: 40,
        border: "1px solid #ccc",
        borderRadius: 8,
      }}
    >
      <h2>ระบบสมัครสมาชิกแบดมินตัน</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        style={{ width: "100%", padding: 8, marginBottom: 8 }}
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value.trim())}
      />
      <input
        style={{ width: "100%", padding: 8, marginBottom: 8 }}
        placeholder="ชื่อในวงการแบด"
        value={badmintonName}
        onChange={(e) => setBadmintonName(e.target.value)}
      />
      <input
        style={{ width: "100%", padding: 8, marginBottom: 12 }}
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
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
