import { useState, useEffect } from "react";

const IMAGE = "/puzzle.png";
const GRID = 3;
const SIZE = 100;
const QUESTIONS = {
  0: { q: "في أي سنة تم اعتماد اتفاقية حقوق الطفل؟", a: "1989", o: ["1975", "1989", "1995", "2001"] },
  1: { q: "أي منظمة عالمية تُعنى أساسًا بحماية حقوق الطفل؟", a: "UNICEF", o: ["UNESCO", "UNICEF", "WHO", "IMF"] },
  2: { q: "كم عدد مواد اتفاقية حقوق الطفل تقريبًا؟", a: "54", o: ["30", "54", "70", "100"] },
  3: { q: "أي حق يُعتبر من الحقوق الأساسية للطفل؟", a: "الحق في التعليم", o: ["الحق في السفر", "الحق في التعليم", "الحق في الهاتف", "الحق في العمل"] },
  4: { q: "في أي يوم يُحتفل باليوم العالمي للطفل؟", a: "20 نوفمبر", o: ["1 جوان", "20 نوفمبر", "15 مارس", "5 أكتوبر"] },
  5: { q: "أي من هذه يُعتبر خرقًا لحقوق الطفل عالميًا؟", a: "تشغيل الأطفال بشكل خطير", o: ["التعليم الإجباري", "تشغيل الأطفال بشكل خطير", "اللعب", "الرعاية الصحية"] },
  6: { q: "اتفاقية حقوق الطفل تُطبّق على من؟", a: "الأطفال أقل من 18 سنة", o: ["كل إنسان", "الأطفال أقل من 18 سنة", "التلاميذ فقط", "الرضع فقط"] },
  7: { q: "ماذا تعني كلمة UNICEF؟", a: "صندوق الأمم المتحدة للطفولة", o: ["منظمة التعليم", "صندوق الأمم المتحدة للطفولة", "منظمة الصحة", "بنك دولي"] },
  8: { q: "حق اللعب مهم لأنه:", a: "يساعد على النمو والتوازن النفسي", o: ["مضيعة للوقت", "يساعد على النمو والتوازن النفسي", "غير ضروري", "للأطفال فقط في العطل"] },
};


const stylePiece = (i, size) => {
  const row = Math.floor(i / GRID);
  const col = i % GRID;
  return {
    backgroundImage: `url(${IMAGE})`,
    backgroundSize: `${GRID * size}px`,
    backgroundPosition: `-${col * size}px -${row * size}px`,
  };
};

const formatTime = (time) => {
  const min = Math.floor(time / 60);
  const sec = time % 60;
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
};

