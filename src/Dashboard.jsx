// Dashboard.jsx
import React, { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import { db, auth } from "./firebase";

export default function Dashboard({ user, playerData, setPage, setPlayerData }) {
  const [players, setPlayers] = useState({});
  const [editingUid, setEditingUid] = useState(null);
  const [editScore, setEditScore] = useState("");
  const [editBadmintonName, setEditBadmintonName] = useState(""); // เพิ่ม state สำหรับแก้ไขชื่อ
  const [loading, setLoading] = useState(true);

  // โหลดข้อมูลผู้เล่นทั้งหมดแบบเรียลไทม์
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "players"),
      (snapshot) => {
        const data = {};
        snapshot.forEach((doc) => {
          data[doc.id] = doc.data();
        });
        setPlayers(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error loading players:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // อัปเดตคะแนนและชื่อใน Firestore
  const handleSave = async (uid) => {
    const scoreNum = parseFloat(editScore);
    if (isNaN(scoreNum) || scoreNum < 0) {
      alert("กรุณากรอกคะแนนให้ถูกต้อง");
      return;
    }
    // เพิ่มการตรวจสอบชื่อ ถ้ามีการแก้ไขชื่อ
    if (!editBadmintonName.trim()) {
      alert("กรุณากรอกชื่อในวงการแบด");
      return;
    }

    try {
      const playerRef = doc(db, "players", uid);
      await updateDoc(playerRef, {
        score: scoreNum,
        badmintonName: editBadmintonName // อัปเดตชื่อในวงการแบด
      });
      if (uid === user.uid) {
        // อัปเดตข้อมูลของตัวเองด้วย
        setPlayerData((prev) => ({ ...prev, score: scoreNum, badmintonName: editBadmintonName }));
      }
      setEditingUid(null);
      setEditScore("");
      setEditBadmintonName("");
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
      console.error(error);
    }
  };

  // ลบบัญชีผู้ใช้
  const handleDelete = async (uidToDelete) => {
    if (
      window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบบัญชีนี้? การกระทำนี้ไม่สามารถย้อนกลับได้")
    ) {
      try {
        await deleteDoc(doc(db, "players", uidToDelete));
        if (uidToDelete === user.uid) {
          // หากลบ account ตัวเอง ให้ออกจากระบบด้วย
          await auth.signOut();
        }
      } catch (error) {
        alert("เกิดข้อผิดพลาดในการลบบัญชี");
        console.error(error);
      }
    }
  };

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: 40 }}>Loading...</div>;
  }

  // จัดอันดับ
  const ranking = Object.entries(players)
    .map(([uid, info]) => ({
      uid,
      badmintonName: info.badmintonName || "ไม่ทราบชื่อ",
      score: info.score || 0,
    }))
    .sort((a, b) => b.score - a.score);

  return (
    <div style={{ maxWidth: 700, margin: "auto", padding: 20, marginTop: 40 }}>
      <h2>สวัสดี, {playerData.badmintonName}</h2>

      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => setPage("addresult")}
          style={{ marginRight: 10, padding: 10, backgroundColor: "#38a169", color: "white" }}
        >
          กรอกผลการแข่งขัน
        </button>
        <button
          onClick={() => auth.signOut()}
          style={{ padding: 10, backgroundColor: "#e53e3e", color: "white" }}
        >
          ออกจากระบบ
        </button>
      </div>

      <h3>อันดับผู้เล่น</h3>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: 10,
          border: "1px solid #ddd"
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#2b6cb0", color: "white" }}>
            <th style={{ border: "1px solid #ddd", padding: 8 }}>อันดับ</th>
            <th style={{ border: "1px solid #ddd", padding: 8 }}>ชื่อในวงการ</th>
            <th style={{ border: "1px solid #ddd", padding: 8, textAlign: "right" }}>
              คะแนน
            </th>
            <th style={{ border: "1px solid #ddd", padding: 8, textAlign: "center" }}>
              จัดการ
            </th>
          </tr>
        </thead>
        <tbody>
          {ranking.map((p, i) => (
            <tr
              key={p.uid}
              style={{
                backgroundColor: i % 2 === 0 ? "#f0f8ff" : "white",
                color: "#2d3748"
              }}
            >
              <td style={{ border: "1px solid #ddd", padding: 8, textAlign: "center" }}>
                {i + 1}
              </td>
              <td style={{ border: "1px solid #ddd", padding: 8 }}>
                {editingUid === p.uid ? (
                  <input
                    type="text" // เปลี่ยนเป็น text สำหรับชื่อ
                    value={editBadmintonName}
                    onChange={(e) => setEditBadmintonName(e.target.value)}
                    style={{ width: "90%", textAlign: "left" }}
                  />
                ) : (
                  p.badmintonName
                )}
              </td>
              <td style={{ border: "1px solid #ddd", padding: 8, textAlign: "right" }}>
                {editingUid === p.uid ? (
                  <input
                    type="number"
                    value={editScore}
                    onChange={(e) => setEditScore(e.target.value)}
                    style={{ width: 80, textAlign: "right" }}
                  />
                ) : (
                  p.score.toFixed(2)
                )}
              </td>
              <td style={{ border: "1px solid #ddd", padding: 8, textAlign: "center" }}>
                {editingUid === p.uid ? (
                  <>
                    <button
                      onClick={() => handleSave(p.uid)}
                      style={{ marginRight: 5 }}
                    >
                      บันทึก
                    </button>
                    <button onClick={() => setEditingUid(null)}>ยกเลิก</button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditingUid(p.uid);
                        setEditScore(p.score.toFixed(2));
                        setEditBadmintonName(p.badmintonName); // ตั้งค่าชื่อปัจจุบันเมื่อเริ่มแก้ไข
                      }}
                      style={{ marginRight: 5 }}
                    >
                      แก้ไข
                    </button>
                    <button
                      onClick={() => handleDelete(p.uid)}
                      style={{ backgroundColor: "#c53030", color: "white" }}
                    >
                      ลบ
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
