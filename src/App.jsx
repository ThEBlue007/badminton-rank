import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import Login from "./Login";
import Dashboard from "./Dashboard";
import AddResult from "./AddResult";
import logo from "./assets/logo.png";

export default function App() {
  const [user, setUser] = useState(null); // Firebase Auth user object
  const [playerData, setPlayerData] = useState(null); // Data from Firestore (badmintonName, score, etc.)
  const [page, setPage] = useState("login");

  useEffect(() => {
    // Listen for auth state changes
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
          // If no data in Firestore yet, you might want to redirect to registration or create default data
          setPlayerData(null);
          setPage("login"); // Or you can create an onboarding flow here
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
  if (page !== "login" && (!user || !playerData)) {
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
