import { useState, useEffect } from "react";
import { supabase } from "../src/supabaseClient";
import { Link } from "react-router-dom";

const CATEGORIES = ["الكل", "محاسبة مالية", "ضريبة", "تدقيق", "محاسبة إدارية", "معايير المحاسبة", "تقنية مالية", "أخرى"];

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("articles").select("*").eq("is_published", true).order("created_at", { ascending: false }).then(({ data }) => {
      setArticles(data || []);
      setLoading(false);
    });
  }, []);

  const filtered = articles.filter(a => {
    const matchCategory = selectedCategory === "الكل" || a.category === selectedCategory;
    const matchSearch = !search || a.title?.includes(search) || a.summary?.includes(search) || a.author?.includes(search);
    return matchCategory && matchSearch;
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
            <Link to="/" className="hover:text-yellow-300 transition-colors">الرئيسية</Link>
            <Link to="/articles" className="text-yellow-300">المقالات</Link>
            <Link to="/jobs" className="hover:text-yellow-300 transition-colors">الوظائف</Link>
            <Link to="/softwares" className="hover:text-yellow-300 transition-colors">البرامج</Link>
          </nav>
        </div>
      </header>

      <div className="bg-gradient-to-bl from-blue-800 to-blue-600 text-white py-10 px-6 text-center">
        <h2 className="text-3xl font-bold mb-2">📰 المقالات المحاسبية</h2>
        <p className="text-blue-200">ابق على اطلاع بأحدث المواضيع والمستجدات المحاسبية</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <input type="text" placeholder="🔍 ابحث في المقالات..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 mb-4" />
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === cat ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">جاري التحميل...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">لا توجد مقالات</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {filtered.map(a => (
              <Link to={`/articles/${a.id}`} key={a.id} className="bg-white rounded-2xl shadow hover:shadow-md transition-shadow p-5 block">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{a.category}</span>
                <h4 className="font-bold text-gray-800 mt-3 mb-2 line-clamp-2">{a.title}</h4>
                <p className="text-gray-500 text-sm line-clamp-3">{a.summary}</p>
                <div className="flex justify-between items-center mt-4 text-xs text-gray-400">
                  <span>✍️ {a.author}</span>
                  <span>👁 {a.views || 0}</span>
                </div>
              </Link>
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
