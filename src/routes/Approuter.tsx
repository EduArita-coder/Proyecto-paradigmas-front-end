import { Route, Routes } from "react-router-dom"
import HomePage from "../pages/HomePage"
import CatalogoPage from "../pages/Carrito/CatalogoPage"
import CarritoPage from "../pages/Carrito/CarritoPage"
import HistorialPage from "../pages/Carrito/HistorialPage"
import Navbar from "../components/Layout/Navbar"

const Approuter = () => {
  return (
    <div className="min-h-screen bg-gray-100">
    <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalogo" element={<CatalogoPage />} />
        <Route path="/carrito" element={<CarritoPage />} />
        <Route path="/historial" element={<HistorialPage />} />
      </Routes>
      </div>
  )
}

export default Approuter