import { useState } from "react";
import Icon from "@/components/ui/icon";

const SEND_CONTACT_URL = "https://functions.poehali.dev/1fcaed2f-f046-4be3-907a-62b53a0d37a3";

const APARTMENTS = [
  {
    id: 1,
    title: "Лофт с панорамным видом",
    location: "Москва, Пресненский",
    price: 4500,
    rating: 4.9,
    reviews: 128,
    img: "https://cdn.poehali.dev/projects/a84808b4-c1f8-4084-9218-1f5883bce5a3/files/1ccd332d-92da-4e76-b9d8-1da765295c60.jpg",
    tags: ["Wi-Fi", "Парковка", "Балкон"],
    badge: "ХИТ",
    badgeColor: "from-pink-500 to-purple-600",
  },
  {
    id: 2,
    title: "Студия в центре",
    location: "Санкт-Петербург, Невский",
    price: 3200,
    rating: 4.8,
    reviews: 94,
    img: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=600&q=80",
    tags: ["Кухня", "Кондиционер", "Метро 5 мин"],
    badge: "НОВОЕ",
    badgeColor: "from-cyan-500 to-blue-600",
  },
  {
    id: 3,
    title: "2-комн. квартира у парка",
    location: "Казань, Вахитовский",
    price: 2800,
    rating: 4.7,
    reviews: 61,
    img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
    tags: ["2 спальни", "Парковка", "Тихий двор"],
    badge: null,
    badgeColor: "",
  },
  {
    id: 4,
    title: "Апартаменты Sky Tower",
    location: "Москва, Москва-Сити",
    price: 7800,
    rating: 5.0,
    reviews: 47,
    img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80",
    tags: ["Консьерж", "Spa", "40 этаж"],
    badge: "ЛЮКС",
    badgeColor: "from-yellow-400 to-orange-500",
  },
  {
    id: 5,
    title: "Уютная однушка",
    location: "Сочи, Центральный",
    price: 3600,
    rating: 4.6,
    reviews: 83,
    img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
    tags: ["Море 10 мин", "Wi-Fi", "Балкон"],
    badge: null,
    badgeColor: "",
  },
  {
    id: 6,
    title: "Арт-квартира в центре",
    location: "Екатеринбург, Центр",
    price: 1900,
    rating: 4.5,
    reviews: 112,
    img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80",
    tags: ["Дизайн", "Центр", "Кофе"],
    badge: "БЮДЖЕТ",
    badgeColor: "from-green-400 to-emerald-600",
  },
];

const CITIES = ["Москва", "Санкт-Петербург", "Казань", "Сочи", "Екатеринбург"];

