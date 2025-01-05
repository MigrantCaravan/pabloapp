import { useState } from "react";
import "./App.css";

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

function App() {
  const [message, setMessage] = useState("");
  const [sentiment, setSentiment] = useState("");
  const [loading, setLoading] = useState(false);

  const callOpenAiAPI = async () => {
    setLoading(true);
    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + API_KEY,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        store: true,
        messages: [
          {
            role: "system",
            content:
              "Se te proporcionará un mensaje de Pablo. Tu tarea es aconsejar a Pablo si el mensaje es moralmente correcto. Puedes responder (en español paisa de Colombia) con una de las siguientes opciones: 'Deberías hacerlo, Pablo,' 'No deberías hacerlo, Pablo,' o 'No creo tener una respuesta para ti, Pablo.'",
          },
          {
            role: "user",
            content:
              "¿Cuál es el consejo para este mensaje de Pablo: " + message,
          },
        ],
        temperature: 1,
        max_tokens: 256,
        top_p: 1,
      }),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        setSentiment(data.choices[0].message.content);
        setMessage("");
        setLoading(false);
      });
  };

  return (
    <div className="App">
      <h1>¿Debés hacerlo Pablo?</h1>
      <div className="message">
        <textarea
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribí acá tu pregunta..."
          cols={50}
          rows={10}
          value={message}
        />
      </div>
      <div>
        <button
          disabled={!message.trim()}
          className="multicolor-border"
          onClick={callOpenAiAPI}
        >
          Obtené la respuesta con OpenAi
        </button>
        {loading && <h3>Cargando la respuesta...</h3>}
        {sentiment && <h3>{sentiment}</h3>}
      </div>
    </div>
  );
}

export default App;
