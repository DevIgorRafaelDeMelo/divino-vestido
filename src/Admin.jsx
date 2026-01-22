import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { addDoc, query, where } from "firebase/firestore";
import { db } from "./firebase";
import logo from "./assets/Logo.png";

export default function AdminPage() {
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);

  const [appointments, setAppointments] = useState([]);
  const [showBlockConfirmModal, setShowBlockConfirmModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [blockedDate, setBlockedDate] = useState(null);

  const [showHourBlockConfirmModal, setShowHourBlockConfirmModal] =
    useState(false);
  const [blockedHour, setBlockedHour] = useState(null);

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
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);

  const handleDateClick = async (day) => {
    setSelectedDate(day);
    const dateKey = day.toISOString().split("T")[0];

    const q = query(
      collection(db, "appointments"),
      where("date", "==", dateKey),
    );
    const querySnapshot = await getDocs(q);
    const booked = querySnapshot.docs.map((doc) => doc.data());

    // Bloqueio do dia inteiro (sem hour)
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

  const fetchAppointments = async () => {
    const querySnapshot = await getDocs(collection(db, "appointments"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setAppointments(data);
  };
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      const snapshot = await getDocs(collection(db, "appointments"));
      const data = snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((item) => item.notify === true);
      setNotifications(data);
    };
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    await updateDoc(doc(db, "appointments", id), { notify: false });
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  useEffect(() => {
    if (showDropdown && notifications.length === 0) {
      const timer = setTimeout(() => {
        setShowDropdown(false);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [showDropdown, notifications]);

  useEffect(() => {
    if (isLoggedIn) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
          <div className="flex items-center space-x-3">
            <img
              src={logo}
              alt="Logo Divino Estilo"
              className="h-16 md:h-24 w-auto"
            />
          </div>

          <div className="hidden md:flex justify-center space-x-12 font-serif font-semibold text-yellow-600">
            <a
              href="#agendamento"
              onClick={(e) => {
                e.preventDefault();
                setShowCalendar(!showCalendar);
              }}
              className="relative transition duration-300 hover:text-yellow-500 after:block after:w-0 after:h-[2px] after:bg-yellow-500 hover:after:w-full after:mx-auto"
            >
              Agendar
            </a>
          </div>

          <div className="flex justify-end items-center space-x-6 relative">
            <div className="relative pt-2">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative focus:outline-none"
              >
                <svg
                  className="w-6 h-6 text-gray-700 hover:text-yellow-600 transition"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 
              6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 
              6.165 6 8.388 6 11v3.159c0 .538-.214 
              1.055-.595 1.436L4 17h5m6 0v1a3 3 
              0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {notifications.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-2">
                    {notifications.length}
                  </span>
                )}
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-3 w-80 bg-white shadow-2xl rounded-xl border border-gray-200 z-50">
                  <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-t-xl border-b border-gray-200">
                    <span className="font-serif font-semibold text-gray-800">
                      Novos Agendamentos
                    </span>
                  </div>

                  <ul className="max-h-64 overflow-y-auto divide-y divide-gray-100 scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-gray-100">
                    {notifications.length === 0 ? (
                      <li className="p-6 text-center text-gray-500 text-sm italic">
                        Sem novas notificações
                      </li>
                    ) : (
                      notifications.map((n) => (
                        <li
                          key={n.id}
                          className="p-4 hover:bg-yellow-50 hover:shadow-md transition rounded-lg cursor-pointer"
                          onClick={() => markAsRead(n.id)}
                        >
                          <p className="text-sm font-serif text-gray-800 font-medium">
                            {n.nome} — {n.evento}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {n.date} às {n.hour}:00
                          </p>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              )}
            </div>

            <button
              className="md:hidden text-yellow-600 focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
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
          </div>
        </div>

        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            menuOpen ? "max-h-screen" : "max-h-0"
          } bg-white shadow-lg`}
        >
          <div className="border-t border-yellow-600 w-4/5 mx-auto mt-2"></div>

          <div className="px-6 py-8 flex flex-col items-center space-y-8 font-serif font-bold text-yellow-600 tracking-wide">
            <a
              href="#agendamento"
              onClick={(e) => {
                e.preventDefault();
                setShowCalendar(true);
                setMenuOpen(false);
              }}
              className="relative text-lg transition duration-300 hover:text-yellow-500 after:block after:w-0 after:h-[2px] after:bg-yellow-500 hover:after:w-full after:mx-auto"
            >
              Fazer agendamento
            </a>
          </div>
        </div>
      </nav>
      <div className="">
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
                const isBlocked = a.blocked === true;

                const isDayBlocked = isBlocked && !a.hour;
                const isHourBlocked = isBlocked && a.hour;

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
                      {isDayBlocked
                        ? "Dia bloqueado"
                        : isHourBlocked
                          ? `${a.hour}:00`
                          : `${a.hour}:00`}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {isBlocked ? "Administração" : a.nome}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {isBlocked ? "—" : a.telefone}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {isDayBlocked
                        ? "Feriado/Inativo"
                        : isHourBlocked
                          ? "Horário indisponível"
                          : a.evento}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {isBlocked ? "—" : a.pessoas}
                    </td>

                    <td className="px-6 py-4 text-center">
                      {isBlocked ? (
                        <button
                          onClick={() => handleDelete(a.id)}
                          className="bg-yellow-600 text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-700 transition font-medium text-sm"
                        >
                          Liberar agenda
                        </button>
                      ) : (
                        <div className="text-right">
                          <button
                            onClick={() => {
                              setAppointmentToCancel(a.id);
                              setShowCancelConfirmModal(true);
                            }}
                            className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-2 rounded-lg shadow hover:from-yellow-600 hover:to-yellow-700 transition font-medium text-sm"
                          >
                            Cancelar
                          </button>
                        </div>
                      )}
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
            todaysAppointments.map((a) => {
              const isBlocked = a.blocked === true;

              return (
                <div
                  key={a.id}
                  className={`p-4 rounded-xl border shadow-md transition ${
                    isBlocked
                      ? "bg-gradient-to-r from-gray-100 to-gray-200 border-yellow-400"
                      : "bg-white border-gray-200 hover:shadow-lg"
                  }`}
                >
                  {isBlocked ? (
                    <>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-gray-700">
                          {a.date}
                        </span>
                        <span className="text-xs font-semibold text-yellow-600">
                          🚫 Bloqueado
                        </span>
                      </div>

                      <div className="mb-2 text-center">
                        <h3 className="text-base font-bold text-gray-800">
                          {a.hour
                            ? `Horário bloqueado: ${a.hour}:00`
                            : "Agenda bloqueada"}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {a.hour
                            ? "Não é possível realizar agendamentos neste horário"
                            : "Não é possível realizar agendamentos neste dia"}
                        </p>
                      </div>

                      <div className="flex justify-between text-xs bg-gray-50 rounded-lg p-2">
                        <div>
                          <span className="block font-medium text-gray-700">
                            Evento
                          </span>
                          <span className="text-gray-600">
                            {a.hour
                              ? "Horário indisponível"
                              : "Feriado/Inativo"}
                          </span>
                        </div>
                        <div className="text-right">
                          <button
                            onClick={() => handleDelete(a.id)}
                            className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-2 rounded-lg shadow hover:from-yellow-600 hover:to-yellow-700 transition font-medium text-sm"
                          >
                            Liberar agenda
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-gray-700">
                          {a.date}
                        </span>
                        <span className="text-xs font-semibold text-gray-700">
                          {`${a.hour}:00`}
                        </span>
                      </div>

                      <div className="mb-2">
                        <h3 className="text-base font-bold text-gray-900">
                          {a.nome}
                        </h3>
                        <p className="text-xs text-gray-500">{a.telefone}</p>
                      </div>

                      <div className="flex justify-between text-xs bg-gray-50 rounded-lg p-2 mb-2">
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
                          onClick={() => {
                            setAppointmentToCancel(a.id); // guarda o id do agendamento
                            setShowCancelConfirmModal(true); // abre o modal
                          }}
                          className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-2 rounded-lg shadow hover:from-yellow-600 hover:to-yellow-700 transition font-medium text-sm"
                        >
                          Cancelar
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })
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
            .map((a) => {
              const isBlocked = a.blocked === true;

              return (
                <div
                  key={a.id}
                  className={`p-4 rounded-xl border shadow-md transition ${
                    isBlocked
                      ? "bg-gradient-to-r from-gray-100 to-gray-200 border-yellow-400"
                      : "bg-white border-gray-200 hover:shadow-lg"
                  }`}
                >
                  {isBlocked ? (
                    <>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-gray-700">
                          {a.date}
                        </span>
                        <span className="text-xs font-semibold text-yellow-600">
                          🚫 Bloqueado
                        </span>
                      </div>

                      <div className="mb-2 text-center">
                        <h3 className="text-base font-bold text-gray-800">
                          Agenda bloqueada
                        </h3>
                        <p className="text-xs text-gray-600">
                          Não é possível realizar agendamentos neste dia
                        </p>
                      </div>

                      <div className="flex justify-between text-xs bg-gray-50 rounded-lg p-2">
                        <div>
                          <span className="block font-medium text-gray-700">
                            Evento
                          </span>
                          <span className="text-gray-600">Feriado/Inativo</span>
                        </div>
                        <div className="text-right">
                          <button
                            onClick={() => handleDelete(a.id)}
                            className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-2 rounded-lg shadow hover:from-yellow-600 hover:to-yellow-700 transition font-medium text-sm"
                          >
                            Liberar agenda
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-gray-700">
                          {a.date}
                        </span>
                        <span className="text-xs font-semibold text-gray-700">
                          {`${a.hour}:00`}
                        </span>
                      </div>

                      <div className="mb-2">
                        <h3 className="text-base font-bold text-gray-900">
                          {a.nome}
                        </h3>
                        <p className="text-xs text-gray-500">{a.telefone}</p>
                      </div>

                      <div className="flex justify-between text-xs bg-gray-50 rounded-lg p-2 mb-2">
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

                      {isBlocked ? (
                        <div className="text-center text-yellow-600 font-semibold text-sm">
                          🚫 Não é possível agendar neste dia
                        </div>
                      ) : (
                        <div className="text-right">
                          <div className="text-right">
                            <button
                              onClick={() => {
                                setAppointmentToCancel(a.id);
                                setShowCancelConfirmModal(true);
                              }}
                              className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-2 rounded-lg shadow hover:from-yellow-600 hover:to-yellow-700 transition font-medium text-sm"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}

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
            .map((a) => {
              const isBlocked = a.blocked === true;

              return (
                <div
                  key={a.id}
                  className={`p-4 rounded-xl border shadow-md transition ${
                    isBlocked
                      ? "bg-gradient-to-r from-gray-100 to-gray-200 border-yellow-400"
                      : "bg-white border-gray-200 hover:shadow-lg"
                  }`}
                >
                  {isBlocked ? (
                    <>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-gray-700">
                          {a.date}
                        </span>
                        <span className="text-xs font-semibold text-yellow-600">
                          🚫 Bloqueado
                        </span>
                      </div>

                      <div className="mb-2 text-center">
                        <h3 className="text-base font-bold text-gray-800">
                          Agenda bloqueada
                        </h3>
                        <p className="text-xs text-gray-600">
                          Não é possível realizar agendamentos neste dia
                        </p>
                      </div>

                      <div className="flex justify-between text-xs bg-gray-50 rounded-lg p-2">
                        <div>
                          <span className="block font-medium text-gray-700">
                            Evento
                          </span>
                          <span className="text-gray-600">Feriado/Inativo</span>
                        </div>
                        <div className="text-right">
                          <button
                            onClick={() => handleDelete(a.id)}
                            className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-2 rounded-lg shadow hover:from-yellow-600 hover:to-yellow-700 transition font-medium text-sm"
                          >
                            Liberar agenda
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-gray-700">
                          {a.date}
                        </span>
                        <span className="text-xs font-semibold text-gray-700">
                          {`${a.hour}:00`}
                        </span>
                      </div>

                      <div className="mb-2">
                        <h3 className="text-base font-bold text-gray-900">
                          {a.nome}
                        </h3>
                        <p className="text-xs text-gray-500">{a.telefone}</p>
                      </div>

                      <div className="flex justify-between text-xs bg-gray-50 rounded-lg p-2 mb-2">
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

                      {isBlocked ? (
                        <div className="text-center text-yellow-600 font-semibold text-sm">
                          🚫 Não é possível agendar neste dia
                        </div>
                      ) : (
                        <div className="text-right">
                          <button
                            onClick={() => {
                              setAppointmentToCancel(a.id);
                              setShowCancelConfirmModal(true);
                            }}
                            className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-2 rounded-lg shadow hover:from-yellow-600 hover:to-yellow-700 transition font-medium text-sm"
                          >
                            Cancelar
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
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
                const daysForward = Array.from({ length: 365 }, (_, i) => {
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
                      <span className="text-yellow-600 text-2xl">⚠️</span>
                      <div className="flex flex-col">
                        <h3 className="text-gray-800 font-bold text-lg">
                          Agenda bloqueada
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Não é mais possível realizar agendamentos neste dia.
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

                <div className="mt-6 flex gap-4">
                  <button
                    onClick={async () => {
                      const dateKey = selectedDate.toISOString().split("T")[0];
                      await addDoc(collection(db, "appointments"), {
                        date: dateKey,
                        blocked: true,
                      });
                      setSelectedDate(null);
                      setShowBlockConfirmModal(true);
                    }}
                    className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-gray-400 to-gray-500 
        text-white font-semibold shadow-md hover:from-gray-500 hover:to-gray-600 
        transition-transform transform hover:scale-105"
                  >
                    Bloquear agenda do dia
                  </button>

                  <button
                    onClick={() => setSelectedDate(null)}
                    className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-gray-200 to-gray-300 
        text-gray-700 font-semibold shadow-md hover:from-gray-300 hover:to-gray-400 
        transition-transform transform"
                  >
                    ← Voltar ao calendário
                  </button>
                </div>
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
                    <button
                      type="button"
                      onClick={async () => {
                        const dateKey = selectedSlot.date
                          .toISOString()
                          .split("T")[0];
                        await addDoc(collection(db, "appointments"), {
                          date: dateKey,
                          hour: selectedSlot.hour,
                          blocked: true,
                        });
                        setBlockedDate(dateKey);
                        setBlockedHour(selectedSlot.hour);
                        setShowFormModal(false);
                        setShowHourBlockConfirmModal(true);
                      }}
                      className="bg-gradient-to-r from-gray-400 to-gray-500 text-white font-semibold py-2 rounded-lg hover:from-gray-500 hover:to-gray-600"
                    >
                      Bloquear este horário
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
                    onClick={() => {
                      setShowConfirmModal(false);
                      fetchAppointments();
                      setShowCalendar(false);
                      setSelectedDate(null);
                    }}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold hover:from-yellow-600 hover:to-yellow-700 transition"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            )}

            {showBlockConfirmModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                <div className="relative bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-md text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Agenda bloqueada!
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Todos os horários deste dia foram bloqueados e não estão
                    mais disponíveis para agendamento.
                  </p>

                  <button
                    onClick={() => {
                      setShowBlockConfirmModal(false);
                      fetchAppointments();
                      setShowCalendar(false);
                      setSelectedDate(null);
                    }}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 
                   text-white font-semibold hover:from-yellow-600 hover:to-yellow-700 transition"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            )}

            {showHourBlockConfirmModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                <div className="relative bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-md text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Horário bloqueado!
                  </h2>

                  <p className="text-gray-600 mb-6">
                    O horário{" "}
                    <span className="font-semibold text-gray-900">
                      {blockedHour}:00
                    </span>{" "}
                    do dia{" "}
                    <span className="font-semibold text-gray-900">
                      {blockedDate}
                    </span>{" "}
                    foi bloqueado e não está mais disponível para agendamento.
                  </p>

                  <button
                    onClick={() => {
                      setShowHourBlockConfirmModal(false);
                      fetchAppointments();
                      setShowCalendar(false);
                      setSelectedDate(null);
                    }}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 
          text-white font-semibold hover:from-yellow-600 hover:to-yellow-700 transition"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showCancelConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="relative bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-md text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Confirmar cancelamento
            </h2>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja cancelar este agendamento?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  handleDelete(appointmentToCancel);
                  setShowCancelConfirmModal(false);
                }}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold hover:from-red-600 hover:to-red-700 transition"
              >
                Confirmar
              </button>

              <button
                onClick={() => setShowCancelConfirmModal(false)}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 font-semibold hover:from-gray-400 hover:to-gray-500 transition"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
