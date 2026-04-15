import { useState, useEffect } from "react";
import { supabase } from "../src/supabaseClient";
import { Link } from "react-router-dom";

const CATEGORIES = ["الكل", "محاسبة عامة", "ERP", "فاتورة وفوترة", "ضريبة وزكاة", "رواتب", "تدقيق"];
const PRICING = ["الكل", "مجاني", "مدفوع", "مجاني مع خطط مدفوعة", "تجربة مجانية"];

const pricingColors = {
  "مجاني": "bg-green-100 text-green-700",
  "مدفوع": "bg-red-100 text-red-600",
  "مجاني مع خطط مدفوعة": "bg-blue-100 text-blue-700",
  "تجربة مجانية": "bg-yellow-100 text-yellow-700",
};

export default function Softwares() {
  const [softwares, setSoftwares] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("الكل");
  const [pricing, setPricing] = useState("الكل");
  const [arabicOnly, setArabicOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("softwares").select("*").eq("is_active", true).order("is_featured", { ascending: false }).then(({ data }) => {
      setSoftwares(data || []);
      setLoading(false);
    });
  }, []);

  const filtered = softwares.filter(s => {
    const matchCat = category === "الكل" || s.category === category;
    const matchPrice = pricing === "الكل" || s.pricing_model === pricing;
    const matchArabic = !arabicOnly || s.is_arabic;
    const matchSearch = !search || s.name?.includes(search) || s.description?.includes(search);
    return matchCat && matchPrice && matchArabic && matchSearch;
  });

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
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
          <nav className="flex gap-6 text-sm font-medium">
            <Link to="/" className="hover:text-yellow-300">الرئيسية</Link>
            <Link to="/articles" className="hover:text-yellow-300">المقالات</Link>
            <Link to="/jobs" className="hover:text-yellow-300">الوظائف</Link>
            <Link to="/softwares" className="text-yellow-300">البرامج</Link>
          </nav>
        </div>
      </header>

      <div className="bg-gradient-to-bl from-blue-800 to-blue-600 text-white py-10 px-6 text-center">
        <h2 className="text-3xl font-bold mb-2">🛠 البرامج المحاسبية</h2>
        <p className="text-blue-200">اكتشف أفضل برامج المحاسبة والإدارة المالية</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <input type="text" placeholder="🔍 ابحث عن برنامج..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 mb-4" />
          <div className="flex gap-2 flex-wrap mb-3">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${category === c ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{c}</button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            {PRICING.map(p => (
              <button key={p} onClick={() => setPricing(p)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${pricing === p ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{p}</button>
            ))}
            <button onClick={() => setArabicOnly(!arabicOnly)}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${arabicOnly ? "bg-yellow-400 text-blue-900" : "bg-gray-100 text-gray-600"}`}>
              🇸🇦 يدعم العربية
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">جاري التحميل...</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {filtered.map(s => (
              <div key={s.id} className="bg-white rounded-2xl shadow hover:shadow-md transition-shadow p-6">
                {s.is_featured && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full mb-3 inline-block">⭐ مميز</span>}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl">🖥</div>
                  <div>
                    <h4 className="font-bold text-gray-800">{s.name}</h4>
                    <span className="text-xs text-gray-500">{s.category}</span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm mb-4 line-clamp-3">{s.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className={`text-xs px-3 py-1 rounded-full ${pricingColors[s.pricing_model] || "bg-gray-100 text-gray-600"}`}>{s.pricing_model}</span>
                  <span className="text-sm text-yellow-500">{"⭐".repeat(Math.round(s.rating || 0))}</span>
                </div>
                <div className="flex gap-2 flex-wrap mb-4">
                  {s.is_arabic && <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full">🇸🇦 عربي</span>}
                  {s.platforms?.split(",").map(p => (
                    <span key={p} className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">{p.trim()}</span>
                  ))}
                </div>
                <a href={s.website_url} target="_blank" rel="noreferrer"
                  className="w-full bg-blue-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors text-center block">
                  زيارة الموقع →
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="bg-blue-900 text-white py-8 text-center mt-12">
        <p className="text-blue-200 text-sm">© 2026 محاسبون - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
}
