import { useState, useEffect } from "react";
import { supabase } from "../src/supabaseClient";
import { Link, useParams } from "react-router-dom";

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("jobs").select("*").eq("id", id).single().then(({ data }) => {
      setJob(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="flex items-center justify-center min-h-screen text-gray-400" dir="rtl">جاري التحميل...</div>;
  if (!job) return <div className="flex items-center justify-center min-h-screen text-gray-400" dir="rtl">الوظيفة غير موجودة</div>;

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
            <Link to="/jobs" className="text-yellow-300">الوظائف</Link>
          </nav>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <Link to="/jobs" className="text-blue-600 hover:underline text-sm mb-6 inline-block">← العودة للوظائف</Link>
        <div className="bg-white rounded-2xl shadow p-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{job.title}</h1>
              <p className="text-blue-600 text-lg mt-1">🏢 {job.company}</p>
            </div>
            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">{job.job_type}</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl mb-6 text-sm">
            <div><p className="text-gray-400">الموقع</p><p className="font-medium">📍 {job.location}</p></div>
            <div><p className="text-gray-400">الراتب</p><p className="font-medium">💰 {job.salary_range}</p></div>
            <div><p className="text-gray-400">الخبرة</p><p className="font-medium">⏱ {job.experience_level}</p></div>
            <div><p className="text-gray-400">الموعد النهائي</p><p className="font-medium">📅 {job.deadline}</p></div>
          </div>

          <div className="mb-6">
            <h3 className="font-bold text-gray-700 mb-2">📋 وصف الوظيفة</h3>
            <p className="text-gray-600 leading-relaxed">{job.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="font-bold text-gray-700 mb-2">✅ المتطلبات</h3>
            <p className="text-gray-600 leading-relaxed">{job.requirements}</p>
          </div>

          <div className="border-t pt-6 flex gap-4 flex-wrap">
            <a href={`mailto:${job.contact_email}`}
              className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-colors">
              📧 تقدم للوظيفة
            </a>
            <Link to="/jobs" className="bg-gray-100 text-gray-700 px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors">
              العودة
            </Link>
          </div>
        </div>
      </div>

      <footer className="bg-blue-900 text-white py-8 text-center mt-12">
        <p className="text-blue-200 text-sm">© 2026 محاسبون - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
}
