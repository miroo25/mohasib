import { useState, useEffect } from "react";
import { Article } from "@/api/entities";
import { Link } from "react-router-dom";

const CATEGORIES = ["الكل", "محاسبة مالية", "ضريبة", "تدقيق", "محاسبة إدارية", "معايير المحاسبة", "تقنية مالية", "أخرى"];

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Article.filter({ is_published: true }, "-created_date").then(data => {
      setArticles(data);
      setLoading(false);
    });
  }, []);

  const filtered = articles.filter(a => {
    const matchCategory = selectedCategory === "الكل" || a.category === selectedCategory;
    const matchSearch = !search || a.title.includes(search) || a.summary?.includes(search) || a.author?.includes(search);
    return matchCategory && matchSearch;
  });

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
          <nav className="flex gap-6 text-sm font-medium">
            <Link to="/" className="hover:text-yellow-300 transition-colors">الرئيسية</Link>
            <Link to="/articles" className="text-yellow-300">المقالات</Link>
            <Link to="/jobs" className="hover:text-yellow-300 transition-colors">الوظائف</Link>
          </nav>
        </div>
      </header>

      {/* Page Title */}
      <div className="bg-gradient-to-bl from-blue-800 to-blue-600 text-white py-10 px-6 text-center">
        <h2 className="text-3xl font-bold mb-2">📰 المقالات المحاسبية</h2>
        <p className="text-blue-200">ابق على اطلاع بأحدث المواضيع والمستجدات المحاسبية</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search & Filter */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex gap-4 flex-col md:flex-row mb-4">
            <input
              type="text"
              placeholder="🔍 ابحث في المقالات..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-right focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-blue-700 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-blue-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-gray-500 text-sm mb-4">{filtered.length} مقال</p>

        {loading ? (
          <div className="text-center py-20 text-gray-400">جارٍ التحميل...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">📭</div>
            <p>لا توجد مقالات تطابق بحثك</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(article => (
              <Link to={`/articles/${article.id}`} key={article.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden group">
                <div className="bg-gradient-to-br from-blue-100 to-indigo-100 h-40 flex items-center justify-center">
                  <span className="text-6xl">📄</span>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{article.category}</span>
                    <span className="text-gray-400 text-xs">👁 {article.views?.toLocaleString()}</span>
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2 text-base leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">{article.title}</h4>
                  <p className="text-gray-500 text-sm line-clamp-3 mb-4">{article.summary}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400 border-t pt-3">
                    <span className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
                      {article.author?.[0]}
                    </span>
                    <span>{article.author}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <footer className="bg-blue-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-xl font-bold mb-2">محاسبون</div>
          <p className="text-blue-300 text-sm">منصة المحاسبيين العرب للمقالات والوظائف المهنية</p>
          <p className="text-blue-400 text-xs mt-4">© 2026 محاسبون - جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </div>
  );
}