export default function App() {
  const [pieces, setPieces] = useState([]);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [selected, setSelected] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [targetCell, setTargetCell] = useState(null);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [win, setWin] = useState(false);
  const [time, setTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(true);
  const [wrongAnim, setWrongAnim] = useState(false);

  useEffect(() => {
    const shuffled = [...Array(9).keys()].sort(() => Math.random() - 0.5);
    setPieces(shuffled);
  }, []);

  useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [timerRunning]);

  useEffect(() => {
    if (board.every((c, i) => c === i)) {
      setTimerRunning(false);
      setTimeout(() => setWin(true), 400);
    }
  }, [board]);

  const handleCellClick = (i) => {
    if (selected === null || board[i] !== null) return;
    setQuiz(QUESTIONS[selected]);
    setTargetCell(i);
    setMsg({ text: "", type: "" });
  };

  const answer = (opt) => {
    if (opt === QUESTIONS[selected].a) {
      setMsg({ text: "✅ صحيح!", type: "success" });
      setTimeout(() => {
        if (targetCell === selected) {
          const newBoard = [...board];
          newBoard[targetCell] = selected;
          setBoard(newBoard);
          setPieces((prev) => prev.filter((p) => p !== selected));
        } else {
          setMsg({ text: "❌ البلاصة غالطة!", type: "error" });
        }
        setSelected(null);
        setQuiz(null);
        setMsg({ text: "", type: "" });
      }, 600);
    } else {
      setMsg({ text: "❌ إجابة خاطئة!", type: "error" });
      setWrongAnim(true);
      setTimeout(() => setWrongAnim(false), 500);
    }
  };

  const totalPlaced = board.filter((c) => c !== null).length;
  const progress = (totalPlaced / 9) * 100;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;800&family=Cairo:wght@400;600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #0a0e1a;
          font-family: 'Cairo', sans-serif;
          direction: rtl;
        }

        .app {
          min-height: 100vh;
          background: radial-gradient(ellipse at 20% 20%, #1a1040 0%, #0a0e1a 60%),
                      radial-gradient(ellipse at 80% 80%, #0d2040 0%, transparent 60%);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 16px 12px 30px;
          gap: 14px;
        }

        /* HEADER */
        .header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          width: 100%;
        }
        .title {
          font-family: 'Baloo 2', cursive;
          font-size: 26px;
          font-weight: 800;
          background: linear-gradient(135deg, #f9d423, #ff9a00, #f9d423);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
          letter-spacing: 1px;
        }
        @keyframes shimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        .subtitle {
          font-size: 11px;
          color: #64748b;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        /* STATS BAR */
        .stats-bar {
          display: flex;
          gap: 16px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 50px;
          padding: 8px 20px;
          backdrop-filter: blur(10px);
        }
        .stat-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #94a3b8;
        }
        .stat-value {
          font-family: 'Baloo 2', monospace;
          font-weight: 700;
          font-size: 15px;
          color: #f9d423;
        }

        /* PROGRESS */
        .progress-wrap {
          width: min(340px, 95vw);
          background: rgba(255,255,255,0.06);
          border-radius: 20px;
          height: 6px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          border-radius: 20px;
          background: linear-gradient(90deg, #f9d423, #ff9a00);
          transition: width 0.5s cubic-bezier(.4,0,.2,1);
          box-shadow: 0 0 10px rgba(249,212,35,0.5);
        }

        /* BOARD */
        .board-section { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .board-label { font-size: 11px; color: #475569; letter-spacing: 2px; text-transform: uppercase; }
        .board-grid {
  display: grid;
  grid-template-columns: repeat(3, ${SIZE}px);
  gap: 5px;
  padding: 10px;
  background: rgba(255,255,255,0.03);
  border-radius: 18px;
  border: 1px solid rgba(255,255,255,0.07);

  direction: ltr; /* ✅ هذا هو الحل */
}

        .cell {
          width: ${SIZE}px;
          height: ${SIZE}px;
          border-radius: 10px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          position: relative;
          overflow: hidden;
        }
        .cell-empty {
          border: 2px dashed rgba(100,116,139,0.4);
          background: rgba(255,255,255,0.02);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cell-empty:hover {
          border-color: rgba(249,212,35,0.4);
          background: rgba(249,212,35,0.05);
          transform: scale(1.03);
        }
        .cell-filled {
          box-shadow: 0 4px 15px rgba(0,0,0,0.4);
          animation: popIn 0.35s cubic-bezier(.175,.885,.32,1.275);
        }
        @keyframes popIn {
          0% { transform: scale(0.7); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .cell-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: rgba(100,116,139,0.3);
        }

        /* PIECES TRAY */
        .tray-section { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .tray-label { font-size: 11px; color: #475569; letter-spacing: 2px; text-transform: uppercase; }
        .tray {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px 14px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px;
  max-width: min(360px, 95vw);

  direction: ltr; /* ✅ مهم */
}
        .piece {
          width: 75px;
          height: 75px;
          border-radius: 10px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s, border-color 0.15s;
          border: 2px solid rgba(59,130,246,0.4);
        }
        .piece:hover { transform: translateY(-3px) scale(1.05); box-shadow: 0 8px 20px rgba(59,130,246,0.3); }
        .piece-selected {
          border-color: #f9d423 !important;
          box-shadow: 0 0 0 3px rgba(249,212,35,0.3), 0 8px 20px rgba(249,212,35,0.2) !important;
          transform: translateY(-4px) scale(1.06) !important;
          animation: pulse-gold 1.5s ease infinite;
        }
        @keyframes pulse-gold {
          0%,100% { box-shadow: 0 0 0 3px rgba(249,212,35,0.3); }
          50% { box-shadow: 0 0 0 6px rgba(249,212,35,0.15); }
        }

        /* MSG */
        .msg {
          font-size: 14px;
          font-weight: 600;
          min-height: 20px;
          transition: opacity 0.3s;
        }
        .msg-success { color: #4ade80; }
        .msg-error { color: #f87171; }

        /* QUIZ OVERLAY */
        .overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.75);
          backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          z-index: 100;
          padding: 16px;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .quiz-card {
          background: linear-gradient(145deg, #1e293b, #0f172a);
          border: 1px solid rgba(249,212,35,0.2);
          border-radius: 20px;
          padding: 24px 20px;
          width: 100%;
          max-width: 320px;
          box-shadow: 0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05);
          animation: slideUp 0.3s cubic-bezier(.175,.885,.32,1.275);
        }
        @keyframes slideUp {
          from { transform: translateY(30px) scale(0.95); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        .quiz-icon {
          font-size: 28px;
          text-align: center;
          margin-bottom: 10px;
        }
        .quiz-question {
          font-size: 15px;
          font-weight: 600;
          color: #e2e8f0;
          text-align: center;
          line-height: 1.6;
          margin-bottom: 16px;
          padding-bottom: 14px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .quiz-options { display: flex; flex-direction: column; gap: 8px; }
        .quiz-btn {
          width: 100%;
          padding: 11px 14px;
          background: rgba(59,130,246,0.12);
          border: 1px solid rgba(59,130,246,0.25);
          border-radius: 12px;
          color: #cbd5e1;
          font-family: 'Cairo', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          text-align: right;
        }
        .quiz-btn:hover {
          background: rgba(59,130,246,0.25);
          border-color: rgba(59,130,246,0.5);
          color: #fff;
          transform: translateX(-2px);
        }
        .quiz-btn:active { transform: scale(0.97); }
        .quiz-msg {
          text-align: center;
          margin-top: 10px;
          font-size: 14px;
          font-weight: 700;
          min-height: 20px;
        }
        .quiz-wrong {
          animation: shake 0.4s ease;
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }

        /* WIN SCREEN */
        .win-screen {
          position: fixed; inset: 0;
          background: #000;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
          z-index: 200;
          animation: fadeIn 0.5s ease;
          padding: 20px;
        }
        .win-image-wrap {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 0 0 3px #f9d423, 0 20px 60px rgba(249,212,35,0.3);
          animation: revealImage 0.8s cubic-bezier(.175,.885,.32,1.275) 0.2s both;
        }
        @keyframes revealImage {
          from { transform: scale(0.7) rotate(-3deg); opacity: 0; }
          to { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .win-image {
          display: block;
          width: min(300px, 85vw);
          height: auto;
        }
        .win-title {
          font-family: 'Baloo 2', cursive;
          font-size: 22px;
          font-weight: 800;
          color: #fff;
          text-align: center;
          animation: slideUp 0.5s ease 0.6s both;
        }
        .win-time-label {
          font-size: 13px;
          color: #94a3b8;
          letter-spacing: 1px;
          text-transform: uppercase;
          animation: slideUp 0.5s ease 0.75s both;
        }
        .win-time-value {
          font-family: 'Baloo 2', monospace;
          font-size: 48px;
          font-weight: 800;
          background: linear-gradient(135deg, #f9d423, #ff9a00);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1;
          animation: slideUp 0.5s ease 0.85s both;
        }
        .win-stars {
          font-size: 30px;
          letter-spacing: 4px;
          animation: slideUp 0.5s ease 1s both;
        }
        .win-restart {
          padding: 12px 30px;
          background: linear-gradient(135deg, #f9d423, #ff9a00);
          border: none;
          border-radius: 50px;
          font-family: 'Cairo', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #0a0e1a;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          animation: slideUp 0.5s ease 1.1s both;
        }
        .win-restart:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(249,212,35,0.4);
        }

        /* CONFETTI */
        .confetti-wrap { position: fixed; inset: 0; pointer-events: none; overflow: hidden; z-index: 199; }
        .confetti-piece {
          position: absolute;
          width: 8px; height: 8px;
          border-radius: 2px;
          animation: fall linear infinite;
        }
        @keyframes fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>

      <div className="app">
        {/* HEADER */}
        <div className="header">
          <h1 className="title">🧩 PUZZLE ONET</h1>
          <p className="subtitle">حقوق الطفل</p>
        </div>

        {/* STATS */}
        <div className="stats-bar">
          <div className="stat-item">
            <span>⏱</span>
            <span className="stat-value">{formatTime(time)}</span>
          </div>
          <div className="stat-item" style={{ borderRight: "1px solid rgba(255,255,255,0.08)", paddingRight: 16 }}>
            <span>🧩</span>
            <span className="stat-value">{totalPlaced}/9</span>
          </div>
          <div className="stat-item" style={{ color: selected !== null ? "#f9d423" : "#475569" }}>
            <span>{selected !== null ? "✅ قطعة محددة" : "اختر قطعة"}</span>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="progress-wrap">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* BOARD */}
        <div className="board-section">
          <p className="board-label">لوحة الأجوبة</p>
          <div className="board-grid">
            {board.map((p, i) => (
              <div
                key={i}
                className={`cell ${p !== null ? "cell-filled" : "cell-empty"}`}
                onClick={() => handleCellClick(i)}
                style={p !== null ? stylePiece(p, SIZE) : {}}
              >
                {p === null && <div className="cell-dot" />}
              </div>
            ))}
          </div>
        </div>

        {/* TRAY */}
        {pieces.length > 0 && (
          <div className="tray-section">
            <p className="tray-label">القطع المتبقية</p>
            <div className="tray">
              {pieces.map((p) => {
                const pieceStyle = (() => {
                  const row = Math.floor(p / GRID);
                  const col = p % GRID;
                  return {
                    backgroundImage: `url(${IMAGE})`,
                    backgroundSize: `${GRID * 75}px`,
                    backgroundPosition: `-${col * 75}px -${row * 75}px`,
                  };
                })();
                return (
                  <div
                    key={p}
                    className={`piece ${selected === p ? "piece-selected" : ""}`}
                    style={pieceStyle}
                    onClick={() => setSelected(selected === p ? null : p)}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* MSG */}
        {msg.text && (
          <p className={`msg ${msg.type === "success" ? "msg-success" : "msg-error"}`}>{msg.text}</p>
        )}
      </div>

      {/* QUIZ MODAL */}
      {quiz && (
        <div className="overlay">
          <div className={`quiz-card ${wrongAnim ? "quiz-wrong" : ""}`}>
            <div className="quiz-icon">❓</div>
            <p className="quiz-question">{quiz.q}</p>
            <div className="quiz-options">
              {quiz.o.map((opt) => (
                <button key={opt} className="quiz-btn" onClick={() => answer(opt)}>
                  {opt}
                </button>
              ))}
            </div>
            {msg.text && (
              <p className={`quiz-msg ${msg.type === "success" ? "msg-success" : "msg-error"}`}>
                {msg.text}
              </p>
            )}
          </div>
        </div>
      )}

      {/* WIN SCREEN */}
      {win && (
        <>
          <ConfettiRain />
          <div className="win-screen">
            <div className="win-image-wrap">
              <img className="win-image" src={IMAGE} alt="Puzzle complete" />
            </div>
            <h2 className="win-title">🎉 Bravo ! Puzzle complété !</h2>
            <p className="win-time-label">Vous avez terminé dans une durée de</p>
            <span className="win-time-value">{formatTime(time)}</span>
            <div className="win-stars">⭐⭐⭐</div>
            <button className="win-restart" onClick={() => window.location.reload()}>
              🔄 Rejouer
            </button>
          </div>
        </>
      )}
    </>
  );
}

function ConfettiRain() {
  const pieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    color: ["#f9d423", "#ff9a00", "#4ade80", "#60a5fa", "#f472b6", "#a78bfa"][i % 6],
    delay: `${Math.random() * 3}s`,
    duration: `${2.5 + Math.random() * 2}s`,
  }));
  return (
    <div className="confetti-wrap">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: p.left,
            top: "-10px",
            background: p.color,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}