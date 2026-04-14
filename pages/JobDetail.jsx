import { useState, useEffect } from "react";
import { Job } from "@/api/entities";
import { useParams, Link } from "react-router-dom";

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    Job.get(id).then(data => {
      setJob(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div dir="rtl" className="min-h-screen bg-gray-50 flex items-center justify-center" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <div className="text-gray-400 text-xl">جارٍ التحميل...</div>
    </div>
  );

  if (!job) return (
    <div dir="rtl" className="min-h-screen bg-gray-50 flex items-center justify-center" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <div className="text-center">
        <div className="text-5xl mb-4">😕</div>
        <p className="text-gray-500">الوظيفة غير موجودة</p>
        <Link to="/jobs" className="text-blue-600 hover:underline mt-4 block">العودة للوظائف</Link>
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
        <Link to="/jobs" className="text-blue-600 hover:underline text-sm mb-6 block">← العودة للوظائف</Link>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-br from-green-600 to-teal-700 p-8 text-white">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <span className="text-4xl">🏢</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-1">{job.title}</h1>
                <p className="text-green-100 text-lg">{job.company}</p>
                <div className="flex gap-3 flex-wrap mt-3">
                  <span className="bg-white/20 text-white text-sm px-3 py-1 rounded-full">📍 {job.location}</span>
                  <span className="bg-white/20 text-white text-sm px-3 py-1 rounded-full">{job.job_type}</span>
                  <span className="bg-white/20 text-white text-sm px-3 py-1 rounded-full">{job.experience_level}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Salary & Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {job.salary_range && (
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">الراتب</p>
                  <p className="font-bold text-green-700">{job.salary_range}</p>
                </div>
              )}
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">التخصص</p>
                <p className="font-bold text-blue-700 text-sm">{job.category}</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">نوع الدوام</p>
                <p className="font-bold text-purple-700">{job.job_type}</p>
              </div>
              {job.deadline && (
                <div className="bg-red-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">آخر موعد</p>
                  <p className="font-bold text-red-600 text-sm">{new Date(job.deadline).toLocaleDateString("ar-SA")}</p>
                </div>
              )}
            </div>

            {/* Description */}
            {job.description && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-800 mb-3">📋 وصف الوظيفة</h3>
                <p className="text-gray-600 leading-loose whitespace-pre-wrap">{job.description}</p>
              </div>
            )}

            {/* Requirements */}
            {job.requirements && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-800 mb-3">✅ المتطلبات</h3>
                <div className="bg-gray-50 rounded-xl p-5">
                  {job.requirements.split("،").map((req, i) => (
                    <div key={i} className="flex items-start gap-2 mb-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <p className="text-gray-600">{req.trim()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Apply Button */}
            <div className="border-t pt-6">
              {applied ? (
                <div className="bg-green-50 text-green-700 rounded-xl p-4 text-center font-medium">
                  ✅ تم إرسال طلبك بنجاح! سيتم التواصل معك قريباً على {job.contact_email}
                </div>
              ) : (
                <div className="flex gap-4 flex-wrap">
                  <button
                    onClick={() => {
                      setApplied(true);
                      window.open(`mailto:${job.contact_email}?subject=طلب توظيف - ${job.title}`, "_blank");
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl font-bold text-lg transition-colors"
                  >
                    🚀 تقديم الطلب الآن
                  </button>
                  <a
                    href={`mailto:${job.contact_email}`}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium transition-colors"
                  >
                    ✉️ {job.contact_email}
                  </a>
                </div>
              )}
            </div>
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
