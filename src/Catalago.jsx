import { useState } from "react";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import logo from "./assets/Logo.png";
import V1 from "./assets/Vestido1.jpeg";
import V2 from "./assets/vestido2.jpeg";
import V3 from "./assets/vestido3.jpeg";
import V4 from "./assets/vestido4.jpeg";
import V5 from "./assets/vestido5.jpeg";
import V6 from "./assets/vestido6.jpeg";
import V7 from "./assets/vestido7.jpeg";
import V8 from "./assets/vestido8.jpeg";
import V9 from "./assets/vestido9.jpeg";
import V10 from "./assets/vestido10.jpeg";
import V11 from "./assets/vestido11.jpeg";
import V12 from "./assets/vestido12.jpeg";
import V13 from "./assets/vestido13.jpeg";
import V14 from "./assets/vestido14.jpeg";
import V15 from "./assets/vestido15.jpeg";
import V16 from "./assets/vestido16.jpeg";
import V17 from "./assets/vestido17.jpeg";
import V18 from "./assets/vestido18.jpeg";
import V19 from "./assets/vestido19.jpeg";
import V20 from "./assets/vestido20.jpeg";
import V21 from "./assets/vestido21.jpeg";
import V22 from "./assets/vestido22.jpeg";
import V23 from "./assets/vestido23.jpeg";
import V24 from "./assets/vestido24.jpeg";
import V25 from "./assets/vestido25.jpeg";

