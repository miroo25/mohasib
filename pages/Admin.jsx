import { useState, useEffect } from "react";
import { Article } from "@/api/entities";
import { Job } from "@/api/entities";
import { Software } from "@/api/entities";
import { Link, useNavigate } from "react-router-dom";

const ARTICLE_CATEGORIES = ["محاسبة مالية", "ضريبة", "تدقيق", "محاسبة إدارية", "معايير المحاسبة", "تقنية مالية", "أخرى"];
const JOB_TYPES = ["دوام", "جزئي", "عن بعد", "تدريب"];
const EXPERIENCE_LEVELS = ["مبتدئ", "1-3 سنوات", "3-5 سنوات", "+5 سنوات"];
const JOB_CATEGORIES = ["محاسب عام", "مدقق حسابات", "محلل مالي", "مدير مالي", "محاسب ضرائب", "محاسب تكاليف", "أخرى"];
const SW_CATEGORIES = ["محاسبة عامة", "ضريبة وزكاة", "رواتب وموارد بشرية", "تدقيق", "تحليل مالي", "فاتورة وفوترة", "ERP", "أخرى"];
const PRICING_MODELS = ["مجاني", "مدفوع", "مجاني مع خطط مدفوعة", "تجربة مجانية"];

const emptyArticle = { title: "", summary: "", content: "", category: "محاسبة مالية", author: "", tags: "", views: 0, is_published: false };
const emptyJob = { title: "", company: "", location: "", job_type: "دوام", experience_level: "مبتدئ", category: "محاسب عام", description: "", requirements: "", salary_range: "", contact_email: "", deadline: "", is_active: true };
const emptySoftware = { name: "", description: "", category: "محاسبة عامة", website_url: "", pricing_model: "مجاني", price_range: "", features: "", platforms: "", rating: 4.0, is_arabic: false, is_featured: false, is_active: true };

