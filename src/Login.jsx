// Login.jsx - จะเหลือแค่ส่วน Login
import React, { useState } from "react";
import { auth, db } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Login({ setUser, setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("กรุณากรอก Email และ Password");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      const docSnap = await getDoc(doc(db, "players", firebaseUser.uid));
      if (!docSnap.exists()) {
        setError("ไม่พบข้อมูลผู้เล่นของคุณ กรุณาลงทะเบียนใหม่หากไม่เคยใช้งาน");
        await auth.signOut();
        return;
      }

      setUser(firebaseUser);
      setPage("dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20, marginTop: 40, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>เข้าสู่ระบบ</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        style={{ width: "100%", padding: 8, marginBottom: 8 }}
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
      />
      <input
        style={{ width: "100%", padding: 8, marginBottom: 12 }}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
      />
      <button
        style={{ width: "100%", padding: 10, backgroundColor: "#718096", color: "white", marginBottom: 8 }}
        onClick={handleLogin}
      >
        เข้าสู่ระบบ
      </button>
      <button
        style={{ width: "100%", padding: 10, backgroundColor: "#2b6cb0", color: "white" }}
        onClick={() => setPage("register")}
      >
        ยังไม่มีบัญชี? ลงทะเบียนที่นี่
      </button>
    </div>
  );
}
