import { useEffect, useState } from "react";
import { apiRequest } from "../api/api";

export default function History() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function loadHistory() {
      const res = await apiRequest("/advice/history");
      setItems(res.items);
    }
    loadHistory();
  }, []);

  return (
    <div>
      <h2>Advice History</h2>

      {items.map((item) => (
        <div key={item.id} style={{ marginBottom: 20 }}>
          <strong>Q:</strong> {item.user_input}
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {item.ai_output}
          </pre>
        </div>
      ))}
    </div>
  );
}
