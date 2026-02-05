import { useState } from "react";
import AdminPage from "./Admin";
import HomePage from "./Home";
import logo from "./assets/Logo.png";
import Catalago from "./Catalago";
import CatalogoImg from "./assets/catalogo.jpeg";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {currentPage === "home" && <HomePage />}
        {currentPage === "admin" && <AdminPage />}
        {currentPage === "catalogo" && <Catalago />}
      </main>

      {currentPage !== "catalogo" && currentPage !== "admin" && (
        <section className="relative flex flex-col md:flex-row items-center justify-between px-8 py-16 bg-gradient-to-r from-pink-50 via-white to-pink-100  ">
          {/* Texto */}
          <div className="w-full md:w-1/2 text-center md:text-left mb-10 md:mb-0">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 font-serif">
              Descubra o Catálogo Exclusivo
            </h2>
            <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
              Cada peça da{" "}
              <span className="font-semibold text-pink-600">
                Divino Vestido
              </span>{" "}
              é criada para transmitir elegância e sofisticação. Explore nossa
              coleção e encontre o look perfeito para cada ocasião.
            </p>
            <button
              onClick={() => {
                setCurrentPage("catalogo");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className=" inline-block px-8 py-3 bg-pink-600 text-white font-semibold rounded-full shadow-md hover:bg-pink-700 transition-transform hover:scale-105 "
            >
              Ver Catálogo
            </button>
          </div>

          {/* Imagem */}
          <div className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0">
            <div className="rounded-xl overflow-hidden shadow-lg w-full">
              <img
                src={CatalogoImg}
                alt="Coleção Divina Vestida"
                className="w-full h-64 md:h-[80vh] object-cover"
              />
            </div>
          </div>
        </section>
      )}

      <footer className="w-full bg-gray-900 text-gray-300 py-10">
        <div className="container mx-auto px-6 flex flex-col items-center text-center">
          <div className="flex items-center justify-center mb-6">
            <img
              src={logo}
              alt="Logo Divino Estilo"
              className="h-20 md:h-24 w-auto drop-shadow-lg"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-10 font-serif font-medium text-gray-300 mb-6">
            <a
              href="https://wa.me/message/CBK3ADYAKSACP1"
              target="_blank"
              rel="noopener noreferrer"
              className="relative transition duration-300 hover:text-yellow-500 
                   after:content-[''] after:block after:w-0 after:h-[2px] 
                   after:bg-yellow-500 after:transition-all after:duration-300 
                   hover:after:w-full after:mx-auto"
            >
              Contato
            </a>
            <button
              onClick={() => {
                setCurrentPage("home");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="relative transition duration-300 hover:text-yellow-500 
             after:content-[''] after:block after:w-0 after:h-[2px] 
             after:bg-yellow-500 after:transition-all after:duration-300 
             hover:after:w-full after:mx-auto"
            >
              Home
            </button>

            <button
              onClick={() => {
                setCurrentPage("catalogo");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="relative transition duration-300 hover:text-yellow-500 
             after:content-[''] after:block after:w-0 after:h-[2px] 
             after:bg-yellow-500 after:transition-all after:duration-300 
             hover:after:w-full after:mx-auto"
            >
              Catálogo
            </button>

            <button
              onClick={() => {
                setCurrentPage("admin");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="relative transition duration-300 hover:text-yellow-500 
             after:content-[''] after:block after:w-0 after:h-[2px] 
             after:bg-yellow-500 after:transition-all after:duration-300 
             hover:after:w-full after:mx-auto"
            >
              Admin
            </button>
          </div>

          <div className="text-center text-sm text-gray-400 mt-6 border-t border-gray-700 pt-4">
            © {new Date().getFullYear()}{" "}
            <span className="text-yellow-500 font-semibold">
              Divino Vestido
            </span>
            . Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
