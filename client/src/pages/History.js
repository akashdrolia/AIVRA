import { useEffect, useState } from "react";
import { apiRequest } from "../api/api";

export default function History({ refreshFlag }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  async function load() {
    setError("");
    try {
      const res = await apiRequest("/advice/history");
      setItems(res.items || []);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [refreshFlag]);

  return (
    <div style={{ marginTop: 20 }}>
      <h3>History</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {items.length === 0 ? (
        <p>No history yet.</p>
      ) : (
        items.map((x) => (
          <div key={x.id} style={{ marginBottom: 18 }}>
            <div><b>Category:</b> {x.category}</div>
            <div><b>Q:</b> {x.user_input}</div>
            <pre style={{ whiteSpace: "pre-wrap" }}>{x.ai_output}</pre>
          </div>
        ))
      )}
    </div>
  );
}
