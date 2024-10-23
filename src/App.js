import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./routes/login";
import Paciente from "./routes/Paciente";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/paciente" element={<Paciente/>}/>
      </Routes>
    </Router>
  );
}

export default App;
