import { useState, useEffect } from "react";
import { supabase } from "../src/supabaseClient";
import { Link } from "react-router-dom";

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [softwares, setSoftwares] = useState([]);

  useEffect(() => {
    supabase.from("articles").select("*").eq("is_published", true).order("created_at", { ascending: false }).limit(3).then(({ data }) => setArticles(data || []));
    supabase.from("jobs").select("*").eq("is_active", true).order("created_at", { ascending: false }).limit(4).then(({ data }) => setJobs(data || []));
    supabase.from("softwares").select("*").eq("is_featured", true).eq("is_active", true).order("created_at", { ascending: false }).limit(4).then(({ data }) => setSoftwares(data || []));
  }, []);

  const pricingColors = {
    "مجاني": "bg-green-100 text-green-700",
    "مدفوع": "bg-red-100 text-red-600",
    "مجاني مع خطط مدفوعة": "bg-blue-100 text-blue-700",
    "تجربة مجانية": "bg-yellow-100 text-yellow-700",
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-sans" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
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

      <section className="bg-gradient-to-bl from-blue-800 to-blue-600 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">مرحباً بكم في <span className="text-yellow-300">محاسبون</span></h2>
          <p className="text-blue-100 text-lg mb-8">منصتك المتخصصة في المقالات المحاسبية والوظائف المهنية وأدوات المحاسبين</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/articles" className="bg-yellow-400 text-blue-900 px-7 py-3 rounded-full font-bold hover:bg-yellow-300 transition-colors shadow-lg">📰 المقالات</Link>
            <Link to="/jobs" className="bg-white text-blue-800 px-7 py-3 rounded-full font-bold hover:bg-blue-50 transition-colors shadow-lg">💼 الوظائف</Link>
            <Link to="/softwares" className="bg-blue-500 text-white px-7 py-3 rounded-full font-bold hover:bg-blue-400 transition-colors shadow-lg">🛠 البرامج</Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-blue-900">📰 أحدث المقالات</h3>
          <Link to="/articles" className="text-blue-600 hover:underline text-sm">عرض الكل</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {articles.map(a => (
            <Link to={`/articles/${a.id}`} key={a.id} className="bg-white rounded-2xl shadow hover:shadow-md transition-shadow p-5 block">
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{a.category}</span>
              <h4 className="font-bold text-gray-800 mt-3 mb-2 line-clamp-2">{a.title}</h4>
              <p className="text-gray-500 text-sm line-clamp-2">{a.summary}</p>
              <p className="text-xs text-gray-400 mt-3">✍️ {a.author}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-blue-50 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-blue-900">💼 أحدث الوظائف</h3>
            <Link to="/jobs" className="text-blue-600 hover:underline text-sm">عرض الكل</Link>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {jobs.map(j => (
              <Link to={`/jobs/${j.id}`} key={j.id} className="bg-white rounded-2xl shadow p-5 hover:shadow-md transition-shadow block">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-gray-800">{j.title}</h4>
                    <p className="text-blue-600 text-sm mt-1">🏢 {j.company}</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{j.job_type}</span>
                </div>
                <div className="flex gap-3 mt-3 text-xs text-gray-500 flex-wrap">
                  <span>📍 {j.location}</span>
                  <span>💰 {j.salary_range}</span>
                  <span>⏱ {j.experience_level}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-blue-900">🛠 برامج مميزة</h3>
          <Link to="/softwares" className="text-blue-600 hover:underline text-sm">عرض الكل</Link>
        </div>
        <div className="grid md:grid-cols-4 gap-5">
          {softwares.map(s => (
            <a href={s.website_url} target="_blank" rel="noreferrer" key={s.id} className="bg-white rounded-2xl shadow p-5 hover:shadow-md transition-shadow block text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 text-xl">🖥</div>
              <h4 className="font-bold text-gray-800 mb-1">{s.name}</h4>
              <span className={`text-xs px-2 py-1 rounded-full ${pricingColors[s.pricing_model] || "bg-gray-100 text-gray-600"}`}>{s.pricing_model}</span>
              <p className="text-yellow-500 mt-2 text-sm">{"⭐".repeat(Math.round(s.rating || 0))}</p>
            </a>
          ))}
        </div>
      </section>

      <footer className="bg-blue-900 text-white py-8 text-center">
        <p className="text-blue-200 text-sm">© 2026 محاسبون - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
}
