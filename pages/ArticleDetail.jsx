import { useState, useEffect } from "react";
import { supabase } from "../src/supabaseClient";
import { Link, useParams } from "react-router-dom";

export default function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("articles").select("*").eq("id", id).single().then(({ data }) => {
      setArticle(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="flex items-center justify-center min-h-screen text-gray-400" dir="rtl">جاري التحميل...</div>;
  if (!article) return <div className="flex items-center justify-center min-h-screen text-gray-400" dir="rtl">المقال غير موجود</div>;

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <header className="bg-gradient-to-l from-blue-900 to-blue-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-blue-900 font-bold text-lg">م</span>
            </div>
            <h1 className="text-2xl font-bold">محاسبون</h1>
          </div>
          <nav className="flex gap-6 text-sm font-medium">
            <Link to="/" className="hover:text-yellow-300">الرئيسية</Link>
            <Link to="/articles" className="text-yellow-300">المقالات</Link>
            <Link to="/jobs" className="hover:text-yellow-300">الوظائف</Link>
          </nav>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <Link to="/articles" className="text-blue-600 hover:underline text-sm mb-6 inline-block">← العودة للمقالات</Link>
        <div className="bg-white rounded-2xl shadow p-8">
          <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{article.category}</span>
          <h1 className="text-3xl font-bold text-gray-800 mt-4 mb-4">{article.title}</h1>
          <div className="flex gap-4 text-sm text-gray-400 mb-6 border-b pb-4">
            <span>✍️ {article.author}</span>
            <span>👁 {article.views || 0} مشاهدة</span>
          </div>
          <p className="text-gray-600 text-base leading-relaxed whitespace-pre-line">{article.content}</p>
          {article.tags && (
            <div className="mt-8 flex gap-2 flex-wrap">
              {article.tags.split(",").map(tag => (
                <span key={tag} className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">#{tag.trim()}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <footer className="bg-blue-900 text-white py-8 text-center mt-12">
        <p className="text-blue-200 text-sm">© 2026 محاسبون - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
}
