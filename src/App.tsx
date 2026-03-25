import HomePage from "./pages";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ContactSection from "./pages/ContactSection";
import SoilHealthReport from "./ui/SoilReport";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contact" element={<ContactSection />} />
          {/* <Route path="/soil-health-report" element={<SoilHealthReport />} /> */}
          <Route
            path="/soil-health-report/:farmerCode"
            element={<SoilHealthReport />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
