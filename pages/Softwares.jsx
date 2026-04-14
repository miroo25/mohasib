import { useState, useEffect } from "react";
import { Software } from "@/api/entities";
import { Link } from "react-router-dom";

const CATEGORIES = ["الكل", "محاسبة عامة", "ضريبة وزكاة", "رواتب وموارد بشرية", "تدقيق", "تحليل مالي", "فاتورة وفوترة", "ERP", "أخرى"];
const PRICING = ["الكل", "مجاني", "مدفوع", "مجاني مع خطط مدفوعة", "تجربة مجانية"];

const categoryIcons = {
  "محاسبة عامة": "📊",
  "ضريبة وزكاة": "🧾",
  "رواتب وموارد بشرية": "👥",
  "تدقيق": "🔍",
  "تحليل مالي": "📈",
  "فاتورة وفوترة": "🧾",
  "ERP": "🏭",
  "أخرى": "💡",
};

const pricingColors = {
  "مجاني": "bg-green-100 text-green-700",
  "مدفوع": "bg-red-100 text-red-600",
  "مجاني مع خطط مدفوعة": "bg-blue-100 text-blue-700",
  "تجربة مجانية": "bg-yellow-100 text-yellow-700",
};

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={`text-sm ${i <= Math.round(rating) ? "text-yellow-400" : "text-gray-200"}`}>★</span>
      ))}
      <span className="text-xs text-gray-500 mr-1">{rating?.toFixed(1)}</span>
    </div>
  );
}

export default function Softwares() {
  const [softwares, setSoftwares] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("الكل");
  const [pricing, setPricing] = useState("الكل");
  const [arabicOnly, setArabicOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Software.filter({ is_active: true }, "-is_featured").then(data => {
      setSoftwares(data);
      setLoading(false);
    });
  }, []);

  const filtered = softwares.filter(s => {
    const matchCat = category === "الكل" || s.category === category;
    const matchPrice = pricing === "الكل" || s.pricing_model === pricing;
    const matchArabic = !arabicOnly || s.is_arabic;
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.description?.includes(search);
    return matchCat && matchPrice && matchArabic && matchSearch;
  });

  const featured = softwares.filter(s => s.is_featured);

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      {/* Header */}
      <header className="bg-gradient-to-l from-blue-900 to-blue-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-blue-900 font-bold text-lg">م</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">محاسبون</h1>
              <p className="text-blue-200 text-xs">منصة المحاسبيين العرب</p>
            </div>
          </div>
          <nav className="flex gap-5 text-sm font-medium flex-wrap justify-end">
            <Link to="/" className="hover:text-yellow-300 transition-colors">الرئيسية</Link>
            <Link to="/articles" className="hover:text-yellow-300 transition-colors">المقالات</Link>
            <Link to="/jobs" className="hover:text-yellow-300 transition-colors">الوظائف</Link>
            <Link to="/softwares" className="text-yellow-300">البرامج</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-bl from-indigo-800 to-indigo-600 text-white py-14 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="text-5xl mb-4">💻</div>
          <h2 className="text-3xl font-bold mb-3">برامج المحاسبة والمالية</h2>
          <p className="text-indigo-200 text-lg">اكتشف أفضل البرامج التي تساعدك على أداء عملك بدقة وسرعة واحترافية</p>
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-10">
          <h3 className="text-xl font-bold text-gray-800 mb-5">⭐ البرامج المميزة</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.slice(0, 4).map(s => (
              <div key={s.id} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow text-center border-2 border-indigo-100">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-3xl">
                  {categoryIcons[s.category] || "💻"}
                </div>
                <h4 className="font-bold text-gray-800 text-sm mb-1">{s.name}</h4>
                <span className={`text-xs px-2 py-0.5 rounded-full ${pricingColors[s.pricing_model]}`}>{s.pricing_model}</span>
                <div className="mt-2 flex justify-center">
                  <StarRating rating={s.rating} />
                </div>
                {s.website_url && (
                  <a href={s.website_url} target="_blank" rel="noopener noreferrer"
                    className="mt-3 block text-xs text-indigo-600 hover:underline">زيارة الموقع ↗</a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-6 pb-12">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <input
            type="text"
            placeholder="🔍 ابحث عن برنامج..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-right mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-2 font-medium">التصنيف</p>
              <div className="flex gap-2 flex-wrap">
                {CATEGORIES.map(c => (
                  <button key={c} onClick={() => setCategory(c)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${category === c ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-indigo-50"}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2 font-medium">نموذج التسعير</p>
              <div className="flex gap-2 flex-wrap">
                {PRICING.map(p => (
                  <button key={p} onClick={() => setPricing(p)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${pricing === p ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-indigo-50"}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2 font-medium">خيارات إضافية</p>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={arabicOnly} onChange={e => setArabicOnly(e.target.checked)} className="w-4 h-4 accent-indigo-600" />
                <span className="text-sm text-gray-700">يدعم العربية فقط 🌍</span>
              </label>
            </div>
          </div>
        </div>

        <p className="text-gray-500 text-sm mb-4">{filtered.length} برنامج</p>

        {loading ? (
          <div className="text-center py-20 text-gray-400">جارٍ التحميل...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">🔍</div>
            <p>لا توجد برامج تطابق بحثك</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(s => (
              <div key={s.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-3xl flex-shrink-0">
                    {categoryIcons[s.category] || "💻"}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">{s.name}</h4>
                    <StarRating rating={s.rating} />
                    <div className="flex gap-2 mt-1 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${pricingColors[s.pricing_model] || "bg-gray-100 text-gray-600"}`}>
                        {s.pricing_model}
                      </span>
                      {s.is_arabic && (
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">🌍 يدعم العربية</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full">{categoryIcons[s.category]} {s.category}</span>
                    {s.price_range && (
                      <span className="text-green-600 text-xs font-medium">{s.price_range}</span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">{s.description}</p>
                  {s.features && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-400 mb-2 font-medium">المميزات الرئيسية:</p>
                      <div className="flex gap-1.5 flex-wrap">
                        {s.features.split(",").slice(0, 4).map(f => (
                          <span key={f} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-lg">✓ {f.trim()}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {s.platforms && (
                    <div className="flex items-center gap-2 mb-4 text-xs text-gray-400">
                      <span>📱</span>
                      <span>{s.platforms}</span>
                    </div>
                  )}
                  {s.website_url && (
                    <a href={s.website_url} target="_blank" rel="noopener noreferrer"
                      className="mt-auto block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-medium transition-colors">
                      زيارة الموقع الرسمي ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="bg-blue-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-xl font-bold mb-2">محاسبون</div>
          <p className="text-blue-300 text-sm">منصة المحاسبيين العرب للمقالات والوظائف والبرامج المهنية</p>
          <p className="text-blue-400 text-xs mt-4">© 2026 محاسبون - جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </div>
  );
}
