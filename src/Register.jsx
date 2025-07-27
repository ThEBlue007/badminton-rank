// Register.jsx
import React, { useState } from "react";
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function Register({ setUser, setPage }) {
  const [email, setEmail] = useState("");
  const [badmintonName, setBadmintonName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");
    if (!email || !password || !badmintonName) {
      setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // บันทึกชื่อในวงการและคะแนนเริ่มต้นใน Firestore
      await setDoc(doc(db, "players", firebaseUser.uid), {
        badmintonName,
        score: 0,
      });

      setUser(firebaseUser);
      setPage("dashboard"); // หลังลงทะเบียนสำเร็จ ไปที่ Dashboard
    } catch (err) {
      console.error("Register error:", err);
      setError(err.message || "เกิดข้อผิดพลาดในการสมัคร");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20, marginTop: 40, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>ลงทะเบียนผู้ใช้งานใหม่</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        style={{ width: "100%", padding: 8, marginBottom: 8 }}
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
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
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
      />
      <button
        style={{ width: "100%", padding: 10, backgroundColor: "#2b6cb0", color: "white", marginBottom: 8 }}
        onClick={handleRegister}
      >
        ลงทะเบียน
      </button>
      <button
        style={{ width: "100%", padding: 10, backgroundColor: "#718096", color: "white" }}
        onClick={() => setPage("login")} // ปุ่มกลับไปหน้า Login
      >
        กลับไปหน้าเข้าสู่ระบบ
      </button>
    </div>
  );
}