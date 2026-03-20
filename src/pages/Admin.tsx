import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const API_URL = "https://functions.poehali.dev/e7a2c28e-bab3-40d4-8d55-8a6f475edc5f";

interface Apartment {
  id: number;
  title: string;
  location: string;
  price: number;
  rooms: string;
  area: number | null;
  floor: string;
  description: string;
  tags: string[];
  img_url: string;
  badge: string;
  rating: number;
  reviews: number;
}

const EMPTY_FORM = {
  title: "",
  location: "Ачинск",
  price: "",
  rooms: "",
  area: "",
  floor: "",
  description: "",
  tags: "",
  img_url: "",
  badge: "",
};

export default function Admin() {
  const [adminKey, setAdminKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<"success" | "error" | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchApartments = async () => {
    setLoading(true);
    const res = await fetch(API_URL);
    const data = await res.json();
    setApartments(data.apartments || []);
    setLoading(false);
  };

  const handleAuth = async () => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Admin-Key": adminKey },
      body: JSON.stringify({ title: "__test__", price: 0 }),
    });
    if (res.status === 403) {
      setAuthError(true);
    } else {
      setAuthed(true);
      setAuthError(false);
      fetchApartments();
    }
  };

  useEffect(() => {
    if (authed) fetchApartments();
  }, [authed]);

  const handleSave = async () => {
    if (!form.title || !form.price) return;
    setSaving(true);
    setSaveMsg(null);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Admin-Key": adminKey },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          area: form.area ? Number(form.area) : null,
        }),
      });
      if (res.ok) {
        setSaveMsg("success");
        setForm(EMPTY_FORM);
        fetchApartments();
      } else {
        setSaveMsg("error");
      }
    } catch {
      setSaveMsg("error");
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    await fetch(API_URL, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", "X-Admin-Key": adminKey },
      body: JSON.stringify({ id }),
    });
    setDeletingId(null);
    fetchApartments();
  };

  const setField = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] font-golos flex items-center justify-center px-4">
        <div
          className="w-full max-w-sm rounded-3xl p-8"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl btn-gradient flex items-center justify-center">
              <Icon name="Lock" size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Панель управления</h1>
              <p className="text-white/40 text-xs">НОЧЕВКА · Ачинск</p>
            </div>
          </div>
          <label className="text-xs text-white/40 uppercase tracking-widest font-medium mb-2 block">Пароль администратора</label>
          <input
            type="password"
            placeholder="Введите пароль..."
            value={adminKey}
            onChange={(e) => { setAdminKey(e.target.value); setAuthError(false); }}
            onKeyDown={(e) => e.key === "Enter" && handleAuth()}
            className={`w-full bg-white/10 border rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors mb-4 ${authError ? "border-[#FF2D78]/60" : "border-white/10 focus:border-[#7B2FFF]/60"}`}
          />
          {authError && (
            <p className="text-[#FF2D78] text-xs mb-4 flex items-center gap-1">
              <Icon name="AlertCircle" size={12} /> Неверный пароль
            </p>
          )}
          <button onClick={handleAuth} className="w-full btn-gradient text-white font-bold py-3 rounded-xl">
            Войти
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] font-golos text-white">
      {/* Header */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 glass-card border-b border-white/10">
        <div className="flex items-center gap-3">
          <a href="/" className="text-white/40 hover:text-white transition-colors">
            <Icon name="ArrowLeft" size={18} />
          </a>
          <div className="w-8 h-8 rounded-lg btn-gradient flex items-center justify-center">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <span className="font-bold text-gradient-main">Панель управления</span>
        </div>
        <span className="text-white/30 text-sm">{apartments.length} объявлений</span>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">

        {/* ADD FORM */}
        <div>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Icon name="Plus" size={20} className="text-[#FF2D78]" />
            Добавить объявление
          </h2>
          <div
            className="rounded-3xl p-6 space-y-4"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            {[
              { key: "title", label: "Название *", placeholder: "1-комн. квартира в центре" },
              { key: "location", label: "Адрес", placeholder: "Ачинск, ул. Ленина 5" },
              { key: "img_url", label: "Ссылка на фото", placeholder: "https://..." },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="text-xs text-white/40 uppercase tracking-widest font-medium mb-1.5 block">{label}</label>
                <input
                  type="text"
                  placeholder={placeholder}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setField(key, e.target.value)}
                  className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#7B2FFF]/60 transition-colors"
                />
              </div>
            ))}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-white/40 uppercase tracking-widest font-medium mb-1.5 block">Цена ₽/ночь *</label>
                <input
                  type="number"
                  placeholder="2500"
                  value={form.price}
                  onChange={(e) => setField("price", e.target.value)}
                  className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#7B2FFF]/60 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-white/40 uppercase tracking-widest font-medium mb-1.5 block">Площадь м²</label>
                <input
                  type="number"
                  placeholder="42"
                  value={form.area}
                  onChange={(e) => setField("area", e.target.value)}
                  className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#7B2FFF]/60 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-white/40 uppercase tracking-widest font-medium mb-1.5 block">Комнат</label>
                <input
                  type="text"
                  placeholder="1-комн."
                  value={form.rooms}
                  onChange={(e) => setField("rooms", e.target.value)}
                  className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#7B2FFF]/60 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-white/40 uppercase tracking-widest font-medium mb-1.5 block">Этаж</label>
                <input
                  type="text"
                  placeholder="3/9"
                  value={form.floor}
                  onChange={(e) => setField("floor", e.target.value)}
                  className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#7B2FFF]/60 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-white/40 uppercase tracking-widest font-medium mb-1.5 block">Удобства (через запятую)</label>
              <input
                type="text"
                placeholder="Wi-Fi, Парковка, Кондиционер"
                value={form.tags}
                onChange={(e) => setField("tags", e.target.value)}
                className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#7B2FFF]/60 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-white/40 uppercase tracking-widest font-medium mb-1.5 block">Бейдж</label>
                <select
                  value={form.badge}
                  onChange={(e) => setField("badge", e.target.value)}
                  className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#7B2FFF]/60 transition-colors [color-scheme:dark]"
                >
                  <option value="">Нет</option>
                  <option value="ХИТ">ХИТ</option>
                  <option value="НОВОЕ">НОВОЕ</option>
                  <option value="ЛЮКС">ЛЮКС</option>
                  <option value="БЮДЖЕТ">БЮДЖЕТ</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-white/40 uppercase tracking-widest font-medium mb-1.5 block">Описание</label>
              <textarea
                rows={3}
                placeholder="Уютная квартира в центре Ачинска..."
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#7B2FFF]/60 transition-colors resize-none"
              />
            </div>

            {saveMsg === "success" && (
              <div className="flex items-center gap-2 text-[#AAFF00] text-sm bg-[#AAFF00]/10 border border-[#AAFF00]/20 rounded-xl px-4 py-3">
                <Icon name="CheckCircle" size={16} /> Объявление добавлено!
              </div>
            )}
            {saveMsg === "error" && (
              <div className="flex items-center gap-2 text-[#FF2D78] text-sm bg-[#FF2D78]/10 border border-[#FF2D78]/20 rounded-xl px-4 py-3">
                <Icon name="AlertCircle" size={16} /> Ошибка. Заполните обязательные поля.
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={saving || !form.title || !form.price}
              className="w-full btn-gradient text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? <><Icon name="Loader" size={16} className="animate-spin" /> Сохраняем...</> : <><Icon name="Plus" size={16} /> Добавить</>}
            </button>
          </div>
        </div>

        {/* APARTMENTS LIST */}
        <div>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Icon name="List" size={20} className="text-[#7B2FFF]" />
            Мои объявления
          </h2>
          {loading ? (
            <div className="flex items-center justify-center py-20 text-white/30">
              <Icon name="Loader" size={24} className="animate-spin mr-3" /> Загрузка...
            </div>
          ) : apartments.length === 0 ? (
            <div
              className="rounded-3xl p-10 text-center"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="text-4xl mb-3">🏠</div>
              <p className="text-white/30">Объявлений пока нет.<br />Добавьте первое!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {apartments.map((apt) => (
                <div
                  key={apt.id}
                  className="rounded-2xl p-4 flex gap-4 items-start"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  {apt.img_url ? (
                    <img src={apt.img_url} alt={apt.title} className="w-20 h-16 object-cover rounded-xl flex-shrink-0" />
                  ) : (
                    <div className="w-20 h-16 rounded-xl flex-shrink-0 flex items-center justify-center bg-white/5">
                      <Icon name="Home" size={24} className="text-white/20" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white text-sm truncate">{apt.title}</div>
                    <div className="text-white/40 text-xs mt-0.5 flex items-center gap-1">
                      <Icon name="MapPin" size={10} />
                      {apt.location}
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[#FF2D78] font-bold text-sm">{apt.price.toLocaleString("ru")} ₽/ночь</span>
                      {apt.badge && (
                        <span className="text-[10px] bg-white/10 text-white/60 px-2 py-0.5 rounded-full">{apt.badge}</span>
                      )}
                    </div>
                    {apt.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {apt.tags.slice(0, 3).map((t) => (
                          <span key={t} className="text-[10px] text-white/40 bg-white/5 px-2 py-0.5 rounded-full">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(apt.id)}
                    disabled={deletingId === apt.id}
                    className="text-white/20 hover:text-[#FF2D78] transition-colors flex-shrink-0 p-1"
                  >
                    {deletingId === apt.id
                      ? <Icon name="Loader" size={16} className="animate-spin" />
                      : <Icon name="Trash2" size={16} />}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
