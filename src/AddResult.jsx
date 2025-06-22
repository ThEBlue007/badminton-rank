import React, { useState } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export default function AddResult({ user, setPage }) {
  const [points, setPoints] = useState("");
  const [timeMinutes, setTimeMinutes] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    const p = parseFloat(points);
    const t = parseFloat(timeMinutes);
    if (isNaN(p) || isNaN(t) || p < 0 || t <= 0) {
      setError("กรุณากรอกแต้มและเวลาให้ถูกต้อง");
      return;
    }

    try {
      const playerRef = doc(db, "players", user.username);
      const playerSnap = await getDoc(playerRef);

      if (!playerSnap.exists()) {
        setError("ไม่พบข้อมูลผู้เล่นในระบบ");
        return;
      }

      const oldScore = playerSnap.data().score || 0;
      const newScore = oldScore + (p * 500) / t;

      await updateDoc(playerRef, { score: newScore });

      setSuccess(`บันทึกคะแนนสำเร็จ! คะแนนใหม่: ${newScore.toFixed(2)}`);
      setPoints("");
      setTimeMinutes("");
    } catch (err) {
      console.error(err);
      setError("เกิดข้อผิดพลาดในการบันทึกคะแนน");
    }
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
      <h2>กรอกผลการแข่งขัน</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <p>
        ผู้เล่น: <b>{user.badmintonName}</b>
      </p>
      <input
        type="number"
        placeholder="แต้มที่ได้"
        value={points}
        onChange={(e) => setPoints(e.target.value)}
        min="0"
        step="0.01"
        style={{ width: "100%", padding: 8, marginBottom: 8 }}
      />
      <input
        type="number"
        placeholder="เวลาที่เล่น (นาที)"
        value={timeMinutes}
        onChange={(e) => setTimeMinutes(e.target.value)}
        min="0.1"
        step="0.1"
        style={{ width: "100%", padding: 8, marginBottom: 12 }}
      />
      <button
        onClick={handleSubmit}
        style={{ width: "100%", padding: 10, backgroundColor: "#2b6cb0", color: "white" }}
      >
        บันทึกผล
      </button>
      <button
        onClick={() => setPage("dashboard")}
        style={{ width: "100%", padding: 10, marginTop: 8, backgroundColor: "#718096", color: "white" }}
      >
        กลับหน้าหลัก
      </button>
    </div>
  );
}
