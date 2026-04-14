import { useState, useEffect } from "react";
import { Article } from "@/api/entities";
import { useParams, Link } from "react-router-dom";

export default function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Article.get(id).then(data => {
      setArticle(data);
      setLoading(false);
      // Increment views
      Article.update(id, { views: (data.views || 0) + 1 });
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div dir="rtl" className="min-h-screen bg-gray-50 flex items-center justify-center" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <div className="text-gray-400 text-xl">جارٍ التحميل...</div>
    </div>
  );

  if (!article) return (
    <div dir="rtl" className="min-h-screen bg-gray-50 flex items-center justify-center" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <div className="text-center">
        <div className="text-5xl mb-4">😕</div>
        <p className="text-gray-500">المقال غير موجود</p>
        <Link to="/articles" className="text-blue-600 hover:underline mt-4 block">العودة للمقالات</Link>
      </div>
    </div>
  );

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
            <Link to="/articles" className="hover:text-yellow-300 transition-colors">المقالات</Link>
            <Link to="/jobs" className="hover:text-yellow-300 transition-colors">الوظائف</Link>
          </nav>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <Link to="/articles" className="text-blue-600 hover:underline text-sm mb-6 block">← العودة للمقالات</Link>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 h-48 flex items-center justify-center">
            <span className="text-8xl">📄</span>
          </div>
          <div className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full">{article.category}</span>
              <span className="text-gray-400 text-sm">👁 {article.views?.toLocaleString()} مشاهدة</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4 leading-relaxed">{article.title}</h1>
            <div className="flex items-center gap-3 mb-6 pb-6 border-b">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-lg">
                {article.author?.[0]}
              </div>
              <div>
                <p className="font-medium text-gray-700">{article.author}</p>
                <p className="text-gray-400 text-xs">{new Date(article.created_date).toLocaleDateString("ar-SA")}</p>
              </div>
            </div>
            {article.summary && (
              <div className="bg-blue-50 border-r-4 border-blue-500 p-4 rounded-lg mb-6">
                <p className="text-blue-800 font-medium">{article.summary}</p>
              </div>
            )}
            <div className="text-gray-700 leading-loose whitespace-pre-wrap text-base">
              {article.content}
            </div>
            {article.tags && (
              <div className="mt-8 pt-6 border-t">
                <p className="text-gray-500 text-sm mb-2">الوسوم:</p>
                <div className="flex gap-2 flex-wrap">
                  {article.tags.split(",").map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">#{tag.trim()}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="bg-blue-900 text-white py-8 mt-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-xl font-bold mb-2">محاسبون</div>
          <p className="text-blue-300 text-sm">منصة المحاسبيين العرب للمقالات والوظائف المهنية</p>
          <p className="text-blue-400 text-xs mt-4">© 2026 محاسبون - جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </div>
  );
}