export default function Catalogo() {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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
    <section
      id="catalogo"
      className="min-h-screen p-10  bg-gradient-to-b from-pink-50 via-white to-pink-100"
    >
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
      {/* Título da página */}
      <div className="text-center mb-12 mt-40">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 font-serif">
          Catálogo de Vestidos
        </h1>
        <div className="mt-2 w-24 h-1 bg-yellow-500 mx-auto rounded"></div>
        <p className="mt-4 text-lg text-gray-600">
          Modelos exclusivos para cada ocasião especial
        </p>
      </div>

      {/* Grid de vestidos */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:px-20">
        {/* Card 1 */}
        <div className="hidden md:block  bg-white border border-yellow-200 shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          <img
            src={V1}
            alt="Vestido de Gala"
            className="w-full  object-cover transition-transform duration-300"
          />
        </div>
        <div className="bg-white border border-yellow-200 shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          <img
            src={V2}
            alt="Vestido de Gala"
            className="w-full  object-cover transition-transform duration-300"
          />
        </div>
        {}
        <div className="bg-white border border-yellow-200 shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          <img
            src={V3}
            alt="Vestido de Gala"
            className="w-full  object-cover transition-transform duration-300"
          />
        </div>
        {}
        <div className="bg-white border border-yellow-200 shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          <img
            src={V4}
            alt="Vestido de Gala"
            className="w-full  object-cover transition-transform duration-300"
          />
        </div>{" "}
        <div className="bg-white border border-yellow-200 shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          <img
            src={V5}
            alt="Vestido de Gala"
            className="w-full  object-cover transition-transform duration-300"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:px-20 mt-20 vestido3Vestido4vestidovestido6">
        {/* Card 1 */}
        <div className="hidden md:block  bg-white border border-yellow-200 shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          <img
            src={V6}
            alt="Vestido de Gala"
            className="w-full  object-cover transition-transform duration-300 "
          />
        </div>
        <div className="bg-white border border-yellow-200 shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          <img
            src={V7}
            alt="Vestido de Gala"
            className="w-full  object-cover transition-transform duration-300"
          />
        </div>{" "}
        <div className="bg-white border border-yellow-200 shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          <img
            src={V8}
            alt="Vestido de Gala"
            className="w-full  object-cover transition-transform duration-300"
          />
        </div>{" "}
        <div className="bg-white border border-yellow-200 shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          <img
            src={V9}
            alt="Vestido de Gala"
            className="w-full  object-cover transition-transform duration-300"
          />
        </div>{" "}
        <div className="bg-white border border-yellow-200 shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          <img
            src={V10}
            alt="Vestido de Gala"
            className="w-full  object-cover transition-transform duration-300"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:px-20 mt-20">
        {/* Card 1 */}
        <div className="hidden md:block bg-white border border-yellow-200 shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          <img
            src={V11}
            alt="Vestido de Gala"
            className="w-full  object-cover transition-transform duration-300"
          />
        </div>
        <div className="bg-white border border-yellow-200 shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          <img
            src={V12}
            alt="Vestido de Gala"
            className="w-full  object-cover transition-transform duration-300"
          />
        </div>{" "}
        <div className="bg-white border border-yellow-200 shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          <img
            src={V13}
            alt="Vestido de Gala"
            className="w-full  object-cover transition-transform duration-300"
          />
        </div>{" "}
        <div className="bg-white border border-yellow-200 shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          <img
            src={V14}
            alt="Vestido de Gala"
            className="w-full  object-cover transition-transform duration-300"
          />
        </div>{" "}
        <div className="bg-white border border-yellow-200 shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          <img
            src={V15}
            alt="Vestido de Gala"
            className="w-full  object-cover transition-transform duration-300"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:px-20 mt-20">
        {/* Card 1 */}
        <div className="hidden md:block bg-white border border-yellow-200 shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          <img
            src={V16}
            alt="Vestido de Gala"
            className="w-full  object-cover transition-transform duration-300"
          />
        </div>
        <div className="bg-white border border-yellow-200 shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          <img
            src={V17}
            alt="Vestido de Gala"
            className="w-full  object-cover transition-transform duration-300"
          />
        </div>{" "}
        <div className="bg-white border border-yellow-200 shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          <img
            src={V18}
            alt="Vestido de Gala"
            className="w-full  object-cover transition-transform duration-300"
          />
        </div>{" "}
        <div className="bg-white border border-yellow-200 shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          <img
            src={V19}
            alt="Vestido de Gala"
            className="w-full  object-cover transition-transform duration-300"
          />
        </div>{" "}
        <div className="bg-white border border-yellow-200 shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          <img
            src={V20}
            alt="Vestido de Gala"
            className="w-full  object-cover transition-transform duration-300"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:px-20 mt-20">
        {/* Card 1 */}
        <div className="hidden md:block bg-white border border-yellow-200 shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          <img
            src={V21}
            alt="Vestido de Gala"
            className="w-full  object-cover transition-transform duration-300"
          />
        </div>
        <div className="bg-white border border-yellow-200 shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          <img
            src={V22}
            alt="Vestido de Gala"
            className="w-full  object-cover transition-transform duration-300"
          />
        </div>{" "}
        <div className="bg-white border border-yellow-200 shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          <img
            src={V23}
            alt="Vestido de Gala"
            className="w-full  object-cover transition-transform duration-300"
          />
        </div>{" "}
        <div className="bg-white border border-yellow-200 shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          <img
            src={V24}
            alt="Vestido de Gala"
            className="w-full  object-cover transition-transform duration-300"
          />
        </div>{" "}
        <div className="bg-white border border-yellow-200 shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          <img
            src={V25}
            alt="Vestido de Gala"
            className="w-full  object-cover transition-transform duration-300"
          />
        </div>
      </div>
      <section className="px-8 py-16 bg-gradient-to-r from-pink-50 via-white to-pink-100 my-20">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 font-serif">
            Catálogo Exclusivo
          </h2>
          <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
            Explore nossa coleção de vestidos pensada para diferentes ocasiões.
            Cada peça foi criada para transmitir{" "}
            <span className="font-semibold text-pink-600">elegância</span>,
            <span className="font-semibold text-pink-600">sofisticação</span> e
            realçar sua beleza única.
          </p>
          <p className="text-md text-gray-600 mb-8">
            Aqui você encontra opções para <strong>formaturas</strong>,{" "}
            <strong>casamentos</strong>,<strong>festas de 15 anos</strong> e
            muito mais. Todos os modelos estão disponíveis para aluguel com
            agendamento rápido e prático.
          </p>
          <a
            onClick={() => setShowCalendar(true)}
            className="inline-block px-8 py-3 bg-pink-600 text-white font-semibold rounded-full shadow-md hover:bg-pink-700 transition-transform hover:scale-105"
          >
            Agendar Prova
          </a>
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

                // Filtra apenas segunda (1) até sexta (5)
                const daysMondayToFriday = daysForward.filter(
                  (d) => d.getDay() >= 1 && d.getDay() <= 5,
                );

                const grouped = daysMondayToFriday.reduce((acc, day) => {
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
    </section>
  );
}
