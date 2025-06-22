import React, { useState } from "react";
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";

export default function Login({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [badmintonName, setBadmintonName] = useState("");
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  // สมัครสมาชิกใหม่
  const handleRegister = async () => {
    setError("");
    if (!email || !password || !badmintonName) {
      setError("กรุณากรอก email, password และ ชื่อในวงการ");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // บันทึกข้อมูลผู้เล่นใน Firestore
      await setDoc(doc(db, "players", user.uid), {
        badmintonName,
        score: 0,
        email,
      });
      setPage("dashboard");
    } catch (e) {
      setError(e.message);
    }
  };

  // เข้าสู่ระบบ
  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("กรุณากรอก email และ password");
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setPage("dashboard");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20, marginTop: 40, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>{isRegistering ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        style={{ width: "100%", padding: 8, marginBottom: 8 }}
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value.trim())}
      />
      <input
        style={{ width: "100%", padding: 8, marginBottom: 8 }}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {isRegistering && (
        <input
          style={{ width: "100%", padding: 8, marginBottom: 12 }}
          placeholder="ชื่อในวงการแบด"
          value={badmintonName}
          onChange={(e) => setBadmintonName(e.target.value)}
        />
      )}
      <button
        style={{ width: "100%", padding: 10, backgroundColor: "#2b6cb0", color: "white", marginBottom: 8 }}
        onClick={isRegistering ? handleRegister : handleLogin}
      >
        {isRegistering ? "ลงทะเบียน" : "เข้าสู่ระบบ"}
      </button>
      <p
        style={{ cursor: "pointer", color: "#2b6cb0" }}
        onClick={() => setIsRegistering(!isRegistering)}
      >
        {isRegistering ? "มีบัญชีอยู่แล้ว? เข้าสู่ระบบ" : "ยังไม่มีบัญชี? ลงทะเบียน"}
      </p>
    </div>
  );
}
