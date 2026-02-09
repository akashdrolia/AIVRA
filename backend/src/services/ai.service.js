async function getAdvice({ category, question, userProfile }) {
  const systemPrompt = `
You are AIVRA, a helpful assistant.
Give practical, actionable advice.
Be concise, structured, and supportive.
If user asks medical/legal advice, suggest consulting a professional.
`.trim();

  const userPrompt = `
Category: ${category}
User Profile: ${userProfile ?? "N/A"}
Question: ${question}

Respond in:
1) Summary (1-2 lines)
2) Action steps (bullets)
3) Common mistakes to avoid (bullets)
`.trim();

  const model = process.env.OLLAMA_MODEL || "llama3.2:3b";

  const resp = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      stream: false,
      options: {
        temperature: 0.4,
        num_predict: 350,
      },
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    console.error("Ollama returned non-ok:", resp.status, errText);
    throw new Error(`Ollama error ${resp.status}: ${errText}`);
  }

  const data = await resp.json();
  return data.message?.content ?? "";
}

module.exports = { getAdvice };
