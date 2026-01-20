import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { addDoc, query, where } from "firebase/firestore";
import { db } from "./firebase";
import logo from "./assets/Logo.png";

export default function AdminPage() {
  const [appointments, setAppointments] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

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

  const generateSlots = () => {
    const morning = [9, 10, 11];
    const afternoon = [14, 15, 16, 17];
    return [...morning, ...afternoon].map((hour) => ({ hour }));
  };

  const handleDateClick = async (day) => {
    setSelectedDate(day);
    const dateKey = day.toISOString().split("T")[0];

    const q = query(
      collection(db, "appointments"),
      where("date", "==", dateKey),
    );
    const querySnapshot = await getDocs(q);

    const booked = querySnapshot.docs.map((doc) => doc.data());

    const allSlots = generateSlots();

    const available = allSlots.map((slot) => {
      const countBooked = booked.filter((b) => b.hour === slot.hour).length;
      const vagasRestantes = 2 - countBooked;
      return { ...slot, vagasRestantes };
    });

    setAvailableTimes(available);
  };
  useEffect(() => {
    const fetchAppointments = async () => {
      const querySnapshot = await getDocs(collection(db, "appointments"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAppointments(data);
    };
    fetchAppointments();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "appointments", id));
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({ user: "", pass: "" });

  useEffect(() => {
    if (isLoggedIn) {
      const fetchAppointments = async () => {
        const querySnapshot = await getDocs(collection(db, "appointments"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAppointments(data);
      };
      fetchAppointments();
    }
  }, [isLoggedIn]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (credentials.user === "clementes" && credentials.pass === "F4m1l14") {
      setIsLoggedIn(true);
    } else {
      alert("Usuário ou senha inválidos");
    }
  };
  const today1 = new Date().toISOString().split("T")[0];

  const filteredAppointments = appointments
    .filter((a) => a.date >= today1)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const todayStr = new Date().toISOString().split("T")[0];

  const todaysAppointments = appointments.filter((a) => a.date === todayStr);

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <form
          onSubmit={handleLogin}
          className="bg-white p-6 rounded-xl shadow-md w-80 flex flex-col gap-4"
        >
          <h2 className="text-xl font-bold text-center">Login Admin</h2>
          <input
            type="text"
            placeholder="Usuário"
            value={credentials.user}
            onChange={(e) =>
              setCredentials({ ...credentials, user: e.target.value })
            }
            className="border rounded-lg px-3 py-2"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={credentials.pass}
            onChange={(e) =>
              setCredentials({ ...credentials, pass: e.target.value })
            }
            className="border rounded-lg px-3 py-2"
            required
          />
          <button
            type="submit"
            className="bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600"
          >
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-6">
      <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md border-b border-gray-200">
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img
              src={logo}
              alt="Logo Divino Estilo"
              className="h-16 md:h-24 w-auto"
            />
          </div>

          {/* Botão hamburguer (mobile) */}
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

          {/* Menu desktop */}
          <div className="hidden md:flex justify-center space-x-12 font-serif font-semibold text-yellow-600">
            <a
              href="#agendamento"
              onClick={(e) => {
                e.preventDefault();
                setShowCalendar(!showCalendar);
              }}
              className="relative transition duration-300 hover:text-yellow-500 after:content-[''] after:block after:w-0 after:h-[2px] after:bg-yellow-500 after:transition-all after:duration-300 hover:after:w-full after:mx-auto"
            >
              Agendar
            </a>
          </div>
        </div>

        {/* Menu mobile */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen ? "max-h-screen" : "max-h-0"
          } bg-white shadow-lg`}
        >
          <div className="border-t border-yellow-600 w-4/5 mx-auto mt-2"></div>

          <div className="px-6 py-8 flex flex-col items-center space-y-8 font-serif font-bold text-yellow-600 tracking-wide">
            <a
              href="#agendamento"
              onClick={(e) => {
                e.preventDefault();
                setShowCalendar(true);
                setIsOpen(false); // fecha menu ao clicar
              }}
              className="relative text-lg transition duration-300 hover:text-yellow-500 after:content-[''] after:block after:w-0 after:h-[2px] after:bg-yellow-500 after:transition-all after:duration-300 hover:after:w-full after:mx-auto"
            >
              Fazer agendamento
            </a>
          </div>
        </div>
      </nav>
      <div className="px-[10%]">
        <h1
          className="text-2xl md:text-4xl font-serif font-bold text-gray-700 
               mb-10 mt-20 md:mt-[15vh] text-center 
               border-b-2 border-yellow-500 inline-block pb-2 "
        >
          Painel de Agenda
        </h1>
      </div>
      <div className="overflow-x-auto">
        <div className="px-[10%]">
          <table className="hidden md:table min-w-full bg-white rounded-lg overflow-hidden shadow-md">
            <thead>
              <tr className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-sm uppercase tracking-wide">
                <th className="px-6 py-3 text-left">Data</th>
                <th className="px-6 py-3 text-left">Horário</th>
                <th className="px-6 py-3 text-left">Nome</th>
                <th className="px-6 py-3 text-left">Telefone</th>
                <th className="px-6 py-3 text-left">Evento</th>
                <th className="px-6 py-3 text-left">Pessoas</th>
                <th className="px-6 py-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((a) => {
                const isToday = a.date === today;
                return (
                  <tr
                    key={a.id}
                    className={`transition ${
                      isToday
                        ? "bg-blue-50 border-l-4 border-blue-500 font-semibold"
                        : "odd:bg-gray-50 even:bg-white hover:bg-gray-100"
                    }`}
                  >
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {a.date}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {a.hour}:00
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {a.nome}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {a.telefone}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {a.evento}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {a.pessoas}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600 transition text-sm font-medium"
                      >
                        Cancelar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-6">
          <h2 className="text-lg font-bold text-gray-800 border-b border-yellow-500 pb-1">
            Agendas do Dia
          </h2>

          {todaysAppointments.length === 0 ? (
            <div className="text-center text-gray-500 italic">
              Sem agendamento hoje
            </div>
          ) : (
            todaysAppointments.map((a) => (
              <div
                key={a.id}
                className="p-5 rounded-xl bg-white border border-gray-200 shadow-md hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold text-gray-700">
                    {a.date}
                  </span>
                  <span className="text-sm font-semibold text-gray-700">
                    {a.hour}:00
                  </span>
                </div>

                <div className="mb-3">
                  <h3 className="text-lg font-bold text-gray-900">{a.nome}</h3>
                  <p className="text-sm text-gray-500">{a.telefone}</p>
                </div>

                <div className="flex justify-between text-sm bg-gray-50 rounded-lg p-3 mb-3">
                  <div>
                    <span className="block font-medium text-gray-700">
                      Evento
                    </span>
                    <span className="text-gray-600">{a.evento}</span>
                  </div>
                  <div>
                    <span className="block font-medium text-gray-700">
                      Pessoas
                    </span>
                    <span className="text-gray-600">{a.pessoas}</span>
                  </div>
                </div>

                <div className="text-right">
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition font-medium text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ))
          )}

          <h2 className="text-lg font-bold text-gray-800 border-b border-yellow-500 pb-1 mt-6">
            Agendas da Semana
          </h2>
          {filteredAppointments
            .filter((a) => {
              const todayDate = new Date(today);
              const appointmentDate = new Date(a.date);
              const diff =
                (appointmentDate - todayDate) / (1000 * 60 * 60 * 24);
              return diff > 0 && diff <= 7;
            })
            .map((a) => (
              <div
                key={a.id}
                className="p-5 rounded-xl bg-white border border-gray-200 shadow-md hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold text-gray-700">
                    {a.date}
                  </span>
                  <span className="text-sm font-semibold text-gray-700">
                    {a.hour}:00
                  </span>
                </div>

                <div className="mb-3">
                  <h3 className="text-lg font-bold text-gray-900">{a.nome}</h3>
                  <p className="text-sm text-gray-500">{a.telefone}</p>
                </div>

                <div className="flex justify-between text-sm bg-gray-50 rounded-lg p-3 mb-3">
                  <div>
                    <span className="block font-medium text-gray-700">
                      Evento
                    </span>
                    <span className="text-gray-600">{a.evento}</span>
                  </div>
                  <div>
                    <span className="block font-medium text-gray-700">
                      Pessoas
                    </span>
                    <span className="text-gray-600">{a.pessoas}</span>
                  </div>
                </div>

                <div className="text-right">
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition font-medium text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ))}
          <h2 className="text-lg font-bold text-gray-800 border-b border-yellow-500 pb-1 mt-6">
            Demais Agendamentos
          </h2>
          {filteredAppointments
            .filter((a) => {
              const todayDate = new Date(today);
              const appointmentDate = new Date(a.date);
              const diff =
                (appointmentDate - todayDate) / (1000 * 60 * 60 * 24);
              return diff > 7;
            })
            .map((a) => (
              <div
                key={a.id}
                className="p-5 rounded-xl bg-white border border-gray-200 shadow-md hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold text-gray-700">
                    {a.date}
                  </span>
                  <span className="text-sm font-semibold text-gray-700">
                    {a.hour}:00
                  </span>
                </div>
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-gray-900">{a.nome}</h3>
                  <p className="text-sm text-gray-500">{a.telefone}</p>
                </div>
                <div className="flex justify-between text-sm bg-gray-50 rounded-lg p-3 mb-3">
                  <div>
                    <span className="block font-medium text-gray-700">
                      Evento
                    </span>
                    <span className="text-gray-600">{a.evento}</span>
                  </div>
                  <div>
                    <span className="block font-medium text-gray-700">
                      Pessoas
                    </span>
                    <span className="text-gray-600">{a.pessoas}</span>
                  </div>
                </div>
                <div className="text-right">
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition font-medium text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

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
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition transform hover:scale-110"
            >
              ✕
            </button>

            {!selectedDate &&
              (() => {
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

                    <div className="grid grid-cols-5 gap-3">
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
                  </div>
                ));
              })()}

            {selectedDate && (
              <div className="mt-6 flex flex-col gap-4">
                {availableTimes.map(({ hour, vagasRestantes }) => {
                  const start = `${hour.toString().padStart(2, "0")}:00`;
                  const end = `${(hour + 1).toString().padStart(2, "0")}:00`;

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
                          {vagasRestantes > 0
                            ? `${vagasRestantes} vaga(s) disponível`
                            : "Ocupado"}
                        </span>
                      </div>

                      {vagasRestantes > 0 && (
                        <button
                          onClick={() => {
                            setSelectedSlot({ date: selectedDate, hour });
                            setShowFormModal(true);
                          }}
                          className="px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold hover:from-yellow-600 hover:to-yellow-700 transition"
                        >
                          Reservar
                        </button>
                      )}
                    </div>
                  );
                })}

                <button
                  onClick={() => setSelectedDate(null)}
                  className="mt-6 w-full px-6 py-4 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold transition"
                >
                  ← Voltar ao calendário
                </button>
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

            {showConfirmModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                <div className="relative bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-md text-center">
                  <h2 className="text-2xl font-bold text-yellow-500 mb-4">
                    Agendamento confirmado!
                  </h2>
                  <p className="text-gray-700 mb-6">
                    Seu agendamento foi registrado com sucesso.
                    <br />
                    Entraremos em contato pelo telefone informado.
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
    </div>
  );
}
