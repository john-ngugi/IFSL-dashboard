import HomePage from "./pages";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ContactSection from "./pages/ContactSection";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contact" element={<ContactSection />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
