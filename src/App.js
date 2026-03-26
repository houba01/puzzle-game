import { useState, useEffect } from "react";

const IMAGE = "/puzzle.jpg";
const GRID = 3;
const SIZE = 90;

const QUESTIONS = {
  0: { 
    q: "في أي سنة تم اعتماد اتفاقية حقوق الطفل؟", 
    a: "1989", 
    o: ["1975", "1989", "1995", "2001"] 
  },

  1: { 
    q: "أي منظمة عالمية تُعنى أساسًا بحماية حقوق الطفل؟", 
    a: "UNICEF", 
    o: ["UNESCO", "UNICEF", "WHO", "IMF"] 
  },

  2: { 
    q: "كم عدد مواد اتفاقية حقوق الطفل تقريبًا؟", 
    a: "54", 
    o: ["30", "54", "70", "100"] 
  },

  3: { 
    q: "أي حق يُعتبر من الحقوق الأساسية للطفل؟", 
    a: "الحق في التعليم", 
    o: ["الحق في السفر", "الحق في التعليم", "الحق في الهاتف", "الحق في العمل"] 
  },

  4: { 
    q: "في أي يوم يُحتفل باليوم العالمي للطفل؟", 
    a: "20 نوفمبر", 
    o: ["1 جوان", "20 نوفمبر", "15 مارس", "5 أكتوبر"] 
  },

  5: { 
    q: "أي من هذه يُعتبر خرقًا لحقوق الطفل عالميًا؟", 
    a: "تشغيل الأطفال بشكل خطير", 
    o: ["التعليم الإجباري", "تشغيل الأطفال بشكل خطير", "اللعب", "الرعاية الصحية"] 
  },

  6: { 
    q: "اتفاقية حقوق الطفل تُطبّق على من؟", 
    a: "الأطفال أقل من 18 سنة", 
    o: ["كل إنسان", "الأطفال أقل من 18 سنة", "التلاميذ فقط", "الرضع فقط"] 
  },

  7: { 
    q: "ماذا تعني كلمة UNICEF؟", 
    a: "صندوق الأمم المتحدة للطفولة", 
    o: ["منظمة التعليم", "صندوق الأمم المتحدة للطفولة", "منظمة الصحة", "بنك دولي"] 
  },

  8: { 
    q: "حق اللعب مهم لأنه:", 
    a: "يساعد على النمو والتوازن النفسي", 
    o: ["مضيعة للوقت", "يساعد على النمو والتوازن النفسي", "غير ضروري", "للأطفال فقط في العطل"] 
  },
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

export default function App() {
  const [pieces, setPieces] = useState([]);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [selected, setSelected] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [targetCell, setTargetCell] = useState(null);
  const [msg, setMsg] = useState("");
  const [win, setWin] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const shuffled = [...Array(9).keys()].sort(() => Math.random() - 0.5);
    setPieces(shuffled);
  }, []);

  // timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (board.every((c, i) => c === i)) setWin(true);
  }, [board]);

  const handleCellClick = (i) => {
    if (selected === null || board[i] !== null) return;

    setQuiz(QUESTIONS[selected]);
    setTargetCell(i);
  };

  const answer = (opt) => {
    if (opt === QUESTIONS[selected].a) {
      setMsg("✅ صحيح!");

      setTimeout(() => {
        if (targetCell === selected) {
          const newBoard = [...board];
          newBoard[targetCell] = selected;
          setBoard(newBoard);
          setPieces(pieces.filter((p) => p !== selected));
        } else {
          setMsg("❌ البلاصة غالطة!");
        }

        setSelected(null);
        setQuiz(null);
      }, 500);
    } else {
      setMsg("❌ إجابة خاطئة!");
    }
  };

  const formatTime = () => {
    const min = Math.floor(time / 60);
    const sec = time % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg,#0f172a,#1e293b)",
      color: "white",
      textAlign: "center",
      padding: 10
    }}>
      <h1 style={{ color: "#facc15", fontSize: 22 }}>🧩 Ultra Puzzle Game</h1>

      {/* TIMER */}
      <p>⏱ {formatTime()}</p>

      {/* BOARD */}
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(3, ${SIZE}px)`,
        gap: 5,
        justifyContent: "center",
        margin: 10
      }}>
        {board.map((p, i) => (
          <div
            key={i}
            onClick={() => handleCellClick(i)}
            style={{
              width: SIZE,
              height: SIZE,
              border: "2px dashed gray",
              borderRadius: 10,
              ...(p !== null ? stylePiece(p, SIZE) : {})
            }}
          />
        ))}
      </div>

      {/* PIECES */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: 8
      }}>
        {pieces.map((p) => (
          <div
            key={p}
            onClick={() => setSelected(p)}
            style={{
              width: 70,
              height: 70,
              border: selected === p ? "3px solid yellow" : "2px solid #3b82f6",
              borderRadius: 10,
              cursor: "pointer",
              ...stylePiece(p, 70)
            }}
          />
        ))}
      </div>

      <p>{msg}</p>

      {/* QUIZ */}
      {quiz && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.7)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <div style={{
            background: "#1e293b",
            padding: 20,
            borderRadius: 15,
            width: "90%",
            maxWidth: 300
          }}>
            <p>{quiz.q}</p>
            {quiz.o.map((opt) => (
              <button key={opt}
                onClick={() => answer(opt)}
                style={{
                  display: "block",
                  width: "100%",
                  margin: 5,
                  padding: 10,
                  background: "#3b82f6",
                  border: "none",
                  borderRadius: 10,
                  color: "white"
                }}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* WIN */}
      {win && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "black",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          fontSize: 20
        }}>
          🎉
          <p>Rak finalisé ce jeu en ⏱ {formatTime()}</p>
        </div>
      )}
    </div>
  );
}