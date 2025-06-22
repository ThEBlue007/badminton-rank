import React, { useState, useEffect } from "react";
import { 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc 
} from "firebase/firestore";
import { db } from "./firebase"; // ไฟล์ที่ตั้งค่า Firebase
import { auth } from "./firebase";

export default function Dashboard({ user, setPage, logout }) {
  const [players, setPlayers] = useState({});
  const [editingUser, setEditingUser] = useState(null);
  const [editScore, setEditScore] = useState("");
  const [loading, setLoading] = useState(true);

  // โหลดข้อมูล players จาก Firestore แบบ realtime
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "players"), (snapshot) => {
      const playersData = {};
      snapshot.forEach((doc) => {
        playersData[doc.id] = doc.data();
      });
      setPlayers(playersData);
      setLoading(false);
    }, (error) => {
      console.error("Error loading players: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // บันทึกคะแนนที่แก้ไขลง Firestore
  const handleSave = async (username) => {
    const scoreNum = parseFloat(editScore);
    if (isNaN(scoreNum) || scoreNum < 0) {
      alert("กรุณากรอกคะแนนเป็นตัวเลขและมากกว่า 0");
      return;
    }

    try {
      const playerRef = doc(db, "players", username);
      await updateDoc(playerRef, { score: scoreNum });
      setEditingUser(null);
      setEditScore("");
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการบันทึกคะแนน");
      console.error(error);
    }
  };

  // ลบบัญชีผู้ใช้จาก Firestore และถ้าคือตัวเองก็ logout
  const handleDeleteUser = async (usernameToDelete) => {
    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบบัญชีผู้ใช้ ${usernameToDelete}? การกระทำนี้ไม่สามารถย้อนกลับได้`)) {
      try {
        await deleteDoc(doc(db, "players", usernameToDelete));

        if (usernameToDelete === user.username) {
          // ลบบัญชีตัวเอง ให้ logout
          logout();
        }
      } catch (error) {
        alert("ลบบัญชีไม่สำเร็จ โปรดลองใหม่อีกครั้ง");
        console.error(error);
      }
    }
  };

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: 40 }}>Loading...</div>;
  }

  // แปลง players เป็น array และจัดอันดับ
  const ranking = Object.entries(players)
    .map(([username, info]) => ({
      username,
      badmintonName: info.badmintonName || "ไม่มีชื่อ",
      score: info.score || 0,
    }))
    .sort((a, b) => b.score - a.score);

  return (
    <div style={{ maxWidth: 700, margin: "auto", padding: 20, marginTop: 40 }}>
      <h2>สวัสดี, {p.badmintonName}</h2>
      <button
        onClick={() => setPage("addresult")}
        style={{ marginRight: 8, padding: 10, backgroundColor: "#38a169", color: "white" }}
      >
        กรอกผลการแข่งขัน
      </button>
      <button
        onClick={logout}
        style={{ padding: 10, backgroundColor: "#e53e3e", color: "white" }}
      >
        ออกจากระบบ
      </button>

      <h3 style={{ marginTop: 30 }}>อันดับผู้เล่น</h3>
      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: 10, border: "1px solid #ddd" }}
      >
        <thead>
          <tr style={{ backgroundColor: "#2b6cb0", color: "white" }}>
            <th style={{ border: "1px solid #ddd", padding: 8 }}>อันดับ</th>
            
            <th style={{ border: "1px solid #ddd", padding: 8 }}>ชื่อวงการแบด</th>
            <th style={{ border: "1px solid #ddd", padding: 8, textAlign: "right" }}>
              คะแนนสะสม
            </th>
            <th style={{ border: "1px solid #ddd", padding: 8, textAlign: "center" }}>
              จัดการ
            </th>
          </tr>
        </thead>
        <tbody>
          {ranking.map((p, i) => (
            <tr
              key={p.username}
              style={{
                backgroundColor: i % 2 === 0 ? "#ebf8ff" : "white",
                color: "#2d3748",
              }}
            >
              <td style={{ border: "1px solid #ddd", padding: 8, textAlign: "center" }}>
                {i + 1}
              </td>
              
              <td style={{ border: "1px solid #ddd", padding: 8 }}>{p.badmintonName}</td>
              <td style={{ border: "1px solid #ddd", padding: 8, textAlign: "right" }}>
                {editingUser === p.username ? (
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
                {editingUser === p.username ? (
                  <>
                    <button
                      onClick={() => handleSave(p.username)}
                      style={{ marginRight: 8 }}
                    >
                      บันทึก
                    </button>
                    <button onClick={() => setEditingUser(null)}>ยกเลิก</button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditingUser(p.username);
                        setEditScore(p.score.toFixed(2));
                      }}
                      style={{ marginRight: 8 }}
                    >
                      แก้ไข
                    </button>
                    <button
                      onClick={() => handleDeleteUser(p.username)}
                      style={{ backgroundColor: "#dd4b39", color: "white" }}
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
