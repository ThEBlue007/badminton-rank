// App.jsx
import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import Login from "./Login";
import Register from "./Register"; // Import Register component
import Dashboard from "./Dashboard";
import AddResult from "./AddResult";
import logo from "./assets/logo.png";

export default function App() {
  const [user, setUser] = useState(null); // Firebase Auth user object
  const [playerData, setPlayerData] = useState(null); // Data from Firestore (badmintonName, score, etc.)
  const [page, setPage] = useState("login"); // Default page is login

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        // Load user data from Firestore "players" collection
        const docRef = doc(db, "players", firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPlayerData(docSnap.data());
          setPage("dashboard");
        } else {
          // หากผู้ใช้มีการล็อกอินแล้วแต่ไม่มีข้อมูลผู้เล่นใน Firestore
          // ให้แสดงหน้า Login (หรืออาจจะพาไปหน้า Register อีกครั้งถ้าคุณต้องการให้สร้างข้อมูลผู้เล่นใหม่)
          setPlayerData(null);
          // setPage("register"); // คุณอาจจะใช้บรรทัดนี้แทนถ้าอยากให้ผู้ใช้ไปลงทะเบียนข้อมูลผู้เล่นเมื่อไม่พบ
          setPage("login"); // กลับไปหน้า Login เพื่อให้ผู้ใช้เลือกเข้าสู่ระบบหรือลงทะเบียนใหม่
        }
      } else {
        setUser(null);
        setPlayerData(null);
        setPage("login");
      }
    });

    return () => unsubscribe();
  }, []);

  // กรณีโหลดข้อมูลยังไม่เสร็จ
  if (page !== "login" && page !== "register" && (!user || !playerData)) {
    return (
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <img src={logo} alt="โลโก้เว็บ" style={{ width: 150, marginBottom: 20 }} />
      <h1>The Heavenly Kings of Badminton</h1>

      {page === "login" && (
        <Login setUser={setUser} setPage={setPage} />
      )}

      {page === "register" && ( // เพิ่มเงื่อนไขสำหรับการแสดงหน้า Register
        <Register setUser={setUser} setPage={setPage} />
      )}

      {page === "dashboard" && user && playerData && (
        <Dashboard
          user={user}
          playerData={playerData}
          setPage={setPage}
          setPlayerData={setPlayerData}
        />
      )}

      {page === "addresult" && user && playerData && (
        <AddResult
          user={user}
          playerData={playerData}
          setPage={setPage}
          setPlayerData={setPlayerData}
        />
      )}
    </div>
  );
}
