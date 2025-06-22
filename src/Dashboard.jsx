import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { signOut } from "firebase/auth";
import { doc, setDoc, getDocs, collection } from "firebase/firestore";

export default function Dashboard({ user, playerData, setPage, setPlayerData }) {
  const [ranking, setRanking] = useState([]);
  const [editingScoreUser, setEditingScoreUser] = useState(null);
  const [editScore, setEditScore] = useState("");

  // โหลดข้อมูลอันดับผู้เล่นจาก Firestore
  useEffect(() => {
    async function fetchRanking() {
      const querySnapshot = await getDocs(collection(db, "players"));
      let playersArray = [];
      querySnapshot.forEach((docSnap) => {
        playersArray.push({ id: docSnap.id, ...docSnap.data() });
      });
      playersArray.sort((a, b) => b.score - a.score);
      setRanking(playersArray);
    }
    fetchRanking();
  }, []);

  // บันทึกคะแนนที่แก้ไข
  const handleSaveScore = async (uid) => {
    const scoreNum = parseFloat(editScore);
    if (isNaN(scoreNum) || scoreNum < 0) {
      alert("กรุณากรอกคะแนนเป็นตัวเลขและมากกว่า 0");
      return;
    }
    try {
      await setDoc(doc(db, "players", uid), {
        ...ranking.find((p) => p.id === uid),
        score: scoreNum,
      });
      setEditingScoreUser(null);
      setEditScore("");
      // อัปเดตข้อมูล playerData ถ้ากำลังแก้ของตัวเอง
      if (uid === user.uid) {
        setPlayerData((prev) => ({ ...prev, score: scoreNum }));
      }
      // รีโหลดอันดับ
      const querySnapshot = await getDocs(collection(db, "players"));
      let playersArray = [];
      querySnapshot.forEach((docSnap) => {
        playersArray.push({ id: docSnap.id, ...docSnap.data() });
      });
      playersArray.sort((a, b) => b.score - a.score);
      setRanking(playersArray);
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการบันทึกคะแนน");
      console.error(error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setPage("login");
  };

  const handleDeleteAccount = async () => {
    // ลบบัญชีใน Firestore และ Firebase Auth (ถ้าต้องการเพิ่ม)
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบบัญชีนี้?")) {
      try {
        // ลบข้อมูลใน Firestore
        await db.collection("players").doc(user.uid).delete();
        // ลบผู้ใช้จาก Firebase Auth (optional)
        // await user.delete();

        await signOut(auth);
        setPage("login");
      } catch (error) {
        alert("ไม่สามารถลบบัญชีได้");
        console.error(error);
      }
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20, marginTop: 40 }}>
      <h2>สวัสดี, {playerData.badmintonName}</h2>
      <button
        onClick={() => setPage("addresult")}
        style={{ marginRight: 8, padding: 10, backgroundColor: "#38a169", color: "white" }}
      >
        กรอกผลการแข่งขัน
      </button>
      <button
        onClick={handleLogout}
        style={{ padding: 10, backgroundColor: "#e53e3e", color: "white" }}
      >
        ออกจากระบบ
      </button>
      {/* ปุ่มลบบัญชีถ้าต้องการเปิดใช้งาน */}
      {/* <button onClick={handleDeleteAccount}>ลบบัญชีผู้ใช้</button> */}

      <h3 style={{ marginTop: 30 }}>อันดับผู้เล่น</h3>
      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: 10, border: "1px solid #ddd" }}
      >
        <thead>
          <tr style={{ backgroundColor: "#2b6cb0", color: "white" }}>
            <th style={{ border: "1px solid #ddd", padding: 8 }}>อันดับ</th>
            <th style={{ border: "1px solid #ddd", padding: 8 }}>ชื่อวงการแบด</th>
            <th style={{ border: "1px solid #ddd", padding: 8, textAlign: "right" }}>คะแนนสะสม</th>
            <th style={{ border: "1px solid #ddd", padding: 8, textAlign: "center" }}>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {ranking.map((p, i) => (
            <tr
              key={p.id}
              style={{
                backgroundColor: i % 2 === 0 ? "#ebf8ff" : "white",
                color: "#2d3748",
              }}
            >
              <td style={{ border: "1px solid #ddd", padding: 8, textAlign: "center" }}>{i + 1}</td>
              <td style={{ border: "1px solid #ddd", padding: 8 }}>{p.badmintonName}</td>
              <td style={{ border: "1px solid #ddd", padding: 8, textAlign: "right" }}>
                {editingScoreUser === p.id ? (
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
                {editingScoreUser === p.id ? (
                  <>
                    <button onClick={() => handleSaveScore(p.id)} style={{ marginRight: 8 }}>
                      บันทึก
                    </button>
                    <button onClick={() => setEditingScoreUser(null)}>ยกเลิก</button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setEditingScoreUser(p.id);
                      setEditScore(p.score.toFixed(2));
                    }}
                  >
                    แก้ไข
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
