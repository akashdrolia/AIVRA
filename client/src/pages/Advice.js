import { useState } from "react";
import { apiRequest } from "../api/api";

export default function Advice() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function askAdvice() {
    setLoading(true);
    setAnswer("");

    try {
      const res = await apiRequest("/advice", "POST", {
        category: "career",
        question,
      });

      setAnswer(res.record.ai_output);
    } catch (err) {
      setAnswer(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Ask AIVRA</h2>

      <textarea
        rows={5}
        placeholder="Ask your question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <br />
      <button onClick={askAdvice} disabled={loading}>
        {loading ? "Thinking..." : "Ask"}
      </button>

      {answer && (
        <pre style={{ whiteSpace: "pre-wrap", marginTop: 20 }}>
          {answer}
        </pre>
      )}
    </div>
  );
}
