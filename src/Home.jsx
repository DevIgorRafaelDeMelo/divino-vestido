import { useState, useEffect } from "react";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";

import logo from "./assets/Logo.png";
import Img from "./assets/SaveGram.App_465951508_18255885751270777_7700571196460743910_n.jpg";
import Img01 from "./assets/SaveGram.App_473159548_18154312030341825_2753885223322677880_n.jpg";
import Img1 from "./assets/SaveGram.App_470139808_18260022607270777_87086414099876666_n.jpg";
import Img2 from "./assets/SaveGram.App_470192459_18260022445270777_2753421504139093913_n.jpg";
import Img3 from "./assets/SnapInsta.to_469855828_18259499311270777_6834103661568486313_n.jpg";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const images = [Img1, Img2, Img3];
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastReservation, setLastReservation] = useState(null);

  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);

  const [formData, setFormData] = useState({
    nome: "",
    pessoas: "",
    evento: "",
    telefone: "",
  });

  const today = new Date();
  const startDay = new Date(today);
  startDay.setDate(today.getDate());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1,
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  const [availableTimes, setAvailableTimes] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  function generateSlots(selectedDate) {
    const dayOfWeek = selectedDate.getDay();

    if (dayOfWeek === 0) {
      return [];
    }

    if (dayOfWeek === 6) {
      const slots = [];
      for (let hour = 9; hour < 12; hour++) {
        slots.push({ hour });
      }
      return slots;
    }

    const slots = [];
    for (let hour = 9; hour < 18; hour++) {
      if (hour >= 12 && hour < 14) continue;
      slots.push({ hour });
    }
    return slots;
  }

  const handleDateClick = async (day) => {
    setSelectedDate(day);
    const dateKey = day.toISOString().split("T")[0];

    const q = query(
      collection(db, "appointments"),
      where("date", "==", dateKey),
    );
    const querySnapshot = await getDocs(q);
    const booked = querySnapshot.docs.map((doc) => doc.data());

    const isDayBlocked = booked.some((b) => b.blocked === true && !b.hour);
    if (isDayBlocked) {
      setAvailableTimes([]);
      return;
    }

    const allSlots = generateSlots(day);
    const available = allSlots.map((slot) => {
      const blockedHour = booked.some(
        (b) => b.hour === slot.hour && b.blocked === true,
      );

      const countBooked = booked.filter(
        (b) => b.hour === slot.hour && !b.blocked,
      ).length;

      const vagasRestantes = blockedHour ? 0 : 2 - countBooked;

      return { ...slot, vagasRestantes, blocked: blockedHour };
    });

    setAvailableTimes(available);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/20 backdrop-blur-lg">
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
              className="relative transition duration-300 hover:text-yellow-500 
                   after:content-[''] after:block after:w-0 after:h-[2px] 
                   after:bg-yellow-500 after:transition-all after:duration-300 
                   hover:after:w-full after:mx-auto"
            >
              Catálogo
            </a>
            <a
              href="#agendamento"
              onClick={(e) => {
                e.preventDefault();
                setShowCalendar(!showCalendar);
              }}
              className="relative transition duration-300 hover:text-yellow-500 
                   after:content-[''] after:block after:w-0 after:h-[2px] 
                   after:bg-yellow-500 after:transition-all after:duration-300 
                   hover:after:w-full after:mx-auto"
            >
              Agendamento
            </a>
            <a
              href="https://wa.me/message/CBK3ADYAKSACP1"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="relative transition duration-300 hover:text-yellow-500 
                   after:content-[''] after:block after:w-0 after:h-[2px] 
                   after:bg-yellow-500 after:transition-all after:duration-300 
                   hover:after:w-full after:mx-auto"
            >
              Contato
            </a>
          </div>
        </div>

        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen ? "max-h-screen" : "max-h-0"
          }`}
        >
          <div className="border-t border-yellow-600 w-4/5 mx-auto mt-2"></div>

          <div className="px-6 py-8 flex flex-col items-center space-y-8 font-serif font-bold text-yellow-600 tracking-wide">
            <a
              href="#catalogo"
              onClick={() => setIsOpen(false)}
              className="relative text-lg transition duration-300 hover:text-yellow-500 
                   after:content-[''] after:block after:w-0 after:h-[2px] 
                   after:bg-yellow-500 after:transition-all after:duration-300 
                   hover:after:w-full after:mx-auto"
            >
              Catálogo
            </a>
            <a
              href="#agendamento"
              onClick={(e) => {
                e.preventDefault();
                setShowCalendar(true);
                setIsOpen(false);
              }}
              className="relative text-lg transition duration-300 hover:text-yellow-500 
                   after:content-[''] after:block after:w-0 after:h-[2px] 
                   after:bg-yellow-500 after:transition-all after:duration-300 
                   hover:after:w-full after:mx-auto"
            >
              Agendamento
            </a>
            <a
              href="https://wa.me/message/CBK3ADYAKSACP1"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="relative text-lg transition duration-300 hover:text-yellow-500 
                   after:content-[''] after:block after:w-0 after:h-[2px] 
                   after:bg-yellow-500 after:transition-all after:duration-300 
                   hover:after:w-full after:mx-auto"
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
            Roupas para momentos
            <br /> incríveis.
          </p>
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowCalendar(!showCalendar);
            }}
            className="px-8 py-3 bg-yellow-500 text-white rounded-full shadow-lg hover:bg-yellow-600 transition"
          >
            Agende sua Experiência
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
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowCalendar(true);
                setIsOpen(false);
              }}
              className="mt-3 px-4 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 shadow-md"
            >
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
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowCalendar(true);
                setIsOpen(false);
              }}
              className="mt-3 px-4 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 shadow-md"
            >
              Agendar
            </button>
          </div>
        </div>

        <div className="bg-white border border-yellow-200 shadow-md rounded-lg overflow-hidden">
          <img
            src={Img01}
            alt="Vestido de Gala"
            className="w-full h-80 object-cover"
          />
          <div className="p-4">
            <h3 className="text-xl font-semibold text-gray-800 font-serif">
              15 anos
            </h3>
            <p className="text-gray-600">Disponível para aluguel</p>
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowCalendar(true);
                setIsOpen(false);
              }}
              className="mt-3 px-4 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 shadow-md"
            >
              Agendar
            </button>
          </div>
        </div>
      </section>

      {showCalendar && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="relative bg-white p-4 rounded-2xl shadow-xl w-[90%] max-w-2xl">
            <h1 className="text-center text-3xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Agendamento
              <span className="block mt-2 h-1 w-20 bg-gradient-to-r from-yellow-500 to-yellow-600 mx-auto rounded-full"></span>
            </h1>

            <button
              onClick={() => {
                setShowCalendar(false);
                setSelectedDate(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition transform hover:scale-110 text-2xl"
            >
              ✕
            </button>

            {!selectedDate &&
              (() => {
                const today = new Date();
                const daysForward = Array.from({ length: 365 }, (_, i) => {
                  const d = new Date(today);
                  d.setDate(today.getDate() + i);
                  return d;
                });

                const daysWithoutSunday = daysForward.filter(
                  (d) => d.getDay() !== 0,
                );

                const grouped = daysWithoutSunday.reduce((acc, day) => {
                  const monthKey = day.toLocaleDateString("pt-BR", {
                    month: "long",
                    year: "numeric",
                  });
                  if (!acc[monthKey]) acc[monthKey] = [];
                  acc[monthKey].push(day);
                  return acc;
                }, {});

                const months = Object.values(grouped);

                const monthDays = months[currentMonthIndex];

                return (
                  <div>
                    <h2 className="text-center text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wide">
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
                            onClick={() => handleDateClick(day)}
                            className={`flex flex-col items-center justify-center px-2 py-2 rounded-xl transition transform hover:scale-105 shadow-md ${
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

                    <div className="flex justify-between mt-6">
                      <button
                        disabled={currentMonthIndex === 0}
                        onClick={() =>
                          setCurrentMonthIndex((prev) => Math.max(prev - 1, 0))
                        }
                        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold transition disabled:opacity-50"
                      >
                        ← Mês anterior
                      </button>
                      <button
                        disabled={currentMonthIndex === months.length - 1}
                        onClick={() =>
                          setCurrentMonthIndex((prev) =>
                            Math.min(prev + 1, months.length - 1),
                          )
                        }
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold hover:from-yellow-600 hover:to-yellow-700 transition disabled:opacity-50"
                      >
                        Próximo mês →
                      </button>
                    </div>
                  </div>
                );
              })()}

            {selectedDate && (
              <div className="mt-6 flex flex-col gap-4">
                {availableTimes.length === 0 ? (
                  <div className="flex items-center justify-center mt-6">
                    <div
                      className="bg-gradient-to-r from-gray-100 to-gray-200 border-l-4 border-yellow-500 
          rounded-xl shadow-md px-6 py-4 flex items-center gap-3 w-full max-w-lg"
                    >
                      <div className="flex flex-col">
                        <p className="text-gray-600 text-sm">
                          Não temos mais horarios possível neste dia.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  availableTimes.map(({ hour, vagasRestantes, blocked }) => {
                    const start = `${hour.toString().padStart(2, "0")}:00`;
                    const end = `${(hour + 1).toString().padStart(2, "0")}:00`;

                    const isOcupado = vagasRestantes <= 0 || blocked;

                    return (
                      <div
                        key={hour}
                        className="flex items-center justify-between px-5 py-2 rounded-xl shadow-md bg-white border border-yellow-400"
                      >
                        <div className="flex flex-col">
                          <span className="text-lg font-bold text-gray-800">
                            {start} → {end}
                          </span>
                          <span className="text-sm text-gray-500">
                            {isOcupado
                              ? "Ocupado"
                              : `${vagasRestantes} vaga(s) disponível`}
                          </span>
                        </div>

                        {!isOcupado && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedSlot({ date: selectedDate, hour });
                                setShowFormModal(true);
                              }}
                              className="px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold hover:from-yellow-600 hover:to-yellow-700 transition"
                            >
                              Reservar
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {showFormModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                <div className="relative bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-md">
                  <h2 className="text-center text-2xl font-bold mb-4">
                    Finalizar Reserva
                  </h2>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      await addDoc(collection(db, "appointments"), {
                        date: selectedSlot.date.toISOString().split("T")[0],
                        hour: selectedSlot.hour,
                        nome: formData.nome,
                        pessoas: formData.pessoas,
                        evento: formData.evento,
                        telefone: formData.telefone,
                        notify: true,
                      });

                      setLastReservation({
                        date: selectedSlot.date,
                        hour: selectedSlot.hour,
                        telefone: formData.telefone,
                        notify: true,
                      });

                      setShowFormModal(false);
                      setShowConfirmModal(true);

                      setFormData({
                        nome: "",
                        pessoas: "",
                        evento: "",
                        telefone: "",
                      });
                    }}
                    className="flex flex-col gap-4"
                  >
                    <input
                      type="text"
                      placeholder="Nome"
                      value={formData.nome}
                      onChange={(e) =>
                        setFormData({ ...formData, nome: e.target.value })
                      }
                      className="border rounded-lg px-3 py-2"
                      required
                    />

                    <input
                      type="number"
                      placeholder="Quantidade de pessoas"
                      value={formData.pessoas}
                      onChange={(e) =>
                        setFormData({ ...formData, pessoas: e.target.value })
                      }
                      className="border rounded-lg px-3 py-2"
                      required
                    />

                    <select
                      value={formData.evento}
                      onChange={(e) =>
                        setFormData({ ...formData, evento: e.target.value })
                      }
                      className="border rounded-lg px-3 py-2"
                      required
                    >
                      <option value="">Selecione o tipo de evento</option>
                      <option value="Casamento">Casamento</option>
                      <option value="Madrinhas/Padrinhos">
                        Madrinhas/Padrinhos
                      </option>
                      <option value="15 Anos">15 Anos</option>
                      <option value="Formatura">Formatura</option>
                      <option value="outros">Outros eventos</option>
                    </select>

                    <input
                      type="tel"
                      placeholder="Telefone"
                      value={formData.telefone}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, "");
                        if (value.length > 11) value = value.slice(0, 11);

                        let formatted = value;
                        if (value.length > 2) {
                          formatted = value.slice(0, 2) + " " + value.slice(2);
                        }
                        if (value.length > 7) {
                          formatted =
                            formatted.slice(0, 8) + "-" + formatted.slice(8);
                        }

                        setFormData({ ...formData, telefone: formatted });
                      }}
                      className="border rounded-lg px-3 py-2"
                      required
                      pattern="\d{2}\s\d{5}-\d{4}"
                      title="Digite um telefone válido no formato 51 99999-9999"
                    />

                    <button
                      type="submit"
                      className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold py-2 rounded-lg hover:from-yellow-600 hover:to-yellow-700"
                    >
                      Confirmar Reserva
                    </button>
                  </form>

                  <button
                    onClick={() => setShowFormModal(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {showConfirmModal && lastReservation && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                <div className="relative bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-md text-center">
                  <h2 className="text-2xl font-bold text-yellow-500 mb-4">
                    Agendamento confirmado!
                  </h2>

                  <p className="text-gray-700 mb-6">
                    Seu agendamento foi registrado com sucesso.
                    <br />
                    Data:{" "}
                    <span className="font-semibold text-gray-900">
                      {lastReservation.date.toLocaleDateString("pt-BR")}
                    </span>
                    <br /> Horário:{" "}
                    <span className="font-semibold text-gray-900">
                      {lastReservation.hour}:00
                    </span>
                    <br />
                    Telefone:{" "}
                    <span className="font-semibold text-gray-900">
                      {lastReservation.telefone}
                    </span>
                  </p>

                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold hover:from-yellow-600 hover:to-yellow-700 transition"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
