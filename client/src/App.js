import { useState } from "react";
import Advice from "./pages/Advice";
import History from "./pages/History";
import Login from "./pages/Login";

function App() {
  const [loggedIn, setLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }
  return (
    <div>
      <Advice />
      <hr />
      <History />
    </div>
  );
}

export default App;
