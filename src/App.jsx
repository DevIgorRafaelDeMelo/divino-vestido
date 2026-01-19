import { useState, useEffect } from "react";
import logo from "./assets/Logo.png";
import Img from "./assets/SaveGram.App_465951508_18255885751270777_7700571196460743910_n.jpg";
import Img1 from "./assets/SaveGram.App_470139808_18260022607270777_87086414099876666_n.jpg";
import Img2 from "./assets/SaveGram.App_470192459_18260022445270777_2753421504139093913_n.jpg";
import Img3 from "./assets/SnapInsta.to_469855828_18259499311270777_6834103661568486313_n.jpg";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const images = [Img1, Img2, Img3];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);

  const today = new Date();
  const startDay = new Date(today);
  startDay.setDate(today.getDate());

  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(startDay);
    d.setDate(startDay.getDate() + i);
    return d;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1,
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md border-b border-gray-200">
        <div className="container mx-auto px-8 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="Logo Divino Estilo" className="h-24 w-auto" />
          </div>

          <button
            className="md:hidden text-yellow-600 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>

          <div className="hidden md:flex justify-center space-x-12 font-serif font-semibold text-yellow-600">
            <a
              href="#catalogo"
              className="relative transition duration-300 hover:text-yellow-500 after:content-[''] after:block after:w-0 after:h-[2px] after:bg-yellow-500 after:transition-all after:duration-300 hover:after:w-full after:mx-auto"
            >
              Catálogo
            </a>
            <a
              href="#agendamento"
              onClick={(e) => {
                e.preventDefault();
                setShowCalendar(!showCalendar);
              }}
              className="relative transition duration-300 hover:text-yellow-500 after:content-[''] after:block after:w-0 after:h-[2px] after:bg-yellow-500 after:transition-all after:duration-300 hover:after:w-full after:mx-auto"
            >
              Agendamento
            </a>
            <a
              href="#contato"
              className="relative transition duration-300 hover:text-yellow-500 after:content-[''] after:block after:w-0 after:h-[2px] after:bg-yellow-500 after:transition-all after:duration-300 hover:after:w-full after:mx-auto"
            >
              Contato
            </a>
          </div>
        </div>

        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out h-[100vh] ${
            isOpen ? "max-h-80" : "max-h-0"
          } bg-white shadow-lg`}
        >
          <div className="border-t border-yellow-600 w-4/5 mx-auto mt-2"></div>

          <div className="px-6 py-8 flex flex-col items-center space-y-8 font-serif font-bold text-yellow-600 tracking-wide">
            <a
              href="#catalogo"
              className="relative text-lg transition duration-300 hover:text-yellow-500 after:content-[''] after:block after:w-0 after:h-[2px] after:bg-yellow-500 after:transition-all after:duration-300 hover:after:w-full after:mx-auto"
            >
              Catálogo
            </a>
            <a
              href="#agendamento"
              onClick={(e) => {
                e.preventDefault();
                setShowCalendar(true);
              }}
              className="relative text-lg transition duration-300 hover:text-yellow-500 after:content-[''] after:block after:w-0 after:h-[2px] after:bg-yellow-500 after:transition-all after:duration-300 hover:after:w-full after:mx-auto"
            >
              Agendamento
            </a>
            <a
              href="https://wa.me/message/CBK3ADYAKSACP1"
              target="_blank"
              rel="noopener noreferrer"
              className="relative transition duration-300 hover:text-yellow-500 after:content-[''] after:block after:w-0 after:h-[2px] after:bg-yellow-500 after:transition-all after:duration-300 hover:after:w-full after:mx-auto"
            >
              Contato
            </a>
          </div>
        </div>
      </nav>

      <section className="relative flex flex-col items-center justify-center  text-center overflow-hidden h-[100vh]">
        <div
          key={currentIndex}
          className="absolute inset-0 bg-cover bg-center animate-zoomIn brightness-10"
          style={{ backgroundImage: `url(${images[currentIndex]})` }}
        ></div>

        <div className="absolute inset-0 bg-white/10"></div>

        <div className="relative z-10">
          <h2 className="text-5xl font-extrabold text-gray-800 mb-4 font-serif">
            Charme e Sofisticação
          </h2>
          <p className="text-lg text-white -600 mb-6">
            Roupas de grife para momentos
            <br /> inesquecíveis.
          </p>
          <button className="px-8 py-3 bg-yellow-500 text-white rounded-full shadow-lg hover:bg-yellow-600 transition">
            Ver Catálogo
          </button>
        </div>
      </section>

      <section
        id="catalogo"
        className="p-10 grid grid-cols-1 md:grid-cols-3 gap-8 bg-white"
      >
        <div className="bg-white border border-yellow-200 shadow-md rounded-lg overflow-hidden">
          <img
            src={Img}
            alt="Vestido de Gala"
            className="w-full h-80 object-cover"
          />
          <div className="p-4">
            <h3 className="text-xl font-semibold text-gray-800 font-serif">
              Formaturas
            </h3>
            <p className="text-gray-600">Disponível para aluguel</p>
            <button className="mt-3 px-4 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 shadow-md">
              Agendar
            </button>
          </div>
        </div>

        <div className="bg-white border border-yellow-200 shadow-md rounded-lg overflow-hidden">
          <img
            src={Img1}
            alt="Vestido de Gala"
            className="w-full h-80 object-cover"
          />
          <div className="p-4">
            <h3 className="text-xl font-semibold text-gray-800 font-serif">
              Vestidos de casamento
            </h3>
            <p className="text-gray-600">Disponível para aluguel</p>
            <button className="mt-3 px-4 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 shadow-md">
              Agendar
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-300 py-8 mt-10">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-6 md:mb-0">
            <img src={logo} alt="Logo Divino Estilo" className="h-24 w-auto" />
          </div>

          <div className="flex space-x-10 font-serif font-light text-gray-300">
            <a
              href="#catalogo"
              className="relative transition duration-300 hover:text-yellow-500 after:content-[''] after:block after:w-0 after:h-[1px] after:bg-yellow-500 after:transition-all after:duration-300 hover:after:w-full after:mx-auto"
            >
              Catálogo
            </a>
            <a
              href="#agendamento"
              className="relative transition duration-300 hover:text-yellow-500 after:content-[''] after:block after:w-0 after:h-[1px] after:bg-yellow-500 after:transition-all after:duration-300 hover:after:w-full after:mx-auto"
            >
              Agendamento
            </a>
            <a
              href="#contato"
              className="relative transition duration-300 hover:text-yellow-500 after:content-[''] after:block after:w-0 after:h-[1px] after:bg-yellow-500 after:transition-all after:duration-300 hover:after:w-full after:mx-auto"
            >
              Contato
            </a>
          </div>
        </div>

        <div className="text-center text-sm text-gray-400 mt-6 border-t border-gray-700 pt-4">
          © {new Date().getFullYear()} Divino Estilo. Todos os direitos
          reservados.
        </div>
      </footer>

      {showCalendar && (
        <div className="fixed inset-0  flex items-center justify-center bg-black/50 z-50">
          <div className="relative bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-2xl">
            <h1 className="text-center text-3xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Agendamento
              <span className="block mt-2 h-1 w-20 bg-gradient-to-r from-yellow-500 to-yellow-600 mx-auto rounded-full"></span>
            </h1>

            <button
              onClick={() => setShowCalendar(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition transform hover:scale-110"
            >
              ✕
            </button>

            {(() => {
              const today = new Date();
              const daysForward = Array.from({ length: 30 }, (_, i) => {
                const d = new Date(today);
                d.setDate(today.getDate() + i);
                return d;
              });

              const grouped = daysForward.reduce((acc, day) => {
                const monthKey = day.toLocaleDateString("pt-BR", {
                  month: "long",
                  year: "numeric",
                });
                if (!acc[monthKey]) acc[monthKey] = [];
                acc[monthKey].push(day);
                return acc;
              }, {});

              return Object.values(grouped).map((monthDays, idx) => (
                <div key={idx} className="mb-8">
                  <h2 className="text-center text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wide">
                    {monthDays[0].toLocaleDateString("pt-BR", {
                      month: "long",
                      year: "numeric",
                    })}
                  </h2>

                  <div className="border-b-2 border-yellow-500 mb-4 w-2/3 mx-auto"></div>

                  <div className="grid grid-cols-7 gap-3">
                    {monthDays.map((day, i) => {
                      const isToday =
                        day.toDateString() === today.toDateString();
                      return (
                        <button
                          key={i}
                          className={`flex flex-col items-center justify-center px-4 py-3 rounded-xl transition transform hover:scale-105 shadow-md ${
                            isToday
                              ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold ring-2 ring-yellow-400"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                        >
                          <span className="text-lg font-bold">
                            {day.getDate()}
                          </span>
                          <span className="text-xs uppercase tracking-wide text-gray-500">
                            {day.toLocaleDateString("pt-BR", {
                              weekday: "short",
                            })}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      )}
    </>
  );
}
