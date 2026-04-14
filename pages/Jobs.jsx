import { useState, useEffect } from "react";
import { Job } from "@/api/entities";
import { Link } from "react-router-dom";

const JOB_TYPES = ["الكل", "دوام", "جزئي", "عن بعد", "تدريب"];
const EXPERIENCE = ["الكل", "مبتدئ", "1-3 سنوات", "3-5 سنوات", "+5 سنوات"];
const CATEGORIES = ["الكل", "محاسب عام", "مدقق حسابات", "محلل مالي", "مدير مالي", "محاسب ضرائب", "محاسب تكاليف", "أخرى"];

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [jobType, setJobType] = useState("الكل");
  const [experience, setExperience] = useState("الكل");
  const [category, setCategory] = useState("الكل");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Job.filter({ is_active: true }, "-created_date").then(data => {
      setJobs(data);
      setLoading(false);
    });
  }, []);

  const filtered = jobs.filter(j => {
    const matchType = jobType === "الكل" || j.job_type === jobType;
    const matchExp = experience === "الكل" || j.experience_level === experience;
    const matchCat = category === "الكل" || j.category === category;
    const matchSearch = !search || j.title.includes(search) || j.company?.includes(search) || j.location?.includes(search);
    return matchType && matchExp && matchCat && matchSearch;
  });

  const typeColors = {
    "دوام": "bg-green-100 text-green-700",
    "جزئي": "bg-yellow-100 text-yellow-700",
    "عن بعد": "bg-purple-100 text-purple-700",
    "تدريب": "bg-blue-100 text-blue-700",
  };

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
            <Link to="/jobs" className="text-yellow-300">الوظائف</Link>
          </nav>
        </div>
      </header>

      <div className="bg-gradient-to-bl from-green-700 to-green-600 text-white py-10 px-6 text-center">
        <h2 className="text-3xl font-bold mb-2">💼 الوظائف المحاسبية</h2>
        <p className="text-green-100">اكتشف أفضل الفرص الوظيفية في مجال المحاسبة والمالية</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <input
            type="text"
            placeholder="🔍 ابحث بالمسمى الوظيفي أو الشركة أو المدينة..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-right mb-4 focus:outline-none focus:ring-2 focus:ring-green-300"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-2 font-medium">نوع الدوام</p>
              <div className="flex gap-2 flex-wrap">
                {JOB_TYPES.map(t => (
                  <button key={t} onClick={() => setJobType(t)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${jobType === t ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-green-50"}`}
                  >{t}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2 font-medium">سنوات الخبرة</p>
              <div className="flex gap-2 flex-wrap">
                {EXPERIENCE.map(e => (
                  <button key={e} onClick={() => setExperience(e)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${experience === e ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-green-50"}`}
                  >{e}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2 font-medium">التخصص</p>
              <div className="flex gap-2 flex-wrap">
                {CATEGORIES.map(c => (
                  <button key={c} onClick={() => setCategory(c)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${category === c ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-green-50"}`}
                  >{c}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="text-gray-500 text-sm mb-4">{filtered.length} وظيفة متاحة</p>

        {loading ? (
          <div className="text-center py-20 text-gray-400">جارٍ التحميل...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">🔍</div>
            <p>لا توجد وظائف تطابق بحثك</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(job => (
              <Link to={`/jobs/${job.id}`} key={job.id} className="block bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-3xl">🏢</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-gray-800 text-lg group-hover:text-green-700 transition-colors">{job.title}</h4>
                        <p className="text-gray-500 mt-0.5">{job.company}</p>
                      </div>
                      {job.salary_range && (
                        <div className="text-green-600 font-bold text-sm whitespace-nowrap">{job.salary_range}</div>
                      )}
                    </div>
                    <div className="flex gap-2 flex-wrap mt-3">
                      <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">📍 {job.location}</span>
                      <span className={`text-xs px-3 py-1 rounded-full ${typeColors[job.job_type] || "bg-gray-100 text-gray-600"}`}>{job.job_type}</span>
                      <span className="bg-orange-100 text-orange-700 text-xs px-3 py-1 rounded-full">⏱ {job.experience_level}</span>
                      <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">{job.category}</span>
                    </div>
                    <p className="text-gray-500 text-sm mt-3 line-clamp-2">{job.description}</p>
                    {job.deadline && (
                      <p className="text-red-400 text-xs mt-2">⏰ آخر موعد: {new Date(job.deadline).toLocaleDateString("ar-SA")}</p>
                    )}
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
