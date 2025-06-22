import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import Login from "./Login";
import Dashboard from "./Dashboard";
import AddResult from "./AddResult";
import logo from "./assets/logo.png";

export default function App() {
  const [user, setUser] = useState(null); // user object from firebase auth
  const [playerData, setPlayerData] = useState(null); // user data from firestore
  const [page, setPage] = useState("login");

  // Listen for auth state changes (login/logout)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // โหลดข้อมูลผู้เล่นจาก firestore
        const docRef = doc(db, "players", firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPlayerData(docSnap.data());
          setPage("dashboard");
        } else {
          // ถ้ายังไม่มีข้อมูลผู้เล่นใน firestore
          setPlayerData(null);
          setPage("login");
        }
      } else {
        setUser(null);
        setPlayerData(null);
        setPage("login");
      }
    });
    return () => unsubscribe();
  }, []);

  if (page === "login") {
    return (
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <img src={logo} alt="โลโก้เว็บ" style={{ width: 150, marginBottom: 20 }} />
        <h1>The Heavenly Kings of Badminton</h1>
        <Login setPage={setPage} />
      </div>
    );
  }

  if (page === "dashboard" && user && playerData) {
    return (
      <Dashboard
        user={user}
        playerData={playerData}
        setPage={setPage}
        setPlayerData={setPlayerData}
      />
    );
  }

  if (page === "addresult" && user && playerData) {
    return (
      <AddResult
        user={user}
        playerData={playerData}
        setPage={setPage}
        setPlayerData={setPlayerData}
      />
    );
  }

  return <div>Loading...</div>;
}
