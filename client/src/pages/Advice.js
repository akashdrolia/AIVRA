import { useState } from "react";
import { apiRequest } from "../api/api";

export default function Advice({ onNewAdvice }) {
  const [category, setCategory] = useState("career");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function ask() {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");

    try {
      const res = await apiRequest("/advice", "POST", { category, question });
      setAnswer(res.record.ai_output);
      setQuestion("");
      onNewAdvice?.();
    } catch (err) {
      setAnswer(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginTop: 10 }}>
      <h3>Ask AIVRA</h3>

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="career">career</option>
        <option value="interview">interview</option>
        <option value="diet">diet</option>
        <option value="mental">mental</option>
      </select>

      <br /><br />

      <textarea
        rows={5}
        style={{ width: "100%" }}
        placeholder="Ask your question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <br />
      <button onClick={ask} disabled={loading}>
        {loading ? "Thinking..." : "Ask"}
      </button>

      {answer && (
        <pre style={{ whiteSpace: "pre-wrap", marginTop: 15 }}>
          {answer}
        </pre>
      )}
    </div>
  );
}