export default function Admin() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("dashboard");
  const [articles, setArticles] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [softwares, setSoftwares] = useState([]);
  const [loading, setLoading] = useState(true);

  // Article form
  const [articleForm, setArticleForm] = useState(emptyArticle);
  const [editingArticleId, setEditingArticleId] = useState(null);
  const [articleModal, setArticleModal] = useState(false);

  // Job form
  const [jobForm, setJobForm] = useState(emptyJob);
  const [editingJobId, setEditingJobId] = useState(null);
  const [jobModal, setJobModal] = useState(false);

  // Software form
  const [swForm, setSwForm] = useState(emptySoftware);
  const [editingSwId, setEditingSwId] = useState(null);
  const [swModal, setSwModal] = useState(false);

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Auth check
  useEffect(() => {
    const isAdmin = localStorage.getItem("muhasiboon_admin");
    if (!isAdmin) {
      navigate("/login");
      return;
    }
    loadData();
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = () => {
    setLoading(true);
    Promise.all([
      Article.list("-created_date"),
      Job.list("-created_date"),
      Software.list("-created_date"),
    ]).then(([a, j, s]) => {
      setArticles(a);
      setJobs(j);
      setSoftwares(s);
      setLoading(false);
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("muhasiboon_admin");
    localStorage.removeItem("muhasiboon_login_time");
    navigate("/login");
  };

  // Article CRUD
  const saveArticle = async () => {
    setSaving(true);
    try {
      if (editingArticleId) { await Article.update(editingArticleId, articleForm); showToast("تم تحديث المقال ✅"); }
      else { await Article.create(articleForm); showToast("تم إضافة المقال ✅"); }
      setArticleModal(false); setArticleForm(emptyArticle); setEditingArticleId(null); loadData();
    } catch { showToast("حدث خطأ!", "error"); }
    setSaving(false);
  };
  const deleteArticle = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا المقال؟")) return;
    await Article.delete(id); showToast("تم الحذف"); loadData();
  };
  const editArticle = (a) => { setArticleForm({...a}); setEditingArticleId(a.id); setArticleModal(true); };
  const togglePublish = async (a) => {
    await Article.update(a.id, { is_published: !a.is_published });
    showToast(a.is_published ? "تم إلغاء النشر" : "تم النشر ✅"); loadData();
  };

  // Job CRUD
  const saveJob = async () => {
    setSaving(true);
    try {
      if (editingJobId) { await Job.update(editingJobId, jobForm); showToast("تم تحديث الوظيفة ✅"); }
      else { await Job.create(jobForm); showToast("تم إضافة الوظيفة ✅"); }
      setJobModal(false); setJobForm(emptyJob); setEditingJobId(null); loadData();
    } catch { showToast("حدث خطأ!", "error"); }
    setSaving(false);
  };
  const deleteJob = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذه الوظيفة؟")) return;
    await Job.delete(id); showToast("تم الحذف"); loadData();
  };
  const editJob = (j) => { setJobForm({...j}); setEditingJobId(j.id); setJobModal(true); };
  const toggleActive = async (j) => {
    await Job.update(j.id, { is_active: !j.is_active });
    showToast(j.is_active ? "تم الإيقاف" : "تم التفعيل ✅"); loadData();
  };

  // Software CRUD
  const saveSoftware = async () => {
    setSaving(true);
    try {
      if (editingSwId) { await Software.update(editingSwId, swForm); showToast("تم تحديث البرنامج ✅"); }
      else { await Software.create(swForm); showToast("تم إضافة البرنامج ✅"); }
      setSwModal(false); setSwForm(emptySoftware); setEditingSwId(null); loadData();
    } catch { showToast("حدث خطأ!", "error"); }
    setSaving(false);
  };
  const deleteSoftware = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا البرنامج؟")) return;
    await Software.delete(id); showToast("تم الحذف"); loadData();
  };
  const editSoftware = (s) => { setSwForm({...s}); setEditingSwId(s.id); setSwModal(true); };
  const toggleSwActive = async (s) => {
    await Software.update(s.id, { is_active: !s.is_active });
    showToast(s.is_active ? "تم الإيقاف" : "تم التفعيل ✅"); loadData();
  };

  const publishedCount = articles.filter(a => a.is_published).length;
  const activeJobsCount = jobs.filter(j => j.is_active).length;
  const activeSWCount = softwares.filter(s => s.is_active).length;

  const navItems = [
    { id: "dashboard", icon: "📊", label: "الرئيسية" },
    { id: "articles", icon: "📰", label: "المقالات" },
    { id: "jobs", icon: "💼", label: "الوظائف" },
    { id: "softwares", icon: "💻", label: "البرامج" },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-gray-100" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-lg text-white font-medium ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}>
          {toast.msg}
        </div>
      )}

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-blue-900 text-white flex-shrink-0 flex flex-col">
          <div className="p-6 border-b border-blue-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-blue-900 font-bold">م</span>
              </div>
              <div>
                <div className="font-bold">محاسبون</div>
                <div className="text-blue-300 text-xs">لوحة الإدارة</div>
              </div>
            </div>
          </div>
          <nav className="p-4 space-y-1 flex-1">
            {navItems.map(item => (
              <button key={item.id} onClick={() => setTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-right ${tab === item.id ? "bg-blue-700 text-white" : "text-blue-200 hover:bg-blue-800"}`}>
                <span>{item.icon}</span><span>{item.label}</span>
              </button>
            ))}
            <div className="pt-4 border-t border-blue-800 mt-2 space-y-1">
              <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-blue-300 hover:bg-blue-800 transition-colors">
                <span>🌐</span><span>عرض المنصة</span>
              </Link>
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-300 hover:bg-red-900/30 transition-colors text-right">
                <span>🚪</span><span>تسجيل الخروج</span>
              </button>
            </div>
          </nav>
          <div className="p-4 border-t border-blue-800">
            <div className="flex items-center gap-2 text-xs text-blue-400">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>admin@muhasiboon.com</span>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-auto">
          <div className="bg-white shadow-sm px-8 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              {tab === "dashboard" && "📊 لوحة التحكم"}
              {tab === "articles" && "📰 إدارة المقالات"}
              {tab === "jobs" && "💼 إدارة الوظائف"}
              {tab === "softwares" && "💻 إدارة البرامج"}
            </h2>
            <div>
              {tab === "articles" && (
                <button onClick={() => { setArticleForm(emptyArticle); setEditingArticleId(null); setArticleModal(true); }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-medium">+ إضافة مقال</button>
              )}
              {tab === "jobs" && (
                <button onClick={() => { setJobForm(emptyJob); setEditingJobId(null); setJobModal(true); }}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl text-sm font-medium">+ إضافة وظيفة</button>
              )}
              {tab === "softwares" && (
                <button onClick={() => { setSwForm(emptySoftware); setEditingSwId(null); setSwModal(true); }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-sm font-medium">+ إضافة برنامج</button>
              )}
            </div>
          </div>

          <div className="p-8">
            {/* Dashboard */}
            {tab === "dashboard" && (
              <div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
                  {[
                    { label: "إجمالي المقالات", value: articles.length, sub: `${publishedCount} منشور`, icon: "📰", color: "bg-blue-500" },
                    { label: "إجمالي الوظائف", value: jobs.length, sub: `${activeJobsCount} نشطة`, icon: "💼", color: "bg-green-500" },
                    { label: "البرامج", value: softwares.length, sub: `${activeSWCount} نشط`, icon: "💻", color: "bg-indigo-500" },
                    { label: "إجمالي المشاهدات", value: articles.reduce((s, a) => s + (a.views || 0), 0).toLocaleString(), sub: "للمقالات", icon: "👁", color: "bg-purple-500" },
                  ].map(stat => (
                    <div key={stat.label} className="bg-white rounded-2xl shadow-sm p-6">
                      <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-2xl mb-4`}>{stat.icon}</div>
                      <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
                      <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
                      <div className="text-gray-400 text-xs mt-0.5">{stat.sub}</div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h3 className="font-bold text-gray-700 mb-4">📰 أحدث المقالات</h3>
                    {articles.slice(0, 5).map(a => (
                      <div key={a.id} className="flex items-center justify-between py-2.5 border-b last:border-0">
                        <p className="font-medium text-sm text-gray-700 line-clamp-1 flex-1">{a.title}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full mr-2 flex-shrink-0 ${a.is_published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{a.is_published ? "منشور" : "مسودة"}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h3 className="font-bold text-gray-700 mb-4">💼 أحدث الوظائف</h3>
                    {jobs.slice(0, 5).map(j => (
                      <div key={j.id} className="flex items-center justify-between py-2.5 border-b last:border-0">
                        <div className="flex-1 min-w-0"><p className="font-medium text-sm text-gray-700 truncate">{j.title}</p><p className="text-xs text-gray-400">{j.company}</p></div>
                        <span className={`text-xs px-2 py-0.5 rounded-full mr-2 flex-shrink-0 ${j.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"}`}>{j.is_active ? "نشطة" : "موقوفة"}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h3 className="font-bold text-gray-700 mb-4">💻 أحدث البرامج</h3>
                    {softwares.slice(0, 5).map(s => (
                      <div key={s.id} className="flex items-center justify-between py-2.5 border-b last:border-0">
                        <p className="font-medium text-sm text-gray-700 flex-1">{s.name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full mr-2 flex-shrink-0 ${s.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"}`}>{s.is_active ? "نشط" : "موقوف"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Articles Tab */}
            {tab === "articles" && (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 text-gray-600 text-sm">
                    <tr>
                      <th className="text-right px-6 py-4 font-medium">العنوان</th>
                      <th className="text-right px-4 py-4 font-medium">التصنيف</th>
                      <th className="text-right px-4 py-4 font-medium">الكاتب</th>
                      <th className="text-right px-4 py-4 font-medium">المشاهدات</th>
                      <th className="text-right px-4 py-4 font-medium">الحالة</th>
                      <th className="text-right px-4 py-4 font-medium">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {articles.map(article => (
                      <tr key={article.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4"><p className="font-medium text-gray-800 line-clamp-1 max-w-xs">{article.title}</p></td>
                        <td className="px-4 py-4"><span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{article.category}</span></td>
                        <td className="px-4 py-4 text-sm text-gray-600">{article.author}</td>
                        <td className="px-4 py-4 text-sm text-gray-600">👁 {article.views?.toLocaleString()}</td>
                        <td className="px-4 py-4">
                          <button onClick={() => togglePublish(article)}
                            className={`text-xs px-3 py-1 rounded-full font-medium cursor-pointer ${article.is_published ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                            {article.is_published ? "✅ منشور" : "📝 مسودة"}
                          </button>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <button onClick={() => editArticle(article)} className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-medium">✏️ تعديل</button>
                            <button onClick={() => deleteArticle(article.id)} className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-medium">🗑 حذف</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Jobs Tab */}
            {tab === "jobs" && (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 text-gray-600 text-sm">
                    <tr>
                      <th className="text-right px-6 py-4 font-medium">المسمى</th>
                      <th className="text-right px-4 py-4 font-medium">الشركة</th>
                      <th className="text-right px-4 py-4 font-medium">المدينة</th>
                      <th className="text-right px-4 py-4 font-medium">النوع</th>
                      <th className="text-right px-4 py-4 font-medium">الراتب</th>
                      <th className="text-right px-4 py-4 font-medium">الحالة</th>
                      <th className="text-right px-4 py-4 font-medium">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {jobs.map(job => (
                      <tr key={job.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-800">{job.title}</td>
                        <td className="px-4 py-4 text-sm text-gray-600">{job.company}</td>
                        <td className="px-4 py-4 text-sm text-gray-600">📍 {job.location}</td>
                        <td className="px-4 py-4"><span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">{job.job_type}</span></td>
                        <td className="px-4 py-4 text-sm text-green-600 font-medium">{job.salary_range}</td>
                        <td className="px-4 py-4">
                          <button onClick={() => toggleActive(job)}
                            className={`text-xs px-3 py-1 rounded-full font-medium cursor-pointer ${job.is_active ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-500 hover:bg-red-200"}`}>
                            {job.is_active ? "🟢 نشطة" : "🔴 موقوفة"}
                          </button>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <button onClick={() => editJob(job)} className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-medium">✏️ تعديل</button>
                            <button onClick={() => deleteJob(job.id)} className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-medium">🗑 حذف</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Softwares Tab */}
            {tab === "softwares" && (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 text-gray-600 text-sm">
                    <tr>
                      <th className="text-right px-6 py-4 font-medium">اسم البرنامج</th>
                      <th className="text-right px-4 py-4 font-medium">التصنيف</th>
                      <th className="text-right px-4 py-4 font-medium">التسعير</th>
                      <th className="text-right px-4 py-4 font-medium">التقييم</th>
                      <th className="text-right px-4 py-4 font-medium">عربي</th>
                      <th className="text-right px-4 py-4 font-medium">الحالة</th>
                      <th className="text-right px-4 py-4 font-medium">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {softwares.map(s => (
                      <tr key={s.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-800">{s.name}</td>
                        <td className="px-4 py-4"><span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full">{s.category}</span></td>
                        <td className="px-4 py-4 text-sm text-gray-600">{s.pricing_model}</td>
                        <td className="px-4 py-4 text-sm text-yellow-500">{'★'.repeat(Math.round(s.rating || 0))} <span className="text-gray-500 text-xs">{s.rating}</span></td>
                        <td className="px-4 py-4 text-sm">{s.is_arabic ? "✅" : "—"}</td>
                        <td className="px-4 py-4">
                          <button onClick={() => toggleSwActive(s)}
                            className={`text-xs px-3 py-1 rounded-full font-medium cursor-pointer ${s.is_active ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-500 hover:bg-red-200"}`}>
                            {s.is_active ? "🟢 نشط" : "🔴 موقوف"}
                          </button>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <button onClick={() => editSoftware(s)} className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-medium">✏️ تعديل</button>
                            <button onClick={() => deleteSoftware(s.id)} className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-medium">🗑 حذف</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Article Modal */}
      {articleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-lg font-bold">{editingArticleId ? "✏️ تعديل مقال" : "➕ إضافة مقال"}</h3>
              <button onClick={() => setArticleModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">عنوان المقال *</label>
                <input value={articleForm.title} onChange={e => setArticleForm({...articleForm, title: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="أدخل عنوان المقال"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">التصنيف</label>
                  <select value={articleForm.category} onChange={e => setArticleForm({...articleForm, category: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-300">
                    {ARTICLE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الكاتب</label>
                  <input value={articleForm.author} onChange={e => setArticleForm({...articleForm, author: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="اسم الكاتب"/>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الملخص</label>
                <textarea value={articleForm.summary} onChange={e => setArticleForm({...articleForm, summary: e.target.value})} rows={2}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none" placeholder="ملخص قصير"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">المحتوى *</label>
                <textarea value={articleForm.content} onChange={e => setArticleForm({...articleForm, content: e.target.value})} rows={6}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none" placeholder="محتوى المقال..."/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الوسوم (مفصولة بفاصلة)</label>
                <input value={articleForm.tags} onChange={e => setArticleForm({...articleForm, tags: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="محاسبة, ضريبة"/>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={articleForm.is_published} onChange={e => setArticleForm({...articleForm, is_published: e.target.checked})} className="w-4 h-4"/>
                <span className="text-sm font-medium text-gray-700">نشر المقال فوراً</span>
              </label>
            </div>
            <div className="p-6 border-t flex gap-3 justify-end">
              <button onClick={() => setArticleModal(false)} className="px-5 py-2.5 rounded-xl border text-gray-600 hover:bg-gray-50 text-sm">إلغاء</button>
              <button onClick={saveArticle} disabled={saving} className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium disabled:opacity-60">
                {saving ? "جارٍ الحفظ..." : editingArticleId ? "حفظ التعديلات" : "إضافة المقال"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Job Modal */}
      {jobModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-lg font-bold">{editingJobId ? "✏️ تعديل وظيفة" : "➕ إضافة وظيفة"}</h3>
              <button onClick={() => setJobModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">المسمى الوظيفي *</label>
                  <input value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-300" placeholder="محاسب عام"/></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">الشركة *</label>
                  <input value={jobForm.company} onChange={e => setJobForm({...jobForm, company: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-300" placeholder="اسم الشركة"/></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">المدينة</label>
                  <input value={jobForm.location} onChange={e => setJobForm({...jobForm, location: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-300" placeholder="الرياض"/></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">نطاق الراتب</label>
                  <input value={jobForm.salary_range} onChange={e => setJobForm({...jobForm, salary_range: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-300" placeholder="8000 - 12000 ريال"/></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">نوع الدوام</label>
                  <select value={jobForm.job_type} onChange={e => setJobForm({...jobForm, job_type: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-300">
                    {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">الخبرة</label>
                  <select value={jobForm.experience_level} onChange={e => setJobForm({...jobForm, experience_level: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-300">
                    {EXPERIENCE_LEVELS.map(e => <option key={e} value={e}>{e}</option>)}</select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">التخصص</label>
                  <select value={jobForm.category} onChange={e => setJobForm({...jobForm, category: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-300">
                    {JOB_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">وصف الوظيفة</label>
                <textarea value={jobForm.description} onChange={e => setJobForm({...jobForm, description: e.target.value})} rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-300 resize-none" placeholder="وصف الوظيفة..."/></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">المتطلبات</label>
                <textarea value={jobForm.requirements} onChange={e => setJobForm({...jobForm, requirements: e.target.value})} rows={2}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-300 resize-none" placeholder="المؤهلات والمتطلبات..."/></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">بريد التواصل</label>
                  <input value={jobForm.contact_email} onChange={e => setJobForm({...jobForm, contact_email: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-300" placeholder="hr@company.com"/></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">آخر موعد</label>
                  <input type="date" value={jobForm.deadline} onChange={e => setJobForm({...jobForm, deadline: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-300"/></div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={jobForm.is_active} onChange={e => setJobForm({...jobForm, is_active: e.target.checked})} className="w-4 h-4"/>
                <span className="text-sm font-medium text-gray-700">تفعيل الوظيفة فوراً</span>
              </label>
            </div>
            <div className="p-6 border-t flex gap-3 justify-end">
              <button onClick={() => setJobModal(false)} className="px-5 py-2.5 rounded-xl border text-gray-600 hover:bg-gray-50 text-sm">إلغاء</button>
              <button onClick={saveJob} disabled={saving} className="px-6 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-medium disabled:opacity-60">
                {saving ? "جارٍ الحفظ..." : editingJobId ? "حفظ التعديلات" : "إضافة الوظيفة"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Software Modal */}
      {swModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-lg font-bold">{editingSwId ? "✏️ تعديل برنامج" : "➕ إضافة برنامج"}</h3>
              <button onClick={() => setSwModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">اسم البرنامج *</label>
                  <input value={swForm.name} onChange={e => setSwForm({...swForm, name: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="QuickBooks"/></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">التصنيف</label>
                  <select value={swForm.category} onChange={e => setSwForm({...swForm, category: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300">
                    {SW_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">وصف البرنامج *</label>
                <textarea value={swForm.description} onChange={e => setSwForm({...swForm, description: e.target.value})} rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none" placeholder="وصف تفصيلي للبرنامج..."/></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">نموذج التسعير</label>
                  <select value={swForm.pricing_model} onChange={e => setSwForm({...swForm, pricing_model: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300">
                    {PRICING_MODELS.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">نطاق السعر</label>
                  <input value={swForm.price_range} onChange={e => setSwForm({...swForm, price_range: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="من $15/شهر"/></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">رابط الموقع</label>
                  <input value={swForm.website_url} onChange={e => setSwForm({...swForm, website_url: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="https://..."/></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">التقييم (1-5)</label>
                  <input type="number" min="1" max="5" step="0.1" value={swForm.rating} onChange={e => setSwForm({...swForm, rating: parseFloat(e.target.value)})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300"/></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">المميزات (مفصولة بفاصلة)</label>
                <input value={swForm.features} onChange={e => setSwForm({...swForm, features: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="فواتير, تقارير, ضريبة القيمة المضافة"/></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">المنصات المتاحة</label>
                <input value={swForm.platforms} onChange={e => setSwForm({...swForm, platforms: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="ويب, iOS, Android, Windows"/></div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={swForm.is_arabic} onChange={e => setSwForm({...swForm, is_arabic: e.target.checked})} className="w-4 h-4"/>
                  <span className="text-sm font-medium text-gray-700">يدعم العربية</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={swForm.is_featured} onChange={e => setSwForm({...swForm, is_featured: e.target.checked})} className="w-4 h-4"/>
                  <span className="text-sm font-medium text-gray-700">مميز ⭐</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={swForm.is_active} onChange={e => setSwForm({...swForm, is_active: e.target.checked})} className="w-4 h-4"/>
                  <span className="text-sm font-medium text-gray-700">نشط</span>
                </label>
              </div>
            </div>
            <div className="p-6 border-t flex gap-3 justify-end">
              <button onClick={() => setSwModal(false)} className="px-5 py-2.5 rounded-xl border text-gray-600 hover:bg-gray-50 text-sm">إلغاء</button>
              <button onClick={saveSoftware} disabled={saving} className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium disabled:opacity-60">
                {saving ? "جارٍ الحفظ..." : editingSwId ? "حفظ التعديلات" : "إضافة البرنامج"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
