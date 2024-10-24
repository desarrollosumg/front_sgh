import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./routes/login";
import Paciente from "./routes/Paciente";
import Cita from "./routes/Cita";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/paciente" element={<Paciente/>}/>
        <Route path="/cita" element={<Cita/>}/>
      </Routes>
    </Router>
  );
}

export default App;
