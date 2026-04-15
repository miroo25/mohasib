import { useState, useEffect } from "react";
import { supabase } from "../src/supabaseClient";
import { Link } from "react-router-dom";

const JOB_TYPES = ["الكل", "دوام", "عن بعد", "جزئي"];
const EXP_LEVELS = ["الكل", "حديث التخرج", "1-3 سنوات", "3-5 سنوات", "+5 سنوات"];

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [jobType, setJobType] = useState("الكل");
  const [expLevel, setExpLevel] = useState("الكل");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("jobs").select("*").eq("is_active", true).order("created_at", { ascending: false }).then(({ data }) => {
      setJobs(data || []);
      setLoading(false);
    });
  }, []);

  const filtered = jobs.filter(j => {
    const matchType = jobType === "الكل" || j.job_type === jobType;
    const matchExp = expLevel === "الكل" || j.experience_level === expLevel;
    const matchSearch = !search || j.title?.includes(search) || j.company?.includes(search) || j.location?.includes(search);
    return matchType && matchExp && matchSearch;
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
            <Link to="/jobs" className="text-yellow-300">الوظائف</Link>
            <Link to="/softwares" className="hover:text-yellow-300">البرامج</Link>
          </nav>
        </div>
      </header>

      <div className="bg-gradient-to-bl from-blue-800 to-blue-600 text-white py-10 px-6 text-center">
        <h2 className="text-3xl font-bold mb-2">💼 الوظائف المحاسبية</h2>
        <p className="text-blue-200">اكتشف أحدث الفرص الوظيفية في مجال المحاسبة والمالية</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <input type="text" placeholder="🔍 ابحث عن وظيفة..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 mb-4" />
          <div className="flex gap-2 flex-wrap">
            {JOB_TYPES.map(t => (
              <button key={t} onClick={() => setJobType(t)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${jobType === t ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">جاري التحميل...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">لا توجد وظائف</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {filtered.map(j => (
              <Link to={`/jobs/${j.id}`} key={j.id} className="bg-white rounded-2xl shadow hover:shadow-md transition-shadow p-6 block">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">{j.title}</h4>
                    <p className="text-blue-600 text-sm mt-1">🏢 {j.company}</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">{j.job_type}</span>
                </div>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{j.description}</p>
                <div className="flex gap-3 text-xs text-gray-500 flex-wrap">
                  <span>📍 {j.location}</span>
                  <span>💰 {j.salary_range}</span>
                  <span>⏱ {j.experience_level}</span>
                  <span>📅 {j.deadline}</span>
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