export default function Index() {
  const [activeSection, setActiveSection] = useState<"home" | "contacts">("home");
  const [searchCity, setSearchCity] = useState("");
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(10000);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [filteredCards, setFilteredCards] = useState(APARTMENTS);
  const [searchDone, setSearchDone] = useState(false);

  const [formName, setFormName] = useState("");
  const [formContact, setFormContact] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleFormSubmit = async () => {
    if (!formName.trim() || !formContact.trim() || !formMessage.trim()) return;
    setFormStatus("loading");
    try {
      const res = await fetch(SEND_CONTACT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formName, contact: formContact, message: formMessage }),
      });
      if (res.ok) {
        setFormStatus("success");
        setFormName("");
        setFormContact("");
        setFormMessage("");
      } else {
        setFormStatus("error");
      }
    } catch {
      setFormStatus("error");
    }
  };

  const amenityOptions = ["Wi-Fi", "Парковка", "Балкон", "Кухня", "Кондиционер"];

  const toggleAmenity = (a: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  };

  const handleSearch = () => {
    let result = APARTMENTS;
    if (searchCity.trim()) {
      result = result.filter((a) =>
        a.location.toLowerCase().includes(searchCity.toLowerCase())
      );
    }
    result = result.filter((a) => a.price >= priceMin && a.price <= priceMax);
    if (selectedAmenities.length > 0) {
      result = result.filter((a) =>
        selectedAmenities.every((am) =>
          a.tags.some((t) => t.toLowerCase().includes(am.toLowerCase()))
        )
      );
    }
    setFilteredCards(result);
    setSearchDone(true);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] font-golos text-white overflow-x-hidden">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 glass-card border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg btn-gradient flex items-center justify-center">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <span className="font-golos font-bold text-lg tracking-tight">
            <span className="text-gradient-main">НОЧЕВКА</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-full p-1">
          {(["home", "contacts"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setActiveSection(s)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeSection === s
                  ? "bg-gradient-to-r from-[#FF2D78] to-[#7B2FFF] text-white shadow-lg"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {s === "home" ? "Главная" : "Контакты"}
            </button>
          ))}
        </div>
        <div className="flex md:hidden gap-3">
          <button onClick={() => setActiveSection("home")} className={`text-xs px-3 py-1.5 rounded-full ${activeSection==="home"?"btn-gradient text-white":"text-white/50 border border-white/10"}`}>Главная</button>
          <button onClick={() => setActiveSection("contacts")} className={`text-xs px-3 py-1.5 rounded-full ${activeSection==="contacts"?"btn-gradient text-white":"text-white/50 border border-white/10"}`}>Контакты</button>
        </div>
        <button className="btn-gradient px-5 py-2 rounded-full text-sm font-semibold text-white shadow-lg hidden md:block">
          Войти
        </button>
      </nav>

      {activeSection === "home" && (
        <>
          {/* HERO */}
          <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            <div className="absolute inset-0 pointer-events-none">
              <div
                className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 animate-blob"
                style={{ background: "radial-gradient(circle, #7B2FFF, transparent 70%)" }}
              />
              <div
                className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-20 animate-blob"
                style={{ background: "radial-gradient(circle, #FF2D78, transparent 70%)", animationDelay: "3s" }}
              />
              <div
                className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full opacity-10 animate-blob"
                style={{ background: "radial-gradient(circle, #00D4FF, transparent 70%)", animationDelay: "5s", transform: "translate(-50%,-50%)" }}
              />
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
                  backgroundSize: "60px 60px",
                }}
              />
            </div>

            <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-medium text-white/80"
                style={{
                  background: "rgba(123,47,255,0.2)",
                  border: "1px solid rgba(123,47,255,0.4)",
                  animation: "fade-up 0.6s ease-out both",
                }}
              >
                <span className="w-2 h-2 rounded-full bg-[#AAFF00] animate-pulse" />
                Более 2 400 квартир по всей России
              </div>

              <h1
                className="text-5xl md:text-7xl font-black leading-none mb-6 tracking-tight"
                style={{ animation: "fade-up 0.6s 0.1s ease-out both" }}
              >
                Найди своё{" "}
                <span className="text-gradient-main block md:inline">идеальное жильё</span>
                <br />
                на любой срок
              </h1>

              <p
                className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-rubik font-light"
                style={{ animation: "fade-up 0.6s 0.2s ease-out both" }}
              >
                Посуточная аренда квартир, студий и апартаментов. Без переплат, без агентов — только прямые хозяева.
              </p>

              {/* SEARCH */}
              <div
                className="glass-card rounded-3xl p-6 md:p-8 max-w-4xl mx-auto"
                style={{ animation: "fade-up 0.6s 0.3s ease-out both" }}
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="md:col-span-1 relative">
                    <label className="text-xs text-white/40 uppercase tracking-widest mb-2 block font-medium">Город</label>
                    <div className="relative">
                      <Icon name="MapPin" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FF2D78]" />
                      <input
                        type="text"
                        placeholder="Москва..."
                        value={searchCity}
                        onChange={(e) => setSearchCity(e.target.value)}
                        className="w-full bg-white/10 border border-white/10 rounded-xl pl-9 pr-3 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#7B2FFF]/60 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-white/40 uppercase tracking-widest mb-2 block font-medium">Заезд</label>
                    <div className="relative">
                      <Icon name="Calendar" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7B2FFF]" />
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full bg-white/10 border border-white/10 rounded-xl pl-9 pr-3 py-3 text-sm text-white focus:outline-none focus:border-[#7B2FFF]/60 transition-colors [color-scheme:dark]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-white/40 uppercase tracking-widest mb-2 block font-medium">Выезд</label>
                    <div className="relative">
                      <Icon name="Calendar" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00D4FF]" />
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full bg-white/10 border border-white/10 rounded-xl pl-9 pr-3 py-3 text-sm text-white focus:outline-none focus:border-[#7B2FFF]/60 transition-colors [color-scheme:dark]"
                      />
                    </div>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleSearch}
                      className="w-full btn-gradient rounded-xl py-3 px-6 font-semibold text-white flex items-center justify-center gap-2 text-sm"
                    >
                      <Icon name="Search" size={16} />
                      Найти
                    </button>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-white/40 uppercase tracking-widest font-medium whitespace-nowrap">Цена/сутки ₽:</span>
                      <input
                        type="number"
                        min={0}
                        value={priceMin}
                        onChange={(e) => setPriceMin(Number(e.target.value))}
                        className="w-20 bg-white/10 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white text-center focus:outline-none focus:border-[#FF2D78]/60"
                      />
                      <span className="text-white/30">—</span>
                      <input
                        type="number"
                        min={priceMin}
                        value={priceMax}
                        onChange={(e) => setPriceMax(Number(e.target.value))}
                        className="w-24 bg-white/10 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white text-center focus:outline-none focus:border-[#FF2D78]/60"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {amenityOptions.map((a) => (
                        <button
                          key={a}
                          onClick={() => toggleAmenity(a)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                            selectedAmenities.includes(a)
                              ? "bg-gradient-to-r from-[#FF2D78] to-[#7B2FFF] border-transparent text-white"
                              : "border-white/20 text-white/50 hover:border-white/40 hover:text-white"
                          }`}
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3 mt-8" style={{ animation: "fade-up 0.6s 0.4s ease-out both" }}>
                <span className="text-white/30 text-sm self-center">Популярные:</span>
                {CITIES.map((city) => (
                  <button
                    key={city}
                    onClick={() => setSearchCity(city)}
                    className="text-sm text-white/60 hover:text-white border border-white/10 hover:border-white/30 px-4 py-1.5 rounded-full transition-all duration-200 hover:bg-white/5"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* STATS */}
          <section className="py-16 px-4 border-y border-white/5">
            <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { num: "2 400+", label: "Квартир", icon: "Building2", color: "#FF2D78" },
                { num: "89", label: "Городов", icon: "MapPin", color: "#7B2FFF" },
                { num: "47К+", label: "Гостей", icon: "Users", color: "#00D4FF" },
                { num: "4.9★", label: "Средний рейтинг", icon: "Star", color: "#AAFF00" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div
                    className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center"
                    style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}30` }}
                  >
                    <Icon name={stat.icon} size={22} style={{ color: stat.color }} />
                  </div>
                  <div className="text-3xl font-black text-gradient-main mb-1">{stat.num}</div>
                  <div className="text-white/40 text-sm font-rubik">{stat.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* APARTMENTS GRID */}
          <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <div className="text-xs text-[#FF2D78] uppercase tracking-widest font-semibold mb-3">
                    {searchDone ? `Результаты: ${filteredCards.length}` : "Горячие предложения"}
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                    {searchDone ? "Найдено жильё" : "Выбор редакции"}
                  </h2>
                </div>
                {searchDone && (
                  <button
                    onClick={() => { setFilteredCards(APARTMENTS); setSearchDone(false); setSearchCity(""); setSelectedAmenities([]); }}
                    className="text-sm text-white/40 hover:text-white flex items-center gap-2 transition-colors"
                  >
                    <Icon name="X" size={14} />
                    Сбросить
                  </button>
                )}
              </div>

              {filteredCards.length === 0 ? (
                <div className="text-center py-24">
                  <div className="text-6xl mb-4">🔍</div>
                  <p className="text-white/40 text-lg">По вашим параметрам ничего не найдено</p>
                  <button
                    onClick={() => { setFilteredCards(APARTMENTS); setSearchDone(false); setSearchCity(""); setSelectedAmenities([]); setPriceMin(0); setPriceMax(10000); }}
                    className="mt-6 btn-gradient px-6 py-3 rounded-xl text-white font-semibold"
                  >
                    Показать всё
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCards.map((apt, i) => (
                    <div
                      key={apt.id}
                      className="group card-hover rounded-3xl overflow-hidden cursor-pointer"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        animation: `fade-up 0.5s ${i * 0.07}s ease-out both`,
                      }}
                    >
                      <div className="relative overflow-hidden h-56">
                        <img
                          src={apt.img}
                          alt={apt.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        {apt.badge && (
                          <div className={`absolute top-3 left-3 bg-gradient-to-r ${apt.badgeColor} text-white text-[10px] font-black px-3 py-1 rounded-full tracking-widest shadow-lg`}>
                            {apt.badge}
                          </div>
                        )}
                        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full border border-white/10">
                          <Icon name="Star" size={11} className="text-yellow-400 fill-yellow-400" />
                          <span className="font-semibold">{apt.rating}</span>
                          <span className="text-white/50">({apt.reviews})</span>
                        </div>
                        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white/80 text-xs">
                          <Icon name="MapPin" size={11} className="text-[#FF2D78]" />
                          {apt.location}
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-white text-lg mb-3">{apt.title}</h3>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {apt.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[11px] text-white/50 px-2.5 py-1 rounded-full"
                              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-2xl font-black text-white">{apt.price.toLocaleString("ru")}</span>
                            <span className="text-white/40 text-sm ml-1 font-rubik">₽/ночь</span>
                          </div>
                          <button className="btn-gradient text-white text-sm font-semibold px-5 py-2.5 rounded-xl">
                            Забронировать
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section className="py-20 px-4 relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-30"
              style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(123,47,255,0.15) 0%, transparent 70%)" }}
            />
            <div className="max-w-5xl mx-auto relative z-10">
              <div className="text-center mb-16">
                <div className="text-xs text-[#00D4FF] uppercase tracking-widest font-semibold mb-3">Просто и быстро</div>
                <h2 className="text-4xl md:text-5xl font-black">Как это работает</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { num: "01", title: "Ищи и фильтруй", desc: "Выбери город, даты и укажи нужные удобства — умный поиск подберёт лучшие варианты.", icon: "Search", color: "#FF2D78" },
                  { num: "02", title: "Бронируй онлайн", desc: "Оплата картой за пару кликов. Никаких скрытых комиссий и звонков агентам.", icon: "CreditCard", color: "#7B2FFF" },
                  { num: "03", title: "Заезжай!", desc: "Получи код от замка или ключи. Поддержка 24/7 на всём протяжении вашего отдыха.", icon: "Key", color: "#00D4FF" },
                ].map((step, i) => (
                  <div
                    key={i}
                    className="rounded-3xl p-8 h-full transition-all duration-300 hover:scale-105"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      animation: `fade-up 0.5s ${i * 0.15}s ease-out both`,
                    }}
                  >
                    <div className="text-6xl font-black opacity-10 mb-4" style={{ color: step.color }}>{step.num}</div>
                    <div
                      className="w-12 h-12 rounded-2xl mb-5 flex items-center justify-center"
                      style={{ background: `${step.color}20`, border: `1px solid ${step.color}40` }}
                    >
                      <Icon name={step.icon} size={22} style={{ color: step.color }} />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                    <p className="text-white/40 font-rubik font-light leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {activeSection === "contacts" && (
        <section className="min-h-screen pt-32 pb-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full opacity-15 animate-blob"
              style={{ background: "radial-gradient(circle, #7B2FFF, transparent 70%)" }}
            />
            <div
              className="absolute bottom-1/3 right-1/3 w-64 h-64 rounded-full opacity-10 animate-blob"
              style={{ background: "radial-gradient(circle, #FF2D78, transparent 70%)", animationDelay: "4s" }}
            />
          </div>

          <div className="max-w-4xl mx-auto relative z-10">
            <div className="text-center mb-16" style={{ animation: "fade-up 0.6s ease-out both" }}>
              <div className="text-xs text-[#FF2D78] uppercase tracking-widest font-semibold mb-3">Всегда на связи</div>
              <h2 className="text-5xl font-black mb-4">Свяжитесь с нами</h2>
              <p className="text-white/40 font-rubik text-lg max-w-xl mx-auto">
                Ответим в течение 5 минут. Круглосуточная поддержка для гостей.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="space-y-4" style={{ animation: "fade-up 0.6s 0.1s ease-out both" }}>
                <h3 className="text-xs text-white/30 uppercase tracking-widest font-medium mb-6">Способы связи</h3>
                {[
                  { icon: "MessageCircle", label: "Telegram", value: "@nocheVka_support", color: "#00D4FF" },
                  { icon: "Phone", label: "Телефон", value: "+7 (800) 123-45-67", color: "#AAFF00" },
                  { icon: "Mail", label: "Email", value: "hello@nocheVka.ru", color: "#FF2D78" },
                  { icon: "MessageSquare", label: "WhatsApp", value: "+7 (800) 123-45-67", color: "#7B2FFF" },
                ].map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] group cursor-pointer"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${c.color}20`, border: `1px solid ${c.color}40` }}
                    >
                      <Icon name={c.icon} size={20} style={{ color: c.color }} />
                    </div>
                    <div>
                      <div className="text-xs text-white/30 uppercase tracking-widest font-medium">{c.label}</div>
                      <div className="text-white font-semibold">{c.value}</div>
                    </div>
                    <Icon name="ArrowUpRight" size={16} className="ml-auto text-white/20 group-hover:text-white/60 transition-colors" />
                  </div>
                ))}
              </div>

              <div
                className="glass-card rounded-3xl p-8"
                style={{ animation: "fade-up 0.6s 0.2s ease-out both" }}
              >
                <h3 className="text-lg font-bold mb-6">Написать нам</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-white/40 uppercase tracking-widest font-medium mb-2 block">Имя</label>
                    <input
                      type="text"
                      placeholder="Ваше имя"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#7B2FFF]/60 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 uppercase tracking-widest font-medium mb-2 block">Контакт</label>
                    <input
                      type="text"
                      placeholder="Email или телефон"
                      value={formContact}
                      onChange={(e) => setFormContact(e.target.value)}
                      className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#7B2FFF]/60 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 uppercase tracking-widest font-medium mb-2 block">Сообщение</label>
                    <textarea
                      rows={4}
                      placeholder="Чем можем помочь?"
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#7B2FFF]/60 transition-colors resize-none"
                    />
                  </div>

                  {formStatus === "success" && (
                    <div className="flex items-center gap-2 text-[#AAFF00] text-sm bg-[#AAFF00]/10 border border-[#AAFF00]/20 rounded-xl px-4 py-3">
                      <Icon name="CheckCircle" size={16} />
                      Сообщение отправлено! Ответим в ближайшее время.
                    </div>
                  )}
                  {formStatus === "error" && (
                    <div className="flex items-center gap-2 text-[#FF2D78] text-sm bg-[#FF2D78]/10 border border-[#FF2D78]/20 rounded-xl px-4 py-3">
                      <Icon name="AlertCircle" size={16} />
                      Ошибка отправки. Попробуйте позже.
                    </div>
                  )}

                  <button
                    onClick={handleFormSubmit}
                    disabled={formStatus === "loading" || !formName || !formContact || !formMessage}
                    className="w-full btn-gradient text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {formStatus === "loading" ? (
                      <>
                        <Icon name="Loader" size={16} className="animate-spin" />
                        Отправляем...
                      </>
                    ) : (
                      <>
                        <Icon name="Send" size={16} />
                        Отправить
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div style={{ animation: "fade-up 0.6s 0.3s ease-out both" }}>
              <h3 className="text-xs text-white/30 uppercase tracking-widest font-medium mb-4 text-center">Частые вопросы</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {["Как отменить бронь?", "Возврат средств", "Заселение раньше срока", "Забыл вещи", "Проблема с жильём", "Стать хозяином"].map((q) => (
                  <button
                    key={q}
                    className="px-4 py-2 rounded-full text-sm text-white/50 hover:text-white border border-white/10 hover:border-[#7B2FFF]/40 hover:bg-[#7B2FFF]/10 transition-all duration-200"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg btn-gradient flex items-center justify-center">
              <span className="text-white font-bold text-xs">N</span>
            </div>
            <span className="font-bold text-gradient-main">НОЧЕВКА</span>
          </div>
          <p className="text-white/20 text-sm font-rubik">© 2026 Ночевка. Посуточная аренда по всей России</p>
          <div className="flex gap-6 text-sm text-white/30">
            <a href="#" className="hover:text-white transition-colors">Условия</a>
            <a href="#" className="hover:text-white transition-colors">Конфиденциальность</a>
          </div>
        </div>
      </footer>
    </div>
  );
}