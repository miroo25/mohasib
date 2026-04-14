import { useState, useEffect } from "react";
import { Article } from "@/api/entities";
import { Job } from "@/api/entities";
import { Software } from "@/api/entities";
import { Link } from "react-router-dom";

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [softwares, setSoftwares] = useState([]);

  useEffect(() => {
    Article.filter({ is_published: true }, "-created_date", 3).then(setArticles);
    Job.filter({ is_active: true }, "-created_date", 4).then(setJobs);
    Software.filter({ is_featured: true, is_active: true }, "-created_date", 4).then(setSoftwares);
  }, []);

  const pricingColors = {
    "مجاني": "bg-green-100 text-green-700",
    "مدفوع": "bg-red-100 text-red-600",
    "مجاني مع خطط مدفوعة": "bg-blue-100 text-blue-700",
    "تجربة مجانية": "bg-yellow-100 text-yellow-700",
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-sans" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      {/* Header */}
      <header className="bg-gradient-to-l from-blue-900 to-blue-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-blue-900 font-bold text-lg">م</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-wide">محاسبون</h1>
              <p className="text-blue-200 text-xs">منصة المحاسبيين العرب</p>
            </div>
          </div>
          <nav className="flex gap-5 text-sm font-medium flex-wrap justify-end">
            <Link to="/" className="text-yellow-300">الرئيسية</Link>
            <Link to="/articles" className="hover:text-yellow-300 transition-colors">المقالات</Link>
            <Link to="/jobs" className="hover:text-yellow-300 transition-colors">الوظائف</Link>
            <Link to="/softwares" className="hover:text-yellow-300 transition-colors">البرامج</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-bl from-blue-800 to-blue-600 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">مرحباً بكم في <span className="text-yellow-300">محاسبون</span></h2>
          <p className="text-blue-100 text-lg mb-8">منصتك المتخصصة في المقالات المحاسبية والوظائف المهنية وأدوات المحاسبين</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/articles" className="bg-yellow-400 text-blue-900 px-7 py-3 rounded-full font-bold hover:bg-yellow-300 transition-colors shadow-lg">📰 المقالات</Link>
            <Link to="/jobs" className="bg-white text-blue-800 px-7 py-3 rounded-full font-bold hover:bg-blue-50 transition-colors shadow-lg">💼 الوظائف</Link>
            <Link to="/softwares" className="bg-indigo-500 text-white px-7 py-3 rounded-full font-bold hover:bg-indigo-400 transition-colors shadow-lg">💻 البرامج</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-4 gap-4 text-center">
          <div><div className="text-3xl font-bold text-blue-700">+500</div><div className="text-gray-500 text-sm">مقال متخصص</div></div>
          <div><div className="text-3xl font-bold text-green-600">+200</div><div className="text-gray-500 text-sm">وظيفة متاحة</div></div>
          <div><div className="text-3xl font-bold text-indigo-600">+50</div><div className="text-gray-500 text-sm">برنامج محاسبي</div></div>
          <div><div className="text-3xl font-bold text-yellow-500">+10K</div><div className="text-gray-500 text-sm">محاسب مسجل</div></div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">📰 أحدث المقالات</h3>
          <Link to="/articles" className="text-blue-600 hover:underline text-sm font-medium">عرض الكل ←</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map(article => (
            <Link to={`/articles/${article.id}`} key={article.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden group">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 h-36 flex items-center justify-center">
                <span className="text-5xl">📄</span>
              </div>
              <div className="p-5">
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">{article.category}</span>
                <h4 className="font-bold text-gray-800 mt-3 mb-2 text-base leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">{article.title}</h4>
                <p className="text-gray-500 text-sm line-clamp-2">{article.summary}</p>
                <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
                  <span>✍️ {article.author}</span>
                  <span>👁 {article.views?.toLocaleString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Softwares */}
      {softwares.length > 0 && (
        <section className="bg-indigo-50 py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">💻 برامج محاسبية مميزة</h3>
              <Link to="/softwares" className="text-indigo-600 hover:underline text-sm font-medium">عرض الكل ←</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {softwares.map(s => (
                <div key={s.id} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow text-center">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-3 text-2xl">💻</div>
                  <h4 className="font-bold text-gray-800 text-sm mb-1">{s.name}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${pricingColors[s.pricing_model] || "bg-gray-100 text-gray-600"}`}>{s.pricing_model}</span>
                  <div className="mt-2 text-yellow-400 text-xs">{'★'.repeat(Math.round(s.rating || 0))}</div>
                  {s.website_url && (
                    <a href={s.website_url} target="_blank" rel="noopener noreferrer" className="mt-2 block text-xs text-indigo-600 hover:underline">زيارة الموقع ↗</a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Jobs */}
      <section className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">💼 أحدث الوظائف</h3>
            <Link to="/jobs" className="text-blue-600 hover:underline text-sm font-medium">عرض الكل ←</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map(job => (
              <Link to={`/jobs/${job.id}`} key={job.id} className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex gap-4 group">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🏢</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-800 group-hover:text-blue-700 transition-colors">{job.title}</h4>
                  <p className="text-gray-500 text-sm">{job.company}</p>
                  <div className="flex gap-2 flex-wrap mt-2">
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">📍 {job.location}</span>
                    <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">{job.job_type}</span>
                    <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">{job.experience_level}</span>
                  </div>
                </div>
                <div className="text-sm text-green-600 font-semibold flex-shrink-0">{job.salary_range}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
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
