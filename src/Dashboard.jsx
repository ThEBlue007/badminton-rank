import React, { useState } from "react";

export default function Dashboard({ user, setPage, players, savePlayers, logout, deleteAccount }) {
  const [editingUser, setEditingUser] = useState(null);
  const [editScore, setEditScore] = useState("");

  // สร้างอันดับเรียงจากคะแนนมากไปน้อย
  const ranking = Object.entries(players)
    .map(([username, info]) => ({
      username,
      badmintonName: info.badmintonName,
      score: info.score,
    }))
    .sort((a, b) => b.score - a.score);

  // บันทึกคะแนนที่แก้ไข
  const handleSave = (username) => {
    const scoreNum = parseFloat(editScore);
    if (isNaN(scoreNum) || scoreNum < 0) {
      alert("กรุณากรอกคะแนนเป็นตัวเลขและมากกว่า 0");
      return;
    }
    const newPlayers = {
      ...players,
      [username]: { ...players[username], score: scoreNum },
    };
    savePlayers(newPlayers);
    setEditingUser(null);
    setEditScore("");
  };

  // ใช้ deleteAccount function จาก props
  const handleDeleteAccount = () => {
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบบัญชีนี้? การกระทำนี้ไม่สามารถย้อนกลับได้")) {
      deleteAccount();
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20, marginTop: 40 }}>
      <h2>สวัสดี, {user.badmintonName}</h2>
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

      <button
        onClick={handleDeleteAccount}
        style={{ padding: 10, backgroundColor: "#dd4b39", color: "white", marginLeft: 10 }}
      >
        ลบบัญชีผู้ใช้
      </button>

      <h3 style={{ marginTop: 30 }}>อันดับผู้เล่น</h3>
      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: 10, border: "1px solid #ddd" }}
      >
        <thead>
          <tr style={{ backgroundColor: "#2b6cb0", color: "white" }}>
            <th style={{ border: "1px solid #ddd", padding: 8 }}>อันดับ</th>
            <th style={{ border: "1px solid #ddd", padding: 8 }}>Username</th>
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
              <td style={{ border: "1px solid #ddd", padding: 8 }}>{p.username}</td>
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
                  <button
                    onClick={() => {
                      setEditingUser(p.username);
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