import { useState } from "react";
import AdminPage from "./Admin";
import HomePage from "./Home";
import logo from "./assets/Logo.png";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");

  return (
    <div>
      {currentPage === "home" && <HomePage />}
      {currentPage === "admin" && <AdminPage />}

      <footer className="bg-gray-900 text-gray-300 py-10 ">
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
              onClick={() => setCurrentPage("home")}
              className="relative transition duration-300 hover:text-yellow-500 
                   after:content-[''] after:block after:w-0 after:h-[2px] 
                   after:bg-yellow-500 after:transition-all after:duration-300 
                   hover:after:w-full after:mx-auto"
            >
              Home
            </button>
            <button
              onClick={() => setCurrentPage("admin")}
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
