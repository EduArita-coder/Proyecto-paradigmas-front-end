import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CatalogoPage from "./pages/CatalogoPage";
import CarritoPage from "./pages/CarritoPage";
import HistorialPage from "./pages/HistorialPage";
import "./App.css";
import Navbar from "./components/Layout/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalogo" element={<CatalogoPage />} />
        <Route path="/carrito" element={<CarritoPage />} />
        <Route path="/historial" element={<HistorialPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;